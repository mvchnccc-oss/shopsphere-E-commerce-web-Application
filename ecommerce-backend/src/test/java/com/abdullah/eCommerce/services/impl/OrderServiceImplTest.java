package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.OrderDto;
import com.abdullah.eCommerce.dtos.requests.PlaceOrderRequest;
import com.abdullah.eCommerce.entities.*;
import com.abdullah.eCommerce.mappers.*;
import com.abdullah.eCommerce.repositories.CartItemRepository;
import com.abdullah.eCommerce.repositories.OrderItemRepository;
import com.abdullah.eCommerce.repositories.OrderRepository;
import com.abdullah.eCommerce.services.OrderService;
import com.abdullah.eCommerce.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@Import({OrderMapperImpl.class, OrderItemMapperImpl.class, AddressMapperImpl.class})
class OrderServiceImplTest {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private OrderItemMapper orderItemMapper;

    @Autowired
    private AddressMapper addressMapper;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private UserService userService;

    @Mock
    private CartItemRepository cartItemRepository;

    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderService = new OrderServiceImpl(
            orderRepository,
            orderItemRepository,
            userService,
            cartItemRepository,
            orderMapper,
            orderItemMapper,
            addressMapper
        );
    }

    @Nested
    @DisplayName("Place Order")
    class PlaceOrder {

        @Test
        @DisplayName("From Cart")
        void placeOrderFromCart() {
            Product product = Product.builder().id(1L).price(new BigDecimal("99.99")).build();

            CartItem cartItem = CartItem.builder()
                .product(product)
                .quantity(2)
                .build();

            User user = User.builder()
                .id(1L)
                .cartItems(new ArrayList<>(List.of(cartItem)))
                .build();

            PlaceOrderRequest request = new PlaceOrderRequest(
                "123 Street", "City", "Country", "12345"
            );

            when(userService.getUser()).thenReturn(user);

            orderService.placeOrderFromCart(request);

            verify(orderRepository).save(any(Order.class));
            verify(cartItemRepository).deleteByUserId(1L);
        }

        @Test
        @DisplayName("Empty Cart Returns Null")
        void placeOrderFromCartEmpty() {
            User user = User.builder()
                .id(1L)
                .cartItems(Collections.emptyList())
                .build();

            when(userService.getUser()).thenReturn(user);

            Long orderId = orderService.placeOrderFromCart(new PlaceOrderRequest(
                "123 Street", "City", "Country", "12345"
            ));

            assertNull(orderId);
            verify(orderRepository, never()).save(any());
            verify(cartItemRepository, never()).deleteByUserId(any());
        }
    }

    @Nested
    @DisplayName("Get Orders")
    class GetOrders {

        @Test
        @DisplayName("All")
        void getOrders() {
            User user = User.builder().id(1L).build();

            List<Order> orders = IntStream.rangeClosed(1, 5)
                .mapToObj(i -> Order.builder()
                    .id((long) i)
                    .user(user)
                    .orderedAt(Instant.now().minusSeconds(i * 86400L))
                    .orderItems(Collections.emptyList())
                    .build())
                .toList();

            when(userService.getUser()).thenReturn(user);
            when(orderRepository.findByUserIdOrderByOrderedAtDesc(1L)).thenReturn(orders);

            List<OrderDto> result = orderService.getOrders();

            assertEquals(5, result.size());
            verify(orderRepository).findByUserIdOrderByOrderedAtDesc(1L);
        }

        @Test
        @DisplayName("Empty")
        void getOrdersEmpty() {
            User user = User.builder().id(1L).build();

            when(userService.getUser()).thenReturn(user);
            when(orderRepository.findByUserIdOrderByOrderedAtDesc(1L)).thenReturn(Collections.emptyList());

            List<OrderDto> result = orderService.getOrders();

            assertTrue(result.isEmpty());
        }
    }

    @Nested
    @DisplayName("Get Seller Orders")
    class GetSellerOrders {

        @Test
        @DisplayName("All")
        void getSellerOrders() {
            User user = User.builder().id(1L).build();

            Order order = Order.builder()
                .id(1L)
                .user(user)
                .orderedAt(Instant.now())
                .orderItems(new ArrayList<>())
                .build();

            List<OrderItem> orderItems = IntStream.rangeClosed(1, 3)
                .mapToObj(i -> OrderItem.builder()
                    .id(new OrderItem.Id((long) i, (long) i))
                    .order(order)
                    .product(Product.builder()
                        .id((long) i)
                        .seller(user)
                        .build())
                    .quantity(1)
                    .pricePerUnit(new BigDecimal("99.99"))
                    .build())
                .toList();

            when(userService.getUser()).thenReturn(user);
            when(orderItemRepository.findAllByProductSellerId(1L)).thenReturn(orderItems);

            List<OrderDto> result = orderService.getSellerOrders();

            assertEquals(1, result.size());
            verify(orderItemRepository).findAllByProductSellerId(1L);
        }

        @Test
        @DisplayName("Empty")
        void getSellerOrdersEmpty() {
            User user = User.builder().id(1L).build();

            when(userService.getUser()).thenReturn(user);
            when(orderItemRepository.findAllByProductSellerId(1L)).thenReturn(Collections.emptyList());

            List<OrderDto> result = orderService.getSellerOrders();

            assertTrue(result.isEmpty());
        }
    }
}