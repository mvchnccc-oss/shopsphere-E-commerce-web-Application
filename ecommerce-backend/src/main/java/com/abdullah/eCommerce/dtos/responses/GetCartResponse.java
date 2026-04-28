package com.abdullah.eCommerce.dtos.responses;

import com.abdullah.eCommerce.dtos.CartItemDto;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class GetCartResponse {
    public List<CartItemDto> items;
}
