package com.abdullah.eCommerce.dtos.responses;

import com.abdullah.eCommerce.dtos.OrderDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Builder
@Data
public class GetAdminDashboardStatsResponse {
    private BigDecimal totalRevenue;
    private Map<String, BigDecimal> revenueByMonth;
    private Long numberOfProducts;
    private Long numberOfOrders;
    private Long numberOfUsers;
    private Long numberOfCustomers;
    private Long numberOfSellers;

    private List<OrderDto> orders;
}
