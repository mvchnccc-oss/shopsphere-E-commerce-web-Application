package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.ProductDto;
import com.abdullah.eCommerce.dtos.SellerProductDto;
import com.abdullah.eCommerce.dtos.requests.CreateProductRequest;
import com.abdullah.eCommerce.dtos.responses.GetProductsResponse;
import com.abdullah.eCommerce.entities.*;
import com.abdullah.eCommerce.exceptions.CategoryNotFoundException;
import com.abdullah.eCommerce.exceptions.ProductNotFoundException;
import com.abdullah.eCommerce.mappers.ProductMapper;
import com.abdullah.eCommerce.repositories.CategoryRepository;
import com.abdullah.eCommerce.repositories.ProductImageRepository;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.repositories.UserRepository;
import com.abdullah.eCommerce.services.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    @Override
    public GetProductsResponse getProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findAll(pageable);

        List<ProductDto> products = productMapper.toDtoList(productPage.getContent());

        return new GetProductsResponse(
            products,
            productPage.getNumber(),
            productPage.getTotalPages(),
            productPage.getTotalElements(),
            productPage.getSize()
        );
    }

    @Override
    public GetProductsResponse getProducts(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findAllByCategoryId(categoryId, pageable);

        List<ProductDto> products = productMapper.toDtoList(productPage.getContent());

        return new GetProductsResponse(
            products,
            productPage.getNumber(),
            productPage.getTotalPages(),
            productPage.getTotalElements(),
            productPage.getSize()
        );
    }

    @Override
    public GetProductsResponse getProducts(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findByTitleContainingIgnoreCase(searchTerm, pageable);

        List<ProductDto> products = productMapper.toDtoList(productPage.getContent());

        return new GetProductsResponse(
            products,
            productPage.getNumber(),
            productPage.getTotalPages(),
            productPage.getTotalElements(),
            productPage.getSize()
        );
    }

    @Override
    public ProductDto getProduct(Long id) {
        Product product = productRepository
            .findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));

        return productMapper.toDto(product);
    }

    @Override
    public void createProduct(Long userId, CreateProductRequest body) {
        Category category = categoryRepository.findByName(body.category)
            .orElseThrow(() -> new CategoryNotFoundException(0L));
        
        Product product = Product.builder()
            .category(category)
            .price(body.price)
            .description(body.description)
            .title(body.title)
            .seller(userRepository.getReferenceById(userId))
            .build();
        productRepository.save(product);

        if (body.images != null && !body.images.isEmpty()) {
            List<ProductImage> productImages = body.images.stream().map(item ->
                ProductImage.builder()
                    .product(product)
                    .id(new ProductImage.Id(product.getId(), item))
                    .build()
            ).collect(Collectors.toList());

            productImageRepository.saveAll(productImages);
        }
    }

    @Override
    @Transactional
    public void deleteProduct(User user, Long id) {
        if (user.getRole() == UserRole.Admin) {
            productRepository.deleteById(id);
            return;
        }

        productRepository.deleteByIdAndSellerId(id, user.getId());
    }

    @Override
    @Transactional
    public void updateProduct(Long userId, Long id, CreateProductRequest body) {
        Product product = productRepository.findByIdAndSellerId(id, userId)
            .orElseThrow(() -> new ProductNotFoundException(id));

        if (!body.category.equals(product.getCategory().getName())) {
            Category category = categoryRepository.findByName(body.category)
                .orElseThrow(() -> new CategoryNotFoundException(0L));
            product.setCategory(category);
        }

        var productImages = product.getImages().stream().map(i -> i.getId().getImage()).toList();
        if (!productImages.equals(body.images)) {
            productImageRepository.deleteByProductId(product.getId());

            var newImages = body.images.stream().map(item ->
                ProductImage.builder()
                    .product(product)
                    .id(new ProductImage.Id(product.getId(), item))
                    .build()
            ).collect(Collectors.toList());

            productImageRepository.saveAll(newImages);
            product.getImages().clear();
            product.getImages().addAll(newImages);
        }

        product.setTitle(body.title);
        product.setDescription(body.description);
        product.setPrice(body.price);

        productRepository.save(product);
    }

    @Override
    public List<SellerProductDto> getUserProducts(Long userId) {
        List<Product> products = productRepository.findBySellerId(userId);

        return productMapper.toSellerDtoList(products);
    }
}
