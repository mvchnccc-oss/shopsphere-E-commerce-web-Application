package com.abdullah.eCommerce.repositories;

import com.abdullah.eCommerce.domain.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByProductIdAndCartId(Integer productId, Integer CartId);
    void deleteByProductIdAndCartId(int productId, int cartId);
}
