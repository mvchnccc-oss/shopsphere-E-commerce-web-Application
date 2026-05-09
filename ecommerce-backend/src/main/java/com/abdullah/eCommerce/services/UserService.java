package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.entities.User;

public interface UserService {
    User getUser();

    User updateUser(User updatedUser);
}
