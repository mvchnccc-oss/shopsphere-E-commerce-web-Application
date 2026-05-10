package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.WishlistDto;
import com.abdullah.eCommerce.entities.Product;
import com.abdullah.eCommerce.entities.WishlistItem;
import com.abdullah.eCommerce.mappers.WishlistMapper;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.repositories.UserRepository;
import com.abdullah.eCommerce.repositories.WishlistItemRepository;
import com.abdullah.eCommerce.services.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {
    private final UserRepository userRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final WishlistMapper wishlistMapper;

    @Override
    public void wishlist(Long userId, Long productId) {
        Product product = productRepository.getReferenceById(productId);

        wishlistItemRepository.save(
            new WishlistItem(userRepository.getReferenceById(userId), product)
        );
    }

    @Override
    public void unWishlist(Long userId, Long productId) {
        wishlistItemRepository.deleteById(
            new WishlistItem.Id(userId, productId)
        );
    }

    @Override
    public List<Long> getWishlist(Long userId) {
        List<WishlistItem> wishlistItems = wishlistItemRepository.findByUserId(userId);

        return wishlistMapper
            .toDtoList(wishlistItems)
            .stream()
            .map(WishlistDto::getProductId)
            .toList();
    }
}
