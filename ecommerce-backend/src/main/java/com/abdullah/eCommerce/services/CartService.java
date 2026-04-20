package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.domain.Cart;

public interface CartService {

    Cart getCart();

    Cart addProductToCart(Integer productId);

    void deleteProductFromCard(Integer productId);
}
