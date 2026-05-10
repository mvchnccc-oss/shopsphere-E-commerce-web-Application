package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.dtos.requests.WishlistProductRequestDto;
import com.abdullah.eCommerce.dtos.responses.GetWishlistResponse;
import com.abdullah.eCommerce.services.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;

    @GetMapping
    public GetWishlistResponse getWishlist(@RequestAttribute Long userId) {
        List<Long> wishlistItems = wishlistService.getWishlist(userId);

        return new GetWishlistResponse(wishlistItems);
    }

    @PostMapping
    public void wishlistProduct(
        @RequestAttribute Long userId,
        @Valid @RequestBody WishlistProductRequestDto body
    ) {
        wishlistService.wishlist(userId, body.productId);
    }

    @DeleteMapping("/{id}")
    public void unWishlistProduct(@RequestAttribute Long userId, @PathVariable Long id) {
        wishlistService.unWishlist(userId, id);
    }
}
