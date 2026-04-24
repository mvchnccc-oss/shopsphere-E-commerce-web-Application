package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.domain.dtos.OrderDto;
import com.abdullah.eCommerce.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    public Map<String, List<OrderDto>> getOrders() {
        return Map.of("orders", orderService.getOrders());
    }

    @PostMapping
    public int placeOrder() {
        return orderService.placeOrderFromCart();
    }
}
