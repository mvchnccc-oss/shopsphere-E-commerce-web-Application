package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.OrderDto;
import com.abdullah.eCommerce.dtos.requests.PlaceOrderRequest;
import com.abdullah.eCommerce.entities.*;
import com.abdullah.eCommerce.mappers.*;
import com.abdullah.eCommerce.repositories.CartItemRepository;
import com.abdullah.eCommerce.repositories.OrderItemRepository;
import com.abdullah.eCommerce.repositories.OrderRepository;
import com.abdullah.eCommerce.repositories.UserRepository;
import com.abdullah.eCommerce.services.OrderService;
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
    private UserRepository userRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderService = new OrderServiceImpl(
            orderRepository,
            orderItemRepository,
            cartItemRepository,
            userRepository,
            orderMapper,
            orderItemMapper,
            addressMapper
        );
    }

    @Nested
    @DisplayName("Place Order")
    class PlaceOrder {
        @DisplayName("Cart with items")
        @Test
        void placeOrderFromCart() {
            final long userId = 1L;
            Product product = Product.builder().id(1L).price(new BigDecimal("99.99")).build();

            List<CartItem> cartItems = List.of(CartItem.builder()
                .product(product)
                .quantity(2)
                .build()
            );

            when(cartItemRepository.findByUserId(userId)).thenReturn(cartItems);
            when(userRepository.getReferenceById(userId))
                .thenReturn(User.builder().id(userId).build());

            orderService.placeOrderFromCart(userId, new PlaceOrderRequest(
                "123 Street", "City", "Country", "12345"
            ));

            verify(orderRepository).save(any(Order.class));
            verify(cartItemRepository).deleteByUserId(userId);
        }

        @Test
        @DisplayName("Empty Cart Returns Null")
        void placeOrderFromCartEmpty() {
            final long userId = 1L;

            when(cartItemRepository.findByUserId(userId)).thenReturn(Collections.emptyList());

            Long orderId = orderService.placeOrderFromCart(userId, new PlaceOrderRequest(
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
            final long userId = 1L;

            List<Order> orders = IntStream.rangeClosed(1, 5)
                .mapToObj(i -> Order.builder()
                    .id((long) i)
                    .orderedAt(Instant.now().minusSeconds(i * 86400L))
                    .orderItems(Collections.emptyList())
                    .build())
                .toList();

            when(orderRepository.findByUserIdOrderByOrderedAtDesc(userId)).thenReturn(orders);

            List<OrderDto> result = orderService.getOrders(userId);

            assertEquals(5, result.size());
            verify(orderRepository).findByUserIdOrderByOrderedAtDesc(1L);
        }

        @Test
        @DisplayName("Empty")
        void getOrdersEmpty() {
            final long userId = 1L;

            when(orderRepository.findByUserIdOrderByOrderedAtDesc(userId))
                .thenReturn(Collections.emptyList());

            List<OrderDto> result = orderService.getOrders(userId);

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

            when(orderItemRepository.findAllByProductSellerId(user.getId())).thenReturn(orderItems);

            List<OrderDto> result = orderService.getSellerOrders(user.getId());

            assertEquals(1, result.size());
            verify(orderItemRepository).findAllByProductSellerId(user.getId());
        }

        @Test
        @DisplayName("Empty")
        void getSellerOrdersEmpty() {
            final long userId = 1L;

            when(orderItemRepository.findAllByProductSellerId(userId)).thenReturn(Collections.emptyList());

            List<OrderDto> result = orderService.getSellerOrders(userId);
            assertTrue(result.isEmpty());
        }
    }
}