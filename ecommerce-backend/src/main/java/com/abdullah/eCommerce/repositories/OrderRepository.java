package com.abdullah.eCommerce.repositories;

import com.abdullah.eCommerce.dtos.OrderMonthlyRevenue;
import com.abdullah.eCommerce.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderedAtDesc(Long userId);

    @Query("""
                SELECT TO_CHAR(o.orderedAt, 'YYYY-MM') AS month,
                       COALESCE(SUM(i.pricePerUnit * i.quantity), 0) AS total
                FROM Order o
                JOIN o.orderItems i
                GROUP BY TO_CHAR(o.orderedAt, 'YYYY-MM')
                ORDER BY month ASC
            """)
    List<OrderMonthlyRevenue> getMonthlyRevenue();
}
