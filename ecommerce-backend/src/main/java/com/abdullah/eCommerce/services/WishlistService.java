package com.abdullah.eCommerce.services;

import java.util.List;

public interface WishlistService {
    void wishlist(Long userId, Long productId);

    void unWishlist(Long userId, Long productId);

    List<Long> getWishlist(Long userId);
}
