package com.abdullah.eCommerce.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "wishlist")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Wishlist {
    @EmbeddedId
    private WishlistId id;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;


    public Wishlist(Product product, User user) {
        this.product = product;
        this.user = user;
        this.id = new WishlistId(product.getId(), user.getId());
    }
}
