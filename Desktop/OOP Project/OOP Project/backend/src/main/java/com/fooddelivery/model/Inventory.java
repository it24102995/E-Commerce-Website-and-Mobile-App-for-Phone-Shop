package com.fooddelivery.model;

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
@Document("inventory")
public class Inventory {

    @Id
    private String id;

    private String foodItemId;
    private String foodItemName;
    private int totalQuantity;
    private int availableQuantity;
    private int reservedQuantity;
    private int reorderLevel;
    private int reorderQuantity;
    private String unit;
    private String location;
    private String lastRestockDate;
    private String expiryDate;
    private Instant lastUpdated;
    private Instant createdAt;
}
