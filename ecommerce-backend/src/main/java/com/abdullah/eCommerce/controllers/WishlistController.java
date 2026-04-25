package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.domain.dtos.WishlistDto;
import com.abdullah.eCommerce.domain.dtos.WishlistProductRequestDto;
import com.abdullah.eCommerce.mappers.WishlistMapper;
import com.abdullah.eCommerce.services.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;
    private final WishlistMapper wishlistMapper;

    @GetMapping
    public Map<String, List<Integer>> getWishlist() {
        List<WishlistDto> wishlistItems = wishlistMapper.toDtoList(
                wishlistService.getWishlist()
        );

        return Map.of(
                "products",
                wishlistItems.stream().map(WishlistDto::getProductId).toList()
        );
    }

    @PostMapping
    public void wishlistProduct(@Valid @RequestBody WishlistProductRequestDto body) {
        wishlistService.wishlist(body.productId);
    }

    @DeleteMapping("/{id}")
    public void unWishlistProduct(@PathVariable Integer id) {
        if (id == null) return;

        wishlistService.unWishlist(id);
    }
}
