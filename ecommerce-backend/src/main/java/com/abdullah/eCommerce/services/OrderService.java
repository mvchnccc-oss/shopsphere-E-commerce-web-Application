package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.domain.dtos.CheckoutRequestDto;
import com.abdullah.eCommerce.domain.dtos.OrderDto;

import java.util.List;

public interface OrderService {
    int placeOrderFromCart(CheckoutRequestDto address);

    List<OrderDto> getOrders();
}
