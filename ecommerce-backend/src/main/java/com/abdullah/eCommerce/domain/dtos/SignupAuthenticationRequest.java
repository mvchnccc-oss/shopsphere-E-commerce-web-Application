package com.abdullah.eCommerce.domain.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupAuthenticationRequest {
    private final String EMAIL_REQUIRED_ERROR_MESSAGE = "Email is required!";
    private final String NAME_REQUIRED_ERROR_MESSAGE = "Name is required!";
    private final String PASSWORD_REQUIRED_ERROR_MESSAGE = "Password is required!";



    @NotBlank(message =  EMAIL_REQUIRED_ERROR_MESSAGE )
    @NotNull(message =  EMAIL_REQUIRED_ERROR_MESSAGE )
    private String email;
    @NotBlank(message =  PASSWORD_REQUIRED_ERROR_MESSAGE )
    @NotNull(message =  PASSWORD_REQUIRED_ERROR_MESSAGE )
    private String password;
    @NotBlank(message =  NAME_REQUIRED_ERROR_MESSAGE )
    @NotNull(message =  NAME_REQUIRED_ERROR_MESSAGE )
    private String name;


}
