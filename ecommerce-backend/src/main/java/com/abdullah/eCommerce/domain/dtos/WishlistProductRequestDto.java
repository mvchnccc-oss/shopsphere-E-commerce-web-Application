package com.abdullah.eCommerce.domain.dtos;

import jakarta.validation.constraints.NotNull;

public class WishlistProductRequestDto {
    @NotNull
    public Integer productId;
}
