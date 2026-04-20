package com.abdullah.eCommerce.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserResponseDto {
    private UserDto user;
    private AuthenticationResponse auth;
}
