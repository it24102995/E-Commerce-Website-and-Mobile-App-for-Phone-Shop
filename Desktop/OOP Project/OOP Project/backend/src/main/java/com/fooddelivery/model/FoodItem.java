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
@Document("food_items")
public class FoodItem {

    @Id
    private String id;

    private String name;
    private String description;
    private String category;
    private BigDecimal price;
    private String imageUrl;
    private boolean available;
    private boolean featured;
    private int prepTimeMinutes;
    private int stockQuantity;
    private int minimumStock;
    private String unit;
    private boolean lowStockAlert;
    private Instant createdAt;
}