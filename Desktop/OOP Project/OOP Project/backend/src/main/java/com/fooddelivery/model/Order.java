package com.fooddelivery.model;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("orders")
public class Order {

    @Id
    private String id;

    private String userId;
    private String userName;
    private String userEmail;
    private String foodItemId;
    private String foodItemName;
    private int quantity;
    private String address;
    private String note;
    private BigDecimal totalPrice;
    private OrderStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}