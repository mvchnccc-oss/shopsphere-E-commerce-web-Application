package com.abdullah.eCommerce.dtos;

import com.abdullah.eCommerce.entities.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminDashboardUserDto {
    public long id;
    public String name;
    public String email;
    public UserRole role;
    public boolean isLocked;
}