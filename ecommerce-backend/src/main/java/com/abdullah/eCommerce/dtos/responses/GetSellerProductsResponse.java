package com.abdullah.eCommerce.dtos.responses;

import com.abdullah.eCommerce.dtos.SellerProductDto;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class GetSellerProductsResponse {
    public List<SellerProductDto> products;
}
