package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.domain.User;

public interface UserService {
    User getUser();

    User updateUser(User updatedUser);
}
