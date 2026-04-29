package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.dtos.CartItemDto;

import java.util.List;

public interface CartService {
    List<CartItemDto> getCartItems();

    void updateQuantity(Long productId, int quantity);

    void clear();
}
