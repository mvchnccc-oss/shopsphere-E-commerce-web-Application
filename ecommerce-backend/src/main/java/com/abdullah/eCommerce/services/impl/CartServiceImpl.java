package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.CartItemDto;
import com.abdullah.eCommerce.entities.CartItem;
import com.abdullah.eCommerce.entities.User;
import com.abdullah.eCommerce.mappers.CartItemMapper;
import com.abdullah.eCommerce.repositories.CartItemRepository;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.services.CartService;
import com.abdullah.eCommerce.services.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final UserService userService;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final CartItemMapper cartItemMapper;

    @Override
    public List<CartItemDto> getCartItems() {
        List<CartItem> cartItems = userService.getUser().getCartItems();

        return cartItemMapper.toDtoList(cartItems);
    }

    @Override
    @Transactional
    public void updateQuantity(Long productId, int quantity) {
        User user = userService.getUser();

        if (quantity == 0) {
            cartItemRepository.deleteById(new CartItem.Id(user.getId(), productId));
            return;
        }

        Optional<CartItem> cartItem = cartItemRepository.findById(
                new CartItem.Id(user.getId(), productId)
        );

        if (cartItem.isEmpty()) {
            CartItem item = CartItem.builder()
                    .id(new CartItem.Id(user.getId(), productId))
                    .product(productRepository.getReferenceById(productId))
                    .user(user)
                    .quantity(quantity)
                    .build();

            cartItemRepository.save(item);
            return;
        }

        cartItem.get().setQuantity(quantity);
        cartItemRepository.save(cartItem.get());
    }

    @Override
    @Transactional
    public void clear() {
        cartItemRepository.deleteByUserId(userService.getUser().getId());
    }
}
