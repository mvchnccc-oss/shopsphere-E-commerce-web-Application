package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.entities.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserService {
    User getUser();

    User updateUser(User updatedUser);

    boolean isSeller(UserDetails userDetails);
}
