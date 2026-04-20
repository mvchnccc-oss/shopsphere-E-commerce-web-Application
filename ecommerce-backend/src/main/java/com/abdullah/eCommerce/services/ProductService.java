package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.domain.Product;

import java.util.List;

public interface ProductService {
    List<Product> getProducts();

    Product getProduct(Integer id);

    List<Product> getProductsByCategory(Integer categoryId);
}
