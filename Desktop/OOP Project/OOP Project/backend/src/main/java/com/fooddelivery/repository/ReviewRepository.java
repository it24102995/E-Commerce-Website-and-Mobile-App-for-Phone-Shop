package com.fooddelivery.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.fooddelivery.model.Review;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByApprovedTrueOrderByCreatedAtDesc();
    List<Review> findAllByOrderByCreatedAtDesc();
    List<Review> findByUserIdOrderByCreatedAtDesc(String userId);
}