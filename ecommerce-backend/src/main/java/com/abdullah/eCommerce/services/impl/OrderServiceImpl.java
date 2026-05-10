package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.OrderDto;
import com.abdullah.eCommerce.dtos.requests.PlaceOrderRequest;
import com.abdullah.eCommerce.entities.Address;
import com.abdullah.eCommerce.entities.CartItem;
import com.abdullah.eCommerce.entities.Order;
import com.abdullah.eCommerce.entities.OrderItem;
import com.abdullah.eCommerce.mappers.AddressMapper;
import com.abdullah.eCommerce.mappers.OrderItemMapper;
import com.abdullah.eCommerce.mappers.OrderMapper;
import com.abdullah.eCommerce.repositories.CartItemRepository;
import com.abdullah.eCommerce.repositories.OrderItemRepository;
import com.abdullah.eCommerce.repositories.OrderRepository;
import com.abdullah.eCommerce.repositories.UserRepository;
import com.abdullah.eCommerce.services.OrderService;
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
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final AddressMapper addressMapper;

    @Override
    @Transactional
    public Long placeOrderFromCart(Long userId, PlaceOrderRequest placeOrderRequest) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) return null;

        Order order = Order.builder()
            .user(userRepository.getReferenceById(userId))
            .build();

        List<OrderItem> orderItems = orderItemMapper.fromCartItems(cartItems, order);
        order.setOrderItems(orderItems);

        Address address = addressMapper.toAddress(placeOrderRequest);
        address.setOrder(order);

        order.setAddress(address);
        order.setOrderItems(orderItems);
        orderRepository.save(order);

        cartItemRepository.deleteByUserId(userId);

        return order.getId();
    }

    @Override
    @Transactional
    public List<OrderDto> getOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByOrderedAtDesc(userId);

        return orderMapper.toOrdersDto(orders);
    }

    @Override
    public List<OrderDto> getSellerOrders(Long userId) {
        List<Order> orders = orderItemRepository
            .findAllByProductSellerId(userId)
            .stream()
            .collect(Collectors.groupingBy(OrderItem::getOrder))
            .entrySet()
            .stream()
            .map(entry -> {
                Order order = entry.getKey();
                List<OrderItem> orderItems = entry.getValue().stream()
                    .toList();

                order.setOrderItems(orderItems);
                return order;
            })
            .sorted(Comparator.comparing(Order::getOrderedAt).reversed())
            .toList();

        return orderMapper.toOrdersDto(orders);
    }
}
