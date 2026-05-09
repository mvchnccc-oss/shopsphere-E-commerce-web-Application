package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.OrderMonthlyRevenue;
import com.abdullah.eCommerce.dtos.UserRoleCount;
import com.abdullah.eCommerce.dtos.responses.GetAdminDashboardStatsResponse;
import com.abdullah.eCommerce.dtos.responses.GetAllOrdersResponse;
import com.abdullah.eCommerce.entities.Order;
import com.abdullah.eCommerce.entities.UserRole;
import com.abdullah.eCommerce.mappers.AddressMapperImpl;
import com.abdullah.eCommerce.mappers.OrderItemMapperImpl;
import com.abdullah.eCommerce.mappers.OrderMapper;
import com.abdullah.eCommerce.mappers.OrderMapperImpl;
import com.abdullah.eCommerce.repositories.OrderItemRepository;
import com.abdullah.eCommerce.repositories.OrderRepository;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.repositories.UserRepository;
import com.abdullah.eCommerce.services.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@Import({OrderMapperImpl.class, OrderItemMapperImpl.class, AddressMapperImpl.class})
class AdminServiceImplTest {

    @Autowired
    private OrderMapper orderMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private OrderRepository orderRepository;

    private AdminService adminService;

    @BeforeEach
    void setUp() {
        adminService = new AdminServiceImpl(
            userRepository,
            productRepository,
            orderItemRepository,
            orderRepository,
            orderMapper
        );
    }

    @Nested
    @DisplayName("Get Admin Dashboard Stats")
    class GetAdminDashboardStats {

        @Test
        @DisplayName("All Stats")
        void getAdminDashboardStats() {
            List<UserRoleCount> roleCounts = List.of(
                mockRoleCount(UserRole.Seller, 5L),
                mockRoleCount(UserRole.Customer, 20L),
                mockRoleCount(UserRole.Admin, 2L)
            );

            List<OrderMonthlyRevenue> monthlyRevenue = List.of(
                mockMonthlyRevenue("2024-01", new BigDecimal("1000.00")),
                mockMonthlyRevenue("2024-02", new BigDecimal("2000.00"))
            );

            when(userRepository.countGroupedByRole()).thenReturn(roleCounts);
            when(productRepository.count()).thenReturn(100L);
            when(orderRepository.count()).thenReturn(50L);
            when(orderItemRepository.getTotalRevenue()).thenReturn(new BigDecimal("3000.00"));
            when(orderRepository.getMonthlyRevenue()).thenReturn(monthlyRevenue);

            GetAdminDashboardStatsResponse response = adminService.getAdminDashboardStats();

            assertEquals(27L, response.getNumberOfUsers());
            assertEquals(5L, response.getNumberOfSellers());
            assertEquals(20L, response.getNumberOfCustomers());
            assertEquals(100L, response.getNumberOfProducts());
            assertEquals(50L, response.getNumberOfOrders());
            assertEquals(new BigDecimal("3000.00"), response.getTotalRevenue());
            assertEquals(new BigDecimal("1000.00"), response.getRevenueByMonth().get("2024-01"));
            assertEquals(new BigDecimal("2000.00"), response.getRevenueByMonth().get("2024-02"));

            verify(userRepository).countGroupedByRole();
            verify(productRepository).count();
            verify(orderRepository).count();
            verify(orderItemRepository).getTotalRevenue();
            verify(orderRepository).getMonthlyRevenue();
        }

        @Test
        @DisplayName("Missing Roles Default To Zero")
        void getAdminDashboardStatsMissingRoles() {
            when(userRepository.countGroupedByRole()).thenReturn(Collections.emptyList());
            when(productRepository.count()).thenReturn(0L);
            when(orderRepository.count()).thenReturn(0L);
            when(orderItemRepository.getTotalRevenue()).thenReturn(BigDecimal.ZERO);
            when(orderRepository.getMonthlyRevenue()).thenReturn(Collections.emptyList());

            GetAdminDashboardStatsResponse response = adminService.getAdminDashboardStats();

            assertEquals(0L, response.getNumberOfUsers());
            assertEquals(0L, response.getNumberOfSellers());
            assertEquals(0L, response.getNumberOfCustomers());
        }

        private UserRoleCount mockRoleCount(UserRole role, long count) {
            UserRoleCount mock = Mockito.mock(UserRoleCount.class);
            when(mock.getRole()).thenReturn(role);
            when(mock.getCount()).thenReturn(count);
            return mock;
        }

        private OrderMonthlyRevenue mockMonthlyRevenue(String month, BigDecimal total) {
            OrderMonthlyRevenue mock = Mockito.mock(OrderMonthlyRevenue.class);
            when(mock.getMonth()).thenReturn(month);
            when(mock.getTotal()).thenReturn(total);
            return mock;
        }
    }

    @Nested
    @DisplayName("Get Orders")
    class GetOrders {
        @Test
        @DisplayName("All")
        void getOrders() {
            Pageable pageable = PageRequest.of(0, 10);

            List<Order> orders = IntStream.rangeClosed(1, 10)
                .mapToObj(i -> Order.builder()
                    .id((long) i)
                    .build())
                .toList();

            Page<Order> ordersPage = new PageImpl<>(orders, pageable, 10L);

            when(orderRepository.findAllOrdered(pageable)).thenReturn(ordersPage);

            GetAllOrdersResponse response = adminService.getOrders(pageable.getPageNumber(), pageable.getPageSize());

            assertEquals(10, response.orders.size());
            assertEquals(0, response.currentPage);
            assertEquals(1, response.totalPages);
            assertEquals(10L, response.totalElements);
            assertEquals(10, response.pageSize);

            verify(orderRepository).findAllOrdered(pageable);
        }
    }
}