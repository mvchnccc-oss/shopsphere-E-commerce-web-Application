package com.abdullah.eCommerce.repositories;

import com.abdullah.eCommerce.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, CartItem.Id> {
    void deleteByUserId(Long userId);

    List<CartItem> findByUserId(Long userId);
}
