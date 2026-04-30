package com.abdullah.eCommerce.repositories;

import com.abdullah.eCommerce.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query(value = "SELECT oi.* FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE p.seller_id = :sellerId", nativeQuery = true)
    List<OrderItem> findAllByProductSellerId(@Param("sellerId") Long sellerId);
}
