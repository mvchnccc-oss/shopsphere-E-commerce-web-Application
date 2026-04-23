package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.domain.User;
import com.abdullah.eCommerce.domain.dtos.OrderDto;

import java.util.List;

public interface OrderService {
    int placeOrderFromCart();
    List<OrderDto> getOrders();
}
