package com.abdullah.eCommerce.exceptions;

import java.util.UUID;

public class CartNotFoundException extends RuntimeException {
    public CartNotFoundException(UUID id) {
        super("Cart not found with this id " + id);
    }
}
