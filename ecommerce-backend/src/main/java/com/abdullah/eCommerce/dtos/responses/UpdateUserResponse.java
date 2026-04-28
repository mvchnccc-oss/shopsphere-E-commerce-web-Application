package com.abdullah.eCommerce.dtos.responses;

import com.abdullah.eCommerce.dtos.UserDto;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UpdateUserResponse {
    public UserDto user;
    public AuthResponse auth;
}
