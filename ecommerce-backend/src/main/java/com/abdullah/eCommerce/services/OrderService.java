package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.dtos.OrderDto;
import com.abdullah.eCommerce.dtos.requests.PlaceOrderRequest;

import java.util.List;

public interface OrderService {
    Long placeOrderFromCart(Long userId, PlaceOrderRequest address);

    List<OrderDto> getOrders(Long userId);

    List<OrderDto> getSellerOrders(Long userId);
}
