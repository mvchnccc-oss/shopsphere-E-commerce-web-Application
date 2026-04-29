package com.abdullah.eCommerce.repositories;

import com.abdullah.eCommerce.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findAllByCategoryId(Long categoryId, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findAll(Pageable pageable);

    void deleteByIdAndSellerId(Long productId, Long userId);

    Optional<Product> findByIdAndSellerId(Long productId, Long userId);
}
