package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.dtos.ProductDto;
import com.abdullah.eCommerce.dtos.requests.CreateProductRequest;
import com.abdullah.eCommerce.dtos.responses.GetProductResponse;
import com.abdullah.eCommerce.dtos.responses.GetProductsResponse;
import com.abdullah.eCommerce.entities.User;
import com.abdullah.eCommerce.services.ProductService;
import jakarta.validation.Valid;
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
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        if (search != null)
            return productService.getProducts(search, page, size);

        return categoryId == null
            ? productService.getProducts(page, size)
            : productService.getProducts(categoryId, page, size);
    }

    @GetMapping("{id}")
    public GetProductResponse getProduct(@PathVariable Long id) {
        ProductDto product = productService.getProduct(id);

        return new GetProductResponse(product);
    }

    @PostMapping
    public void createProduct(
        @RequestAttribute Long userId,
        @RequestBody @Valid CreateProductRequest request) {
        productService.createProduct(userId, request);
    }

    @PostMapping("{id}")
    public void updateProduct(
        @RequestAttribute Long userId,
        @PathVariable Long id, @RequestBody @Valid CreateProductRequest body
    ) {
        productService.updateProduct(userId, id, body);
    }

    @DeleteMapping("{id}")
    public void deleteProduct(@RequestAttribute User user, @PathVariable Long id) {
        productService.deleteProduct(user, id);
    }
}
