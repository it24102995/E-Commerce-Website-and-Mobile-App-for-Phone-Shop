package com.fooddelivery.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.fooddelivery.model.FoodItem;

public interface FoodItemRepository extends MongoRepository<FoodItem, String> {
    List<FoodItem> findByAvailableTrueOrderByCreatedAtDesc();
    List<FoodItem> findByFeaturedTrueOrderByCreatedAtDesc();
}