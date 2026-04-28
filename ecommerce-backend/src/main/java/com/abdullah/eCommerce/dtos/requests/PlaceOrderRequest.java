package com.abdullah.eCommerce.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlaceOrderRequest {
    @NotBlank
    public String firstname;

    @NotBlank
    public String lastname;

    @NotBlank
    public String street;

    @NotBlank
    public String city;
}
