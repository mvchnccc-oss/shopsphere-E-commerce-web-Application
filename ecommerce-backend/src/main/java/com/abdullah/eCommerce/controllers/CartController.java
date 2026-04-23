package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.domain.Cart;
import com.abdullah.eCommerce.domain.dtos.CartDto;
import com.abdullah.eCommerce.domain.dtos.CartItemDto;
import com.abdullah.eCommerce.domain.dtos.UpdateCartRequestDto;
import com.abdullah.eCommerce.mappers.CartMapper;
import com.abdullah.eCommerce.services.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final CartMapper cartMapper;

    @GetMapping
    public ResponseEntity<CartDto> getCart(){
        Cart cart = cartService.getCart();

        return ResponseEntity.ok(cartMapper.toCartDto(cart));
    }

    @PostMapping
    public void addToCart(@RequestBody @Valid UpdateCartRequestDto body){
        cartService.update(body.getProductId(), body.getQuantity());
    }
}
