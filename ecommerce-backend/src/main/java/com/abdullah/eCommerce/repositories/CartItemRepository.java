package com.abdullah.eCommerce.repositories;

import com.abdullah.eCommerce.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, CartItem.Id> {
    void deleteByUserId(Long userId);

    void findByUserId(Long userId);
}
