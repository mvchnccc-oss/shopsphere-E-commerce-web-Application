package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.domain.Cart;
import com.abdullah.eCommerce.domain.dtos.CartDto;
import com.abdullah.eCommerce.mappers.CartMapper;
import com.abdullah.eCommerce.services.CartService;
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
        return ResponseEntity.ok(
                cartMapper.toCartDto(cart)
        );
    }

    @PostMapping("{productId}")
    public ResponseEntity<CartDto> addProductToCart(
            @PathVariable Integer productId
    ){
        return ResponseEntity.ok(
                cartMapper.toCartDto( cartService.addProductToCart(productId))
        );
    }

    @DeleteMapping("{productId}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Integer productId
    ){
        cartService.deleteProductFromCard(productId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
