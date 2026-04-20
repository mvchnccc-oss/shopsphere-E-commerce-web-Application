package com.abdullah.eCommerce.exceptions;

public class CategoryNotFoundException extends RuntimeException {
    private final Integer id;

    public Integer getId() {
        return id;
    }

    public CategoryNotFoundException(Integer id) {
        super("Category not found with id: " + id);
        this.id = id;
    }
}
