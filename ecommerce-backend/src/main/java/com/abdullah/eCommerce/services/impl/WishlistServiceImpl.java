package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.domain.Product;
import com.abdullah.eCommerce.domain.User;
import com.abdullah.eCommerce.domain.Wishlist;
import com.abdullah.eCommerce.domain.WishlistId;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.repositories.WishlistRepository;
import com.abdullah.eCommerce.services.UserService;
import com.abdullah.eCommerce.services.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {
    private final UserService userService;
    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    @Override
    public void wishlist(int productId) {
        User user = userService.getUser();
        Product product = productRepository.getReferenceById(productId);

        wishlistRepository.save(new Wishlist(product, user));
    }

    @Override
    public void unWishlist(int productId) {
        User user = userService.getUser();
        wishlistRepository.deleteById(new WishlistId(productId, user.getId()));
    }

    @Override
    public List<Wishlist> getWishlist() {
        User user = userService.getUser();

        return wishlistRepository.findByUserId(user.getId());
    }
}
