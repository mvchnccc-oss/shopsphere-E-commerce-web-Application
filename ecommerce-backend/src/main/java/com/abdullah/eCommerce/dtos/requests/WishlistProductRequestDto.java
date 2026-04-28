package com.abdullah.eCommerce.dtos.requests;

import jakarta.validation.constraints.NotNull;

public class WishlistProductRequestDto {
    @NotNull
    public Long productId;
}
