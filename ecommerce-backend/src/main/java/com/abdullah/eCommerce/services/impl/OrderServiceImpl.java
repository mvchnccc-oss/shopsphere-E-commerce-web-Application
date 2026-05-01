package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.OrderDto;
import com.abdullah.eCommerce.dtos.requests.PlaceOrderRequest;
import com.abdullah.eCommerce.entities.*;
import com.abdullah.eCommerce.mappers.AddressMapper;
import com.abdullah.eCommerce.mappers.OrderItemMapper;
import com.abdullah.eCommerce.mappers.OrderMapper;
import com.abdullah.eCommerce.repositories.CartItemRepository;
import com.abdullah.eCommerce.repositories.OrderItemRepository;
import com.abdullah.eCommerce.repositories.OrderRepository;
import com.abdullah.eCommerce.services.OrderService;
import com.abdullah.eCommerce.services.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserService userService;
    private final CartItemRepository cartItemRepository;

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final AddressMapper addressMapper;

    @Override
    @Transactional
    public Long placeOrderFromCart(PlaceOrderRequest placeOrderRequest) {
        User user = userService.getUser();

        List<CartItem> cartItems = user.getCartItems();
        if (cartItems.isEmpty()) return null;

        Order order = Order.builder().user(user).build();

        List<OrderItem> orderItems = orderItemMapper.fromCartItems(cartItems, order);
        order.setOrderItems(orderItems);

        Address address = addressMapper.toAddress(placeOrderRequest);
        address.setOrder(order);

        order.setAddress(address);
        order.setOrderItems(orderItems);
        orderRepository.save(order);

        cartItemRepository.deleteByUserId(user.getId());

        return order.getId();
    }

    @Override
    @Transactional
    public List<OrderDto> getOrders() {
        User user = userService.getUser();
        List<Order> orders = orderRepository.findByUserIdOrderByOrderedAtDesc(user.getId());

        return orderMapper.toOrdersDto(orders);
    }

    @Override
    public List<OrderDto> getSellerOrders() {
        User user = userService.getUser();
        System.out.println("User ID: " + user.getId());

        List<Order> orders = orderItemRepository
                .findAllByProductSellerId(user.getId())
                .stream()
                .collect(Collectors.groupingBy(OrderItem::getOrder))
                .entrySet()
                .stream()
                .map(entry -> {
                    Order order = entry.getKey();


                    List<OrderItem> orderItems = entry.getValue().stream()
                            .toList();
                    System.out.println("Size " + orderItems.size());

                    order.setOrderItems(orderItems);
                    return order;
                })
                .sorted(Comparator.comparing(Order::getOrderedAt).reversed())
                .toList();

        return orderMapper.toOrdersDto(orders);
    }
}
