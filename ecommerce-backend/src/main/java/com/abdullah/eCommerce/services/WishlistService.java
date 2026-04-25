package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.domain.Wishlist;

import java.util.List;

public interface WishlistService {
    void wishlist(int productId);

    void unWishlist(int productId);

    List<Wishlist> getWishlist();
}
