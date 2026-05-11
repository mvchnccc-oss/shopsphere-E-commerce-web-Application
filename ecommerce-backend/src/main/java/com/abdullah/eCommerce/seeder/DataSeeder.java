package com.abdullah.eCommerce.seeder;

import com.abdullah.eCommerce.dtos.seeders.ProductSeedDto;
import com.abdullah.eCommerce.entities.*;
import com.abdullah.eCommerce.exceptions.UserAlreadyExistsException;
import com.abdullah.eCommerce.repositories.CategoryRepository;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@Component
public class DataSeeder implements ApplicationRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final PasswordEncoder passwordEncoder;

    private static final int CHUNK_SIZE = 100;

    @Value("${admin.name}")
    private String adminName;
    @Value("${admin.email}")
    private String adminEmail;
    @Value("${admin.password}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(@NonNull ApplicationArguments args) throws Exception {
        var userExist = userRepository.findByEmail(adminEmail);
        if (userExist.isPresent()) {
            if (!userExist.get().getRole().equals(UserRole.Admin))
                throw new UserAlreadyExistsException(" Failed to create admin account, email is taken");
        } else {
            userRepository.save(
                User.builder()
                    .name(adminName)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(UserRole.Admin)
                    .build()
            );
        }


        if (productRepository.count() > 0) {
            log.info("Already seeded, skipping.");
            return;
        }

        ClassPathResource resource = new ClassPathResource("data/products.json");
        ProductSeedDto[] dtos = objectMapper.readValue(
            resource.getInputStream(),
            ProductSeedDto[].class
        );

        // 1. Save all unique categories first
        Map<String, Category> categoryCache = new HashMap<>();
        Map<String, User> userCache = new HashMap<>();

        for (ProductSeedDto dto : dtos) {
            String catName = dto.getCategory().getName();
            categoryCache.computeIfAbsent(catName, name -> {
                Category c = Category.builder()
                    .name(dto.getCategory().getName())
                    .image(dto.getCategory().getImage())
                    .build();
                return categoryRepository.save(c);
            });
        }

        // 2. Build all products in memory
        List<Product> allProducts = new ArrayList<>();
        for (ProductSeedDto dto : dtos) {
            Category category = categoryCache.get(dto.getCategory().getName());

            User seller = userCache.computeIfAbsent(dto.getSeller().getEmail(), email ->
                userRepository.findByEmail(email)
                    .orElseGet(() -> userRepository.save(
                        User.builder()
                            .name(dto.getSeller().getName())
                            .email(dto.getSeller().getEmail())
                            .password(passwordEncoder.encode(dto.getSeller().getPassword()))
                            .role(UserRole.Seller)
                            .build()
                    ))
            );

            Product product = Product.builder()
                .title(dto.getTitle())
                .price(dto.getPrice())
                .description(dto.getDescription())
                .category(category)
                .seller(seller)
                .build();

            if (dto.getImages() != null) {
                List<ProductImage> productImages = dto.getImages().stream().map(imgUrl -> {
                    ProductImage.Id imgId = new ProductImage.Id(null, imgUrl);

                    return ProductImage.builder()
                        .id(imgId)
                        .product(product)
                        .build();
                }).toList();
                product.setImages(productImages);
            }

            allProducts.add(product);
        }

        // 3. Insert in chunks of 100
        int total = allProducts.size();
        for (int i = 0; i < total; i += CHUNK_SIZE) {
            List<Product> chunk = allProducts.subList(i, Math.min(i + CHUNK_SIZE, total));
            productRepository.saveAll(chunk);
            log.info("Inserted {} / {} products", Math.min(i + CHUNK_SIZE, total), total);
        }

        log.info("Seeding complete! Total: {} products.", total);
    }
}