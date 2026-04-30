package com.abdullah.eCommerce.dtos.responses;

import com.abdullah.eCommerce.dtos.OrderDto;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class GetSellerOrdersResponse {
    public List<OrderDto> orders;
}
