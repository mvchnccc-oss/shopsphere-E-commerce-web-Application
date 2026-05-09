package com.abdullah.eCommerce.dtos.responses;

import com.abdullah.eCommerce.dtos.OrderDto;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class GetAllOrdersResponse {
    public List<OrderDto> orders;
    public int currentPage;
    public int totalPages;
    public long totalElements;
    public int pageSize;
}
