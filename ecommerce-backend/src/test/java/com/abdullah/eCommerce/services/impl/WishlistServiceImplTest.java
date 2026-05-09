package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.entities.Product;
import com.abdullah.eCommerce.entities.User;
import com.abdullah.eCommerce.entities.WishlistItem;
import com.abdullah.eCommerce.mappers.WishlistMapper;
import com.abdullah.eCommerce.mappers.WishlistMapperImpl;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.repositories.WishlistItemRepository;
import com.abdullah.eCommerce.services.UserService;
import com.abdullah.eCommerce.services.WishlistService;
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
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@Import({WishlistMapperImpl.class})
class WishlistServiceImplTest {

    @Autowired
    private WishlistMapper wishlistMapper;

    @Mock
    private UserService userService;

    @Mock
    private WishlistItemRepository wishlistItemRepository;

    @Mock
    private ProductRepository productRepository;

    private WishlistService wishlistService;

    @BeforeEach
    void setUp() {
        wishlistService = new WishlistServiceImpl(
            userService,
            wishlistItemRepository,
            productRepository,
            wishlistMapper
        );
    }

    @Nested
    @DisplayName("Wishlist")
    class Wishlist {

        @Test
        @DisplayName("Add To Wishlist")
        void wishlist() {
            User user = User.builder().id(1L).build();
            Product product = Product.builder().id(1L).build();

            when(userService.getUser()).thenReturn(user);
            when(productRepository.getReferenceById(1L)).thenReturn(product);

            wishlistService.wishlist(1L);

            verify(wishlistItemRepository).save(any(WishlistItem.class));
        }

        @Test
        @DisplayName("Remove From Wishlist")
        void unWishlist() {
            User user = User.builder().id(1L).build();

            when(userService.getUser()).thenReturn(user);

            wishlistService.unWishlist(1L);

            verify(wishlistItemRepository).deleteById(new WishlistItem.Id(1L, 1L));
        }
    }

    @Nested
    @DisplayName("Get Wishlist")
    class GetWishlist {

        @Test
        @DisplayName("All")
        void getWishlist() {
            User user = User.builder().id(1L).build();

            List<WishlistItem> wishlistItems = IntStream.rangeClosed(1, 5)
                .mapToObj(i -> WishlistItem.builder()
                    .id(new WishlistItem.Id(1L, (long) i))
                    .product(Product.builder().id((long) i).build())
                    .user(user)
                    .build())
                .toList();

            when(userService.getUser()).thenReturn(user);
            when(wishlistItemRepository.findByUserId(1L)).thenReturn(wishlistItems);

            List<Long> result = wishlistService.getWishlist();

            assertEquals(5, result.size());
            assertEquals(List.of(1L, 2L, 3L, 4L, 5L), result);

            verify(wishlistItemRepository).findByUserId(1L);
        }

        @Test
        @DisplayName("Empty")
        void getWishlistEmpty() {
            User user = User.builder().id(1L).build();

            when(userService.getUser()).thenReturn(user);
            when(wishlistItemRepository.findByUserId(1L)).thenReturn(Collections.emptyList());

            List<Long> result = wishlistService.getWishlist();

            assertTrue(result.isEmpty());

            verify(wishlistItemRepository).findByUserId(1L);
        }
    }
}