package com.abdullah.eCommerce.dtos.responses;


import com.abdullah.eCommerce.entities.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    public String token;
    public Long expiresAt;
    public UserRole role;
}
