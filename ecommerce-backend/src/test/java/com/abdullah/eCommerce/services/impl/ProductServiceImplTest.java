package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.ProductDto;
import com.abdullah.eCommerce.dtos.SellerProductDto;
import com.abdullah.eCommerce.dtos.requests.CreateProductRequest;
import com.abdullah.eCommerce.dtos.responses.GetProductsResponse;
import com.abdullah.eCommerce.entities.Category;
import com.abdullah.eCommerce.entities.Product;
import com.abdullah.eCommerce.entities.ProductImage;
import com.abdullah.eCommerce.entities.User;
import com.abdullah.eCommerce.exceptions.CategoryNotFoundException;
import com.abdullah.eCommerce.exceptions.ProductNotFoundException;
import com.abdullah.eCommerce.mappers.CategoryMapperImpl;
import com.abdullah.eCommerce.mappers.ProductMapper;
import com.abdullah.eCommerce.mappers.ProductMapperImpl;
import com.abdullah.eCommerce.repositories.CategoryRepository;
import com.abdullah.eCommerce.repositories.ProductImageRepository;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.services.ProductService;
import com.abdullah.eCommerce.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@Import({ProductMapperImpl.class, CategoryMapperImpl.class})
class ProductServiceImplTest {

    @Autowired
    private ProductMapper productMapper;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductImageRepository productImageRepository;

