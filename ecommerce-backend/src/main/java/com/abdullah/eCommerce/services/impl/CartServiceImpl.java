package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.domain.Cart;
import com.abdullah.eCommerce.domain.CartItem;
import com.abdullah.eCommerce.domain.Product;
import com.abdullah.eCommerce.domain.User;
import com.abdullah.eCommerce.exceptions.CartNotFoundException;
import com.abdullah.eCommerce.exceptions.CategoryNotFoundException;
import com.abdullah.eCommerce.exceptions.ProductNotFoundException;
import com.abdullah.eCommerce.repositories.CartItemRepository;
import com.abdullah.eCommerce.repositories.CartRepository;
import com.abdullah.eCommerce.repositories.ProductRepository;
import com.abdullah.eCommerce.repositories.UserRepository;
import com.abdullah.eCommerce.services.CartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public Cart getCart() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new UsernameNotFoundException(email)
                );

        return cartRepository.findByUser(user)
                .orElseThrow(
                        () -> new CartNotFoundException(user.getId())
                );
    }

    @Override
    @Transactional
    public void update(int productId, int quantity) {
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        Cart cart = getCart();
        System.out.println(quantity);
        if (quantity == 0) {
            cartItemRepository.deleteByProductIdAndCartId(productId, cart.getId());
            System.out.println("deleted");
            return;
        }

        Optional<CartItem> cartItem = cartItemRepository
                    .findByProductIdAndCartId(productId, cart.getId());

        if (cartItem.isEmpty()) {
            CartItem item = CartItem.builder().
                    product(product)
                    .cart(cart)
                    .quantity(quantity)
                    .build();

            cartItemRepository.save(item);
            return;
        }

        cartItem.get().setQuantity(quantity);
        cartItemRepository.save(cartItem.get());
    }
}
