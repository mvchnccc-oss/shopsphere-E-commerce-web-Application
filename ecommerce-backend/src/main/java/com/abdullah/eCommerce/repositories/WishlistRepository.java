package com.abdullah.eCommerce.repositories;

import com.abdullah.eCommerce.domain.Wishlist;
import com.abdullah.eCommerce.domain.WishlistId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WishlistRepository extends JpaRepository<Wishlist, WishlistId> {
    List<Wishlist> findByUserId(UUID userId);
}
