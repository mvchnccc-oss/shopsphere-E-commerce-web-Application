package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.domain.Cart;

public interface CartService {
    Cart getCart();
    void update(int productId, int quantity);
    void clear();
}
