package com.abdullah.eCommerce.repositories;

import com.abdullah.eCommerce.entities.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, WishlistItem.Id> {
    List<WishlistItem> findByUserId(Long userId);
}
