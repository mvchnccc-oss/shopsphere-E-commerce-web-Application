package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.dtos.responses.GetAdminDashboardStatsResponse;
import com.abdullah.eCommerce.dtos.responses.GetAllOrdersResponse;
import com.abdullah.eCommerce.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/")
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/stats")
    public GetAdminDashboardStatsResponse getAdminDashboardStats() {
        return adminService.getAdminDashboardStats();
    }

    @GetMapping("/orders")
    public GetAllOrdersResponse getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminService.getOrders(page, size);
    }
}
