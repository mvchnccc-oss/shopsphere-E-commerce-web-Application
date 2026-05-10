package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.dtos.AdminDashboardUserDto;
import com.abdullah.eCommerce.dtos.requests.LockUserRequest;
import com.abdullah.eCommerce.dtos.responses.GetAdminDashboardStatsResponse;
import com.abdullah.eCommerce.dtos.responses.GetAllOrdersResponse;
import com.abdullah.eCommerce.dtos.responses.GetUsersResponse;
import com.abdullah.eCommerce.services.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/users")
    public GetUsersResponse getUsers(@RequestAttribute Long userId) {
        List<AdminDashboardUserDto> users = adminService.getUsers(userId);

        return new GetUsersResponse(users);
    }

    @PostMapping("/users/lock")
    public void lockUser(@RequestBody @Valid LockUserRequest body) {
        adminService.lockUser(body.getUserId(), body.getLock());
    }
}
