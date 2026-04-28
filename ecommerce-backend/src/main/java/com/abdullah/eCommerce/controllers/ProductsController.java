package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.dtos.ProductDto;
import com.abdullah.eCommerce.dtos.responses.GetProductResponse;
import com.abdullah.eCommerce.dtos.responses.GetProductsResponse;
import com.abdullah.eCommerce.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductsController {
    private final ProductService productService;

    @GetMapping
    public GetProductsResponse getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return categoryId == null
                ? productService.getProducts(page, size)
                : productService.getProducts(categoryId, page, size);
    }

    @GetMapping("{id}")
    public GetProductResponse getProduct(@PathVariable Long id) {
        ProductDto product = productService.getProduct(id);

        return new GetProductResponse(product);
    }
}
