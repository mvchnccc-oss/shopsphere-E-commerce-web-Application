package com.abdullah.eCommerce.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartDto {
    private List<CartItemDto> items;
    private Long totalPrice;
    private Integer totalProducts;
}
