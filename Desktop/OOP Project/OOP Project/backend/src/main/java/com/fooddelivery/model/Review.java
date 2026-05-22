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
@Document("reviews")
public class Review {

    @Id
    private String id;

    private String userId;
    private String userName;
    private String foodItemId;
    private String foodItemName;
    private int rating;
    private String comment;
    private boolean approved;
    private Instant createdAt;
}