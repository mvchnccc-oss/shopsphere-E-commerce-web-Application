package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.dtos.ProductDto;

import java.util.List;

public interface ProductService {
    List<ProductDto> getProducts();

    List<ProductDto> getProducts(Long categoryId);

    ProductDto getProduct(Long id);
}
