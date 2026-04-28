package com.abdullah.eCommerce.dtos.responses;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class GetWishlistResponse {
    public List<Long> products;
}
