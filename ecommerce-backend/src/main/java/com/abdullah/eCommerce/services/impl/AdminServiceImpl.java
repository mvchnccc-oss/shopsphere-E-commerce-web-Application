package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.OrderDto;
import com.abdullah.eCommerce.dtos.OrderMonthlyRevenue;
import com.abdullah.eCommerce.dtos.UserRoleCount;
import com.abdullah.eCommerce.dtos.responses.GetAdminDashboardStatsResponse;
import com.abdullah.eCommerce.dtos.responses.GetAllOrdersResponse;
import com.abdullah.eCommerce.entities.Order;
import com.abdullah.eCommerce.entities.UserRole;
import com.abdullah.eCommerce.mappers.OrderMapper;
import com.abdullah.eCommerce.repositories.OrderItemRepository;
import com.abdullah.eCommerce.repositories.OrderRepository;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.repositories.UserRepository;
import com.abdullah.eCommerce.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;

    private final OrderMapper orderMapper;

    @Override
    public GetAdminDashboardStatsResponse getAdminDashboardStats() {
        var roleCount = userRepository
            .countGroupedByRole()
            .stream()
            .collect(Collectors.toMap(UserRoleCount::getRole, UserRoleCount::getCount));

        long numberOfSellers = roleCount.getOrDefault(UserRole.Seller, 0L);
        long numberOfCustomers = roleCount.getOrDefault(UserRole.Customer, 0L);
        long numberOfAdmins = roleCount.getOrDefault(UserRole.Admin, 0L);
        long totalNumberOfUsers = numberOfCustomers + numberOfSellers + numberOfAdmins;

        long numberOfProducts = productRepository.count();
        long numberOfOrders = orderRepository.count();
        BigDecimal totalRevenue = orderItemRepository.getTotalRevenue();

        Map<String, BigDecimal> revenueByMonth = orderRepository.getMonthlyRevenue()
            .stream().collect(Collectors.toMap(OrderMonthlyRevenue::getMonth, OrderMonthlyRevenue::getTotal));

        return GetAdminDashboardStatsResponse.builder()
            .numberOfUsers(totalNumberOfUsers)
            .numberOfSellers(numberOfSellers)
            .numberOfCustomers(numberOfCustomers)
            .numberOfProducts(numberOfProducts)
            .numberOfOrders(numberOfOrders)
            .totalRevenue(totalRevenue)
            .revenueByMonth(revenueByMonth)
            .build();
    }

    @Override
    public GetAllOrdersResponse getOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> ordersPage = orderRepository.findAllOrdered(pageable);

        List<OrderDto> orders = orderMapper.toOrdersDto(ordersPage.getContent());

        return new GetAllOrdersResponse(
            orders,
            ordersPage.getNumber(),
            ordersPage.getTotalPages(),
            ordersPage.getTotalElements(),
            ordersPage.getSize()
        );
    }
}
