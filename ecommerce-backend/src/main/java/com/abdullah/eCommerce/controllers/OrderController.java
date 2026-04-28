package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.dtos.OrderDto;
import com.abdullah.eCommerce.dtos.requests.PlaceOrderRequest;
import com.abdullah.eCommerce.dtos.responses.GetOrdersResponse;
import com.abdullah.eCommerce.dtos.responses.PlaceOrderResponse;
import com.abdullah.eCommerce.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    public GetOrdersResponse getOrders() {
        List<OrderDto> orders = orderService.getOrders();

        return new GetOrdersResponse(orders);
    }

    @PostMapping
    public PlaceOrderResponse placeOrder(@Valid @RequestBody PlaceOrderRequest body) {
        Long id = orderService.placeOrderFromCart(body);

        return new PlaceOrderResponse(id);
    }
}
