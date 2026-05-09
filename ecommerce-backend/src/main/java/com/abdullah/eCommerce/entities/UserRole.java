package com.abdullah.eCommerce.entities;

public enum UserRole {
    Customer,
    Admin,
    Seller;

    @Override
    public String toString() {
        return "ROLE_" + this.name().toUpperCase();
    }
}
