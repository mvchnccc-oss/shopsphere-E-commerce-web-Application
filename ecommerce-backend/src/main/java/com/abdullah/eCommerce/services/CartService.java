package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.dtos.CartItemDto;

import java.util.List;

public interface CartService {
    List<CartItemDto> getCartItems(Long userId);

    void updateQuantity(Long userId, Long productId, int quantity);

    void clear(Long userId);
}
