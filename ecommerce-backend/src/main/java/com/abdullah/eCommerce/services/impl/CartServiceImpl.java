package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.CartItemDto;
import com.abdullah.eCommerce.entities.CartItem;
import com.abdullah.eCommerce.mappers.CartItemMapper;
import com.abdullah.eCommerce.repositories.CartItemRepository;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.repositories.UserRepository;
import com.abdullah.eCommerce.services.CartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    private final CartItemMapper cartItemMapper;

    @Override
    public List<CartItemDto> getCartItems(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

        return cartItemMapper.toDtoList(cartItems);
    }

    @Override
    @Transactional
    public void updateQuantity(Long userId, Long productId, int quantity) {
        CartItem.Id itemId = new CartItem.Id(userId, productId);
        if (quantity == 0) {
            cartItemRepository.deleteById(itemId);
            return;
        }

        Optional<CartItem> cartItem = cartItemRepository.findById(itemId);

        if (cartItem.isEmpty()) {
            CartItem item = CartItem.builder()
                .id(itemId)
                .product(productRepository.getReferenceById(productId))
                .user(userRepository.getReferenceById(userId))
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
    public void clear(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
