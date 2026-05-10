package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.CartItemDto;
import com.abdullah.eCommerce.entities.CartItem;
import com.abdullah.eCommerce.entities.Product;
import com.abdullah.eCommerce.entities.User;
import com.abdullah.eCommerce.mappers.CartItemMapper;
import com.abdullah.eCommerce.mappers.CartItemMapperImpl;
import com.abdullah.eCommerce.mappers.CategoryMapperImpl;
import com.abdullah.eCommerce.mappers.ProductMapperImpl;
import com.abdullah.eCommerce.repositories.CartItemRepository;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.repositories.UserRepository;
import com.abdullah.eCommerce.services.CartService;
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

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@Import({CartItemMapperImpl.class, ProductMapperImpl.class, CategoryMapperImpl.class})
class CartServiceImplTest {
    @Autowired
    private CartItemMapper cartItemMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    private CartService cartService;

    @BeforeEach
    void setUp() {
        cartService = new CartServiceImpl(
            userRepository,
            productRepository,
            cartItemRepository,
            cartItemMapper
        );
    }

    @Nested
    @DisplayName("Get Cart Items")
    class GetCartItems {
        @Test
        @DisplayName("All")
        void getCartItems() {
            final long userId = 1;

            List<CartItem> cartItems = IntStream.rangeClosed(1, 3)
                .mapToObj(i -> CartItem.builder()
                    .id(new CartItem.Id(userId, (long) i))
                    .product(Product.builder().id((long) i).build())
                    .quantity(i)
                    .build())
                .toList();

            when(cartItemRepository.findByUserId(userId)).thenReturn(cartItems);

            List<CartItemDto> result = cartService.getCartItems(userId);
            assertEquals(3, result.size());
        }

        @Test
        @DisplayName("Empty")
        void getCartItemsEmpty() {
            final long userId = 1;

            when(cartItemRepository.findByUserId(userId)).thenReturn(Collections.emptyList());

            List<CartItemDto> result = cartService.getCartItems(userId);
            assertTrue(result.isEmpty());
        }
    }

    @Nested
    @DisplayName("Update Quantity")
    class UpdateQuantity {
        @Test
        @DisplayName("Remove Item When Quantity Is Zero")
        void updateQuantityZero() {
            final long userId = 1;
            final long productId = 1;

            cartService.updateQuantity(userId, productId, 0);

            verify(cartItemRepository).deleteById(new CartItem.Id(userId, productId));
            verify(cartItemRepository, never()).save(any());
        }

        @Test
        @DisplayName("Add New Item")
        void updateQuantityNewItem() {
            User user = User.builder().id(1L).build();
            Product product = Product.builder().id(1L).build();

            when(cartItemRepository.findById(new CartItem.Id(user.getId(), product.getId())))
                .thenReturn(Optional.empty());

            when(userRepository.getReferenceById(user.getId())).thenReturn(user);
            when(productRepository.getReferenceById(product.getId())).thenReturn(product);

            final int quantity = 3;

            cartService.updateQuantity(user.getId(), product.getId(), quantity);
            verify(cartItemRepository).save(argThat(item -> item.getQuantity() == quantity));
        }

        @Test
        @DisplayName("Update Existing Item Quantity")
        void updateQuantityExistingItem() {
            User user = User.builder().id(1L).build();

            CartItem existingItem = CartItem.builder()
                .id(new CartItem.Id(1L, 1L))
                .product(Product.builder().id(1L).build())
                .user(user)
                .quantity(1)
                .build();

            when(cartItemRepository.findById(existingItem.getId())).thenReturn(Optional.of(existingItem));

            cartService.updateQuantity(user.getId(), 1L, 5);
            assertEquals(5, existingItem.getQuantity());
            verify(cartItemRepository).save(existingItem);
        }
    }

    @Nested
    @DisplayName("Clear Cart")
    class ClearCart {

        @Test
        @DisplayName("Clears All Items")
        void clear() {
            final long userId = 1;
            
            cartService.clear(userId);
            verify(cartItemRepository).deleteByUserId(userId);
        }
    }
}