package com.abdullah.eCommerce.repositories;

import com.abdullah.eCommerce.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserId(UUID userId);
}
