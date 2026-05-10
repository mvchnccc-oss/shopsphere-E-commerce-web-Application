package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.dtos.CartItemDto;
import com.abdullah.eCommerce.dtos.requests.UpdateCartRequest;
import com.abdullah.eCommerce.dtos.responses.GetCartResponse;
import com.abdullah.eCommerce.services.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public GetCartResponse getCart(@RequestAttribute Long userId) {
        List<CartItemDto> cartItems = cartService.getCartItems(userId);

        return new GetCartResponse(cartItems);
    }

    @PostMapping
    public void addToCart(@RequestAttribute Long userId, @RequestBody @Valid UpdateCartRequest body) {
        cartService.updateQuantity(userId, body.productId, body.quantity);
    }

    @DeleteMapping
    public void clear(@RequestAttribute Long userId) {
        cartService.clear(userId);
    }
}
