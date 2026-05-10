package com.abdullah.eCommerce.repositories;

import com.abdullah.eCommerce.dtos.UserRoleCount;
import com.abdullah.eCommerce.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u.role AS role, COUNT(u) AS count FROM User u GROUP BY u.role")
    List<UserRoleCount> countGroupedByRole();

    List<User> findByIdNotOrderByName(Long id);
}
