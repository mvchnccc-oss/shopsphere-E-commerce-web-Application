package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.WishlistDto;
import com.abdullah.eCommerce.entities.Product;
import com.abdullah.eCommerce.entities.User;
import com.abdullah.eCommerce.entities.WishlistItem;
import com.abdullah.eCommerce.mappers.WishlistMapper;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.repositories.WishlistItemRepository;
import com.abdullah.eCommerce.services.UserService;
import com.abdullah.eCommerce.services.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {
    private final UserService userService;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final WishlistMapper wishlistMapper;

    @Override
    public void wishlist(Long productId) {
        User user = userService.getUser();
        Product product = productRepository.getReferenceById(productId);

        wishlistItemRepository.save(new WishlistItem(user, product));
    }

    @Override
    public void unWishlist(Long productId) {
        User user = userService.getUser();
        wishlistItemRepository.deleteById(new WishlistItem.Id(user.getId(), productId));
    }

    @Override
    public List<Long> getWishlist() {
        User user = userService.getUser();
        List<WishlistItem> wishlistItems = wishlistItemRepository.findByUserId(user.getId());

        return wishlistMapper
                .toDtoList(wishlistItems)
                .stream()
                .map(WishlistDto::getProductId)
                .toList();
    }
}
