package com.abdullah.eCommerce.repositories;

import com.abdullah.eCommerce.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query(value = """
        SELECT oi.* FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE (p.seller_id = :sellerId OR p.id IS NULL)
        ORDER BY o.ordered_at DESC
        """, nativeQuery = true)
    List<OrderItem> findAllByProductSellerId(@Param("sellerId") Long sellerId);

    @Query("SELECT COALESCE(SUM(i.pricePerUnit * i.quantity), 0) FROM OrderItem i")
    BigDecimal getTotalRevenue();
}
