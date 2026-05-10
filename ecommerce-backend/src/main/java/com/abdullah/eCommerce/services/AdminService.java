package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.dtos.AdminDashboardUserDto;
import com.abdullah.eCommerce.dtos.responses.GetAdminDashboardStatsResponse;
import com.abdullah.eCommerce.dtos.responses.GetAllOrdersResponse;

import java.util.List;

public interface AdminService {
    GetAdminDashboardStatsResponse getAdminDashboardStats();

    GetAllOrdersResponse getOrders(int page, int size);

    List<AdminDashboardUserDto> getUsers(Long currentUserId);

    void lockUser(Long id, boolean lock);
}
