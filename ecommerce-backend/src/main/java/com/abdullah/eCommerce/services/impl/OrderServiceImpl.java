package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.domain.Cart;
import com.abdullah.eCommerce.domain.Order;
import com.abdullah.eCommerce.domain.OrderItem;
import com.abdullah.eCommerce.domain.User;
import com.abdullah.eCommerce.domain.dtos.OrderDto;
import com.abdullah.eCommerce.mappers.OrderMapper;
import com.abdullah.eCommerce.repositories.CartItemRepository;
import com.abdullah.eCommerce.repositories.CartRepository;
import com.abdullah.eCommerce.repositories.OrderRepository;
import com.abdullah.eCommerce.repositories.UserRepository;
import com.abdullah.eCommerce.services.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;

    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public int placeOrderFromCart() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new UsernameNotFoundException(email)
                );

        Optional<Cart> cart = cartRepository.findByUser(user);
        if (cart.isEmpty()) return -1;

        Order order = Order.builder().user(user).build();

        List<OrderItem> orderItems = cart.get().getItems().stream()
                .map((item) -> OrderItem.builder()
                        .order(order)
                        .product(item.getProduct())
                        .pricePerUnit(item.getProduct().getPrice())
                        .quantity(item.getQuantity())
                        .build()
                ).toList();

        if (orderItems.isEmpty()) return -1;

        order.setItems(orderItems);
        orderRepository.save(order);

        cartItemRepository.deleteByCartId(cart.get().getId());

        return order.getId();
    }

    @Override
    public List<OrderDto> getOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new UsernameNotFoundException(email)
                );

        List<Order> orders = orderRepository.findByUserIdOrderByOrderedAtDesc(user.getId());

        return orderMapper.toOrdersDto(orders);
    }
}