    @Mock
    private UserService userService;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductServiceImpl(
            productRepository,
            categoryRepository,
            productImageRepository,
            userService,
            productMapper
        );
    }

    @Nested
    @DisplayName("Get All Products")
    class GetProducts {
        @Test
        @DisplayName("All")
        void getProducts() {
            Pageable pageable = PageRequest.of(0, 10);

            List<Product> products = IntStream.rangeClosed(1, 10)
                .mapToObj(i -> Product.builder()
                    .id((long) i)
                    .title("Product " + i)
                    .build())
                .toList();

            Page<Product> productPage = new PageImpl<>(products, pageable, 10);

            when(productRepository.findAll(pageable)).thenReturn(productPage);

            GetProductsResponse response = productService.getProducts(pageable.getPageNumber(), pageable.getPageSize());

            assertEquals(10, response.products.size());
            assertEquals(0, response.currentPage);
            assertEquals(1, response.totalPages);
            assertEquals(10L, response.totalElements);
            assertEquals(10, response.pageSize);

            verify(productRepository).findAll(pageable);
        }

        @Test
        @DisplayName("By Category")
        void getProductsByCategory() {
            Long categoryId = 1L;
            Pageable pageable = PageRequest.of(0, 10);

            List<Product> products = IntStream.rangeClosed(1, 10)
                .mapToObj(i -> Product.builder()
                    .id((long) i)
                    .title("Product " + i)
                    .category(Category.builder().id(categoryId).name("Category " + i).build())
                    .build())
                .toList();

            Page<Product> productPage = new PageImpl<>(products, pageable, 10L);

            when(productRepository.findAllByCategoryId(categoryId, pageable)).thenReturn(productPage);

            GetProductsResponse response = productService.getProducts(
                categoryId, pageable.getPageNumber(), pageable.getPageSize()
            );

            assertEquals(10, response.products.size());
            assertEquals(0, response.currentPage);
            assertEquals(1, response.totalPages);
            assertEquals(10L, response.totalElements);
            assertEquals(10, response.pageSize);

            verify(productRepository).findAllByCategoryId(categoryId, pageable);
        }

        @Test
        @DisplayName("By Search term")
        void getProductsBySearchTerm() {
            String searchTerm = "laptop";
            Pageable pageable = PageRequest.of(0, 10);

            List<Product> products = IntStream.rangeClosed(1, 10)
                .mapToObj(i -> Product.builder()
                    .id((long) i)
                    .title("Laptop " + i)
                    .build())
                .toList();

            Page<Product> productPage = new PageImpl<>(products, pageable, 10L);

            when(productRepository.findByTitleContainingIgnoreCase(searchTerm, pageable)).thenReturn(productPage);

            GetProductsResponse response = productService.getProducts(
                searchTerm, pageable.getPageNumber(), pageable.getPageSize()
            );

            assertEquals(10, response.products.size());
            assertEquals(0, response.currentPage);
            assertEquals(1, response.totalPages);
            assertEquals(10L, response.totalElements);
            assertEquals(10, response.pageSize);
            assertTrue(
                response.products.stream()
                    .allMatch(p -> p.getTitle().toLowerCase().contains(searchTerm))
            );

            verify(productRepository).findByTitleContainingIgnoreCase(searchTerm, pageable);
        }
    }

    @Nested
    @DisplayName("Get Specific Product")
    class GetProduct {
        @Test
        @DisplayName("Get")
        void getProduct() {
            // Arrange
            Product product = Product.builder()
                .id(1L)
                .title("Laptop")
                .category(Category.builder().name("Electronics").build())
                .build();

            when(productRepository.findById(1L)).thenReturn(Optional.of(product));

            ProductDto result = productService.getProduct(1L);

            // Assert
            assertNotNull(result);
            assertEquals("Laptop", result.getTitle());

            verify(productRepository).findById(1L);
        }

        @Test
        @DisplayName("Get non-existing product")
        void shouldThrowProductNotFoundException_whenProductNotFound() {
            // Arrange
            when(productRepository.findById(1L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(ProductNotFoundException.class, () -> productService.getProduct(1L));

            verify(productRepository).findById(1L);
        }
    }

    @Nested
    @DisplayName("Create Product")
    class CreateProduct {
        @Test
        @DisplayName("Without Images - Null")
        void createProductWithNullImages() {
            CreateProductRequest request = new CreateProductRequest(
                "Laptop", "Description", new BigDecimal("999.99"), "Electronics", null
            );

            Category category = Category.builder().name("Electronics").build();
            User user = User.builder().id(1L).name("Seller").build();

            when(categoryRepository.findByName("Electronics")).thenReturn(Optional.of(category));
            when(userService.getUser()).thenReturn(user);

            productService.createProduct(request);

            verify(productRepository).save(any(Product.class));
            verify(productImageRepository, never()).saveAll(any());
        }

        @Test
        @DisplayName("Without Images - Empty")
        void createProductWithEmptyImages() {
            CreateProductRequest request = new CreateProductRequest(
                "Laptop", "Description", new BigDecimal("999.99"), "Electronics", Collections.emptyList()
            );

            Category category = Category.builder().name("Electronics").build();
            User user = User.builder().id(1L).name("Seller").build();

            when(categoryRepository.findByName("Electronics")).thenReturn(Optional.of(category));
            when(userService.getUser()).thenReturn(user);

            productService.createProduct(request);

            verify(productRepository).save(any(Product.class));
            verify(productImageRepository, never()).saveAll(any());
        }

        @Test
        @DisplayName("With Images")
        void createProductWithImages() {
            CreateProductRequest request = new CreateProductRequest(
                "Laptop", "Description",
                new BigDecimal("999.99"), "Electronics", List.of("img1.jpg", "img2.jpg")
            );

            Category category = Category.builder().name("Electronics").build();
            User user = User.builder().id(1L).name("Seller").build();

            when(categoryRepository.findByName("Electronics")).thenReturn(Optional.of(category));
            when(userService.getUser()).thenReturn(user);

            productService.createProduct(request);

            verify(productRepository).save(any(Product.class));
            verify(productImageRepository).saveAll(any());
        }

        @Test
        @DisplayName("Category Not Found")
        void createProductCategoryNotFound() {
            CreateProductRequest request = new CreateProductRequest(
                "Laptop", "Description",
                new BigDecimal("999.99"), "Electronics", null
            );

            when(categoryRepository.findByName("Electronics")).thenReturn(Optional.empty());

            assertThrows(CategoryNotFoundException.class, () -> productService.createProduct(request));

            verify(productRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Delete Product")
    class DeleteProduct {
        @Test
        @DisplayName("By Id")
        void deleteProduct() {
            User user = User.builder().id(1L).build();
            when(userService.getUser()).thenReturn(user);

            productService.deleteProduct(1L);

            verify(productRepository).deleteByIdAndSellerId(1L, 1L);
        }
    }

    @Nested
    @DisplayName("Update Product")
    class UpdateProduct {
        @Test
        @DisplayName("Same Category")
        void updateProductSameCategory() {
            CreateProductRequest request = new CreateProductRequest(
                "Updated Laptop", "Updated Desc",
                new BigDecimal("1099.99"), "Electronics", List.of("img1.jpg")
            );

            User user = User.builder().id(1L).build();
            Category category = Category.builder().name("Electronics").build();

            ProductImage.Id imageId = new ProductImage.Id(1L, "img1.jpg");
            ProductImage image = ProductImage.builder().id(imageId).build();

            Product product = Product.builder()
                .id(1L)
                .title("Laptop")
                .category(category)
                .seller(user)
                .images(new ArrayList<>(List.of(image)))
                .build();

            when(userService.getUser()).thenReturn(user);
            when(productRepository.findByIdAndSellerId(1L, 1L)).thenReturn(Optional.of(product));

            productService.updateProduct(1L, request);

            verify(productRepository).save(product);
            verify(categoryRepository, never()).findByName(any());
            verify(productImageRepository, never()).deleteByProductId(any());
        }

        @Test
        @DisplayName("Different Category")
        void updateProductDifferentCategory() {
            CreateProductRequest request = new CreateProductRequest(
                "Updated Laptop", "Updated Desc", new BigDecimal("1099.99"),
                "Phones", List.of("img1.jpg")
            );

            User user = User.builder().id(1L).build();
            Category oldCategory = Category.builder().name("Electronics").build();
            Category newCategory = Category.builder().name("Phones").build();

            ProductImage.Id imageId = new ProductImage.Id(1L, "img1.jpg");
            ProductImage image = ProductImage.builder().id(imageId).build();

            Product product = Product.builder()
                .id(1L)
                .title("Laptop")
                .category(oldCategory)
                .seller(user)
                .images(new ArrayList<>(List.of(image)))
                .build();

            when(userService.getUser()).thenReturn(user);
            when(productRepository.findByIdAndSellerId(1L, 1L)).thenReturn(Optional.of(product));
            when(categoryRepository.findByName("Phones")).thenReturn(Optional.of(newCategory));

            productService.updateProduct(1L, request);

            verify(categoryRepository).findByName("Phones");
            verify(productRepository).save(product);
            assertEquals("Phones", product.getCategory().getName());
        }

        @Test
        @DisplayName("Different Images")
        void updateProductDifferentImages() {
            CreateProductRequest request = new CreateProductRequest(
                "Laptop", "Desc", new BigDecimal("999.99"),
                "Electronics", List.of("new-img.jpg")
            );

            User user = User.builder().id(1L).build();
            Category category = Category.builder().name("Electronics").build();

            ProductImage.Id imageId = new ProductImage.Id(1L, "old-img.jpg");
            ProductImage image = ProductImage.builder().id(imageId).build();

            Product product = Product.builder()
                .id(1L)
                .title("Laptop")
                .category(category)
                .seller(user)
                .images(new ArrayList<>(List.of(image)))
                .build();

            when(userService.getUser()).thenReturn(user);
            when(productRepository.findByIdAndSellerId(1L, 1L)).thenReturn(Optional.of(product));

            productService.updateProduct(1L, request);

            verify(productImageRepository).deleteByProductId(1L);
            verify(productImageRepository).saveAll(any());
        }

        @Test
        @DisplayName("Product Not Found")
        void updateProductNotFound() {
            CreateProductRequest request = new CreateProductRequest(
                "Laptop", "Desc", new BigDecimal("999.99"),
                "Electronics", null
            );

            User user = User.builder().id(1L).build();
            when(userService.getUser()).thenReturn(user);
            when(productRepository.findByIdAndSellerId(1L, 1L)).thenReturn(Optional.empty());

            assertThrows(ProductNotFoundException.class, () -> productService.updateProduct(1L, request));

            verify(productRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Get User Products")
    class GetUserProducts {

        @Test
        @DisplayName("All")
        void getUserProducts() {
            User user = User.builder().id(1L).build();

            List<Product> products = IntStream.rangeClosed(1, 5)
                .mapToObj(i -> Product.builder()
                    .id((long) i)
                    .title("Product " + i)
                    .seller(user)
                    .category(Category.builder().name("Electronics").build())
                    .images(Collections.emptyList())
                    .build())
                .toList();

            when(userService.getUser()).thenReturn(user);
            when(productRepository.findBySellerId(1L)).thenReturn(products);

            List<SellerProductDto> result = productService.getUserProducts();

            assertEquals(5, result.size());
            verify(productRepository).findBySellerId(1L);
        }
    }
}