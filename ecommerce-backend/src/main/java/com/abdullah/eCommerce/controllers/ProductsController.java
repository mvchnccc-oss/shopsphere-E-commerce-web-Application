package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.domain.dtos.ProductDto;
import com.abdullah.eCommerce.mappers.ProductMapper;
import com.abdullah.eCommerce.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductsController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getProducts(
            @RequestParam(required = false) Integer categoryId
    ){

        if (categoryId != null){
            return ResponseEntity.ok(
                    productService.getProductsByCategory(categoryId).stream().map(
                            productMapper::toProductDto
                    ).toList()
            );
        }
        return ResponseEntity.ok(
                productService.getProducts().stream().map(
                        productMapper::toProductDto
                ).toList()
        );
    }

    @GetMapping("{id}")
    public ResponseEntity<ProductDto> getProduct(
            @PathVariable Integer id
    ){
        return ResponseEntity.ok(
                productMapper.toProductDto(
                        productService.getProduct(id)
                )
        );
    }

}
