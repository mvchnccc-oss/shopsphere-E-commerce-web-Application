package com.abdullah.eCommerce.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
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
}
