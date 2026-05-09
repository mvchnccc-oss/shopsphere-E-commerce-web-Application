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
import com.abdullah.eCommerce.services.CartService;
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
    private UserService userService;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    private CartService cartService;

    @BeforeEach
    void setUp() {
        cartService = new CartServiceImpl(
            userService,
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
            List<CartItem> cartItems = IntStream.rangeClosed(1, 3)
                .mapToObj(i -> CartItem.builder()
                    .id(new CartItem.Id(1L, (long) i))
                    .product(Product.builder().id((long) i).build())
                    .quantity(i)
                    .build())
                .toList();

            User user = User.builder().id(1L).cartItems(cartItems).build();

            when(userService.getUser()).thenReturn(user);

            List<CartItemDto> result = cartService.getCartItems();

            assertEquals(3, result.size());
            verify(userService).getUser();
        }

        @Test
        @DisplayName("Empty")
        void getCartItemsEmpty() {
            User user = User.builder().id(1L).cartItems(Collections.emptyList()).build();

            when(userService.getUser()).thenReturn(user);

            List<CartItemDto> result = cartService.getCartItems();

            assertTrue(result.isEmpty());
        }
    }

    @Nested
    @DisplayName("Update Quantity")
    class UpdateQuantity {

        @Test
        @DisplayName("Remove Item When Quantity Is Zero")
        void updateQuantityZero() {
            User user = User.builder().id(1L).build();

            when(userService.getUser()).thenReturn(user);

            cartService.updateQuantity(1L, 0);

            verify(cartItemRepository).deleteById(new CartItem.Id(1L, 1L));
            verify(cartItemRepository, never()).save(any());
        }

        @Test
        @DisplayName("Add New Item When Not In Cart")
        void updateQuantityNewItem() {
            User user = User.builder().id(1L).build();
            Product product = Product.builder().id(1L).build();

            when(userService.getUser()).thenReturn(user);
            when(cartItemRepository.findById(new CartItem.Id(1L, 1L))).thenReturn(Optional.empty());
            when(productRepository.getReferenceById(1L)).thenReturn(product);

            cartService.updateQuantity(1L, 3);

            verify(cartItemRepository).save(any(CartItem.class));
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

            when(userService.getUser()).thenReturn(user);
            when(cartItemRepository.findById(new CartItem.Id(1L, 1L))).thenReturn(Optional.of(existingItem));

            cartService.updateQuantity(1L, 5);

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
            User user = User.builder().id(1L).build();

            when(userService.getUser()).thenReturn(user);

            cartService.clear();

            verify(cartItemRepository).deleteByUserId(1L);
        }
    }
}