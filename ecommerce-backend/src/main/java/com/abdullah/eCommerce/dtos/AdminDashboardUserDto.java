package com.abdullah.eCommerce.dtos;

import com.abdullah.eCommerce.entities.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminDashboardUserDto {
    private long id;
    private String name;
    private String email;
    private UserRole role;
    private boolean isLocked;
}