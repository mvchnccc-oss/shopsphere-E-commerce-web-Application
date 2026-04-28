package com.abdullah.eCommerce.dtos.requests;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UpdateCartRequest {
    public Long productId;
    public int quantity;
}
