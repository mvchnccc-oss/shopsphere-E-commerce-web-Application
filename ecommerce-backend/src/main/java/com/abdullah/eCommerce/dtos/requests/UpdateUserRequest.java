package com.abdullah.eCommerce.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class UpdateUserRequest {
    private final String EMAIL_REQUIRED_ERROR_MESSAGE = "Email is required!";
    private final String NAME_REQUIRED_ERROR_MESSAGE = "Name is required!";

    @NotBlank(message = EMAIL_REQUIRED_ERROR_MESSAGE)
    @NotNull(message = EMAIL_REQUIRED_ERROR_MESSAGE)
    private String email;

    @NotBlank(message = NAME_REQUIRED_ERROR_MESSAGE)
    @NotNull(message = NAME_REQUIRED_ERROR_MESSAGE)
    private String name;

    private Boolean isSeller;
}
