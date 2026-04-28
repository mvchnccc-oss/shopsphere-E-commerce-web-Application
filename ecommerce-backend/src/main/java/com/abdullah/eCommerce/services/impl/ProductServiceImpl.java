package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.ProductDto;
import com.abdullah.eCommerce.entities.Product;
import com.abdullah.eCommerce.exceptions.ProductNotFoundException;
import com.abdullah.eCommerce.mappers.ProductMapper;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public List<ProductDto> getProducts() {
        List<Product> products = productRepository.findAll();

        return productMapper.toDtoList(products);
    }

    @Override
    public List<ProductDto> getProducts(Long categoryId) {
        List<Product> products = productRepository.findAllByCategoryId(categoryId);

        return productMapper.toDtoList(products);
    }

    @Override
    public ProductDto getProduct(Long id) {
        Product product = productRepository
                .findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        return productMapper.toDto(product);
    }
}
