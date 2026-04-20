package com.abdullah.eCommerce.exceptions;


import lombok.Getter;

@Getter
public class ProductNotFoundException extends RuntimeException {
    private final Integer id;
    public ProductNotFoundException(Integer id) {
        super("Product not found with id : "+ id);
        this.id = id;
    }


}
