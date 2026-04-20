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
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

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
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(
                        () -> new CartNotFoundException(user.getId())
                );
        return cart;
    }

    @Override
    public Cart addProductToCart(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
        Cart cart = getCart();
        CartItem cartItem = cartItemRepository.findByProductIdAndCartId(productId, cart.getId())
                .map(current -> {
                    current.setQuantity(current.getQuantity() + 1);
                    return current;
                }).orElse(
                         CartItem.builder()
                                .cart(cart)
                                .product(product)
                                .quantity(1)
                                .build()
                );
        cartItemRepository.save(cartItem);

        calculateTotalPrice(cart);
        return cartRepository.save(cart);
    }

    @Override
    public void deleteProductFromCard(Integer productId) {
        Cart cart = getCart();
        cartItemRepository.findByProductIdAndCartId(productId, cart.getId())
                .orElseThrow(() -> new ProductNotFoundException(productId));
        List<CartItem> items = cart.getItems();
        items.removeIf(item -> item.getProduct().getId().equals(productId));
        cart.setItems(items);
        cartRepository.save(cart);
    }

    private void calculateTotalPrice(Cart cart){
        Long totalPrice = 0L;
        List<CartItem> items = cart.getItems();
        for (CartItem item: items){
            totalPrice += item.getProduct().getPrice() * item.getQuantity();
        }
        cart.setTotalPrice(totalPrice);
        cartRepository.save(cart);
    }
}
