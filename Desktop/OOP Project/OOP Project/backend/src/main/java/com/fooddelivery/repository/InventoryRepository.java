package com.fooddelivery.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.fooddelivery.model.Inventory;

public interface InventoryRepository extends MongoRepository<Inventory, String> {
    Optional<Inventory> findByFoodItemId(String foodItemId);
}
