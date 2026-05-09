package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.dtos.responses.GetAdminDashboardStatsResponse;
import com.abdullah.eCommerce.dtos.responses.GetAllOrdersResponse;

public interface AdminService {
    GetAdminDashboardStatsResponse getAdminDashboardStats();

    GetAllOrdersResponse getOrders(int page, int size);
}
