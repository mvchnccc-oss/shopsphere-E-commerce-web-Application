package com.abdullah.eCommerce.services;

import java.util.List;

public interface WishlistService {
    void wishlist(Long productId);

    void unWishlist(Long productId);

    List<Long> getWishlist();
}
