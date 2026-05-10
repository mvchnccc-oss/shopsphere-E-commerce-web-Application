package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.dtos.ProductDto;
import com.abdullah.eCommerce.dtos.SellerProductDto;
import com.abdullah.eCommerce.dtos.requests.CreateProductRequest;
import com.abdullah.eCommerce.dtos.responses.GetProductsResponse;
import com.abdullah.eCommerce.entities.User;

import java.util.List;

public interface ProductService {
    GetProductsResponse getProducts(int page, int size);

    GetProductsResponse getProducts(Long categoryId, int page, int size);

    GetProductsResponse getProducts(String searchTerm, int page, int size);

    ProductDto getProduct(Long id);

    void createProduct(Long userId, CreateProductRequest product);

    void deleteProduct(User user, Long id);

    void updateProduct(Long userId, Long id, CreateProductRequest product);

    List<SellerProductDto> getUserProducts(Long userId);
}
