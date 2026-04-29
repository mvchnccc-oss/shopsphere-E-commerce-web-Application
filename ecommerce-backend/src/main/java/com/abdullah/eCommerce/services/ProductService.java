package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.dtos.ProductDto;
import com.abdullah.eCommerce.dtos.requests.CreateProductRequest;
import com.abdullah.eCommerce.dtos.responses.GetProductsResponse;

public interface ProductService {
    GetProductsResponse getProducts(int page, int size);

    GetProductsResponse getProducts(Long categoryId, int page, int size);

    ProductDto getProduct(Long id);

    void createProduct(CreateProductRequest product);

    void deleteProduct(Long id);
}
