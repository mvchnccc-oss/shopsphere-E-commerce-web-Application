package com.abdullah.eCommerce.dtos;

import java.math.BigDecimal;

public interface OrderMonthlyRevenue {
    String getMonth();

    BigDecimal getTotal();
}