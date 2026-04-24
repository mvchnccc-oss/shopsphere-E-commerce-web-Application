package com.abdullah.eCommerce.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderAddressDto {
    private String firstname;
    private String lastname;
    private String city;
    private String street;
}
