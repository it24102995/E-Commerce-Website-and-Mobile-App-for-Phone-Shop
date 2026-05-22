package com.fooddelivery.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.model.FoodItem;
import com.fooddelivery.model.Review;
import com.fooddelivery.repository.FoodItemRepository;
import com.fooddelivery.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PublicController {

    private final FoodItemRepository foodItemRepository;
    private final ReviewRepository reviewRepository;

    @GetMapping("/foods")
    public List<FoodItem> getFoods() {
        return foodItemRepository.findByAvailableTrueOrderByCreatedAtDesc();
    }

    @GetMapping("/foods/{id}")
    public FoodItem getFood(@PathVariable String id) {
        return foodItemRepository.findById(id).orElseThrow();
    }

    @GetMapping("/featured-foods")
    public List<FoodItem> getFeaturedFoods() {
        return foodItemRepository.findByFeaturedTrueOrderByCreatedAtDesc();
    }

    @GetMapping("/reviews/public")
    public List<Review> getPublicReviews() {
        return reviewRepository.findByApprovedTrueOrderByCreatedAtDesc();
    }
}