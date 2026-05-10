package com.abdullah.eCommerce.dtos.responses;

import com.abdullah.eCommerce.dtos.AdminDashboardUserDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Data
public class GetUsersResponse {
    private List<AdminDashboardUserDto> users;
}
