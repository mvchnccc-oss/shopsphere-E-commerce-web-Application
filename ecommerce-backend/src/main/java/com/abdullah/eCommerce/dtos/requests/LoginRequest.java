package com.abdullah.eCommerce.dtos.requests;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class LoginRequest {
    @NotBlank
    public String email;

    @NotBlank
    public String password;
}

