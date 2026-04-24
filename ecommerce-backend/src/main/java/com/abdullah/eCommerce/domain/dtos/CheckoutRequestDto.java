package com.abdullah.eCommerce.domain.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CheckoutRequestDto {
    @NotBlank
    private String firstname, lastname;

    @NotBlank
    private String street;

    @NotBlank
    private String city;
}
