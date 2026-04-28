package com.abdullah.eCommerce.exceptions;

import lombok.Getter;

@Getter
public class CategoryNotFoundException extends RuntimeException {
    private final Long id;

    public CategoryNotFoundException(Long id) {
        super("Category not found with id: " + id);
        this.id = id;
    }
}
