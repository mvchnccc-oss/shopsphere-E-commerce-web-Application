package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.dtos.responses.GetProductsResponse;

public interface ProductService {
    GetProductsResponse getProducts(int page, int size);

    GetProductsResponse getProducts(Long categoryId, int page, int size);

    com.abdullah.eCommerce.dtos.ProductDto getProduct(Long id);
}
