package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.dtos.SellerProductDto;
import com.abdullah.eCommerce.dtos.responses.GetSellerOrdersResponse;
import com.abdullah.eCommerce.dtos.responses.GetSellerProductsResponse;
import com.abdullah.eCommerce.services.OrderService;
import com.abdullah.eCommerce.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/seller")
@RequiredArgsConstructor
public class SellerController {
    private final ProductService productService;
    private final OrderService orderService;

    @GetMapping("/products")
    public GetSellerProductsResponse getSellerProducts() {
        List<SellerProductDto> products = productService.getUserProducts();

        return new GetSellerProductsResponse(products);
    }

    @GetMapping("/orders")
    public GetSellerOrdersResponse getSellerOrders() {
        return new GetSellerOrdersResponse(orderService.getSellerOrders());
    }
}
