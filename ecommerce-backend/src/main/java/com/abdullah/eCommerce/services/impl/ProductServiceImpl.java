package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.ProductDto;
import com.abdullah.eCommerce.dtos.responses.GetProductsResponse;
import com.abdullah.eCommerce.entities.Product;
import com.abdullah.eCommerce.exceptions.ProductNotFoundException;
import com.abdullah.eCommerce.mappers.ProductMapper;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
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
    public ProductDto getProduct(Long id) {
        Product product = productRepository
                .findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        return productMapper.toDto(product);
    }
}
