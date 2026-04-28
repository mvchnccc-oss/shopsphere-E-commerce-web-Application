package com.abdullah.eCommerce.dtos.responses;

import com.abdullah.eCommerce.dtos.ProductDto;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class GetProductsResponse {
    public List<ProductDto> products;
    public int currentPage;
    public int totalPages;
    public long totalElements;
    public int pageSize;
}
