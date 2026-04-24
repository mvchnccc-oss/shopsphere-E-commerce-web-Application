package com.abdullah.eCommerce.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "order_addresses")
public class OrderAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    @Column
    private String firstname;

    @Column
    private String lastname;

    @Column
    private String city;

    @Column
    private String street;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;
}
