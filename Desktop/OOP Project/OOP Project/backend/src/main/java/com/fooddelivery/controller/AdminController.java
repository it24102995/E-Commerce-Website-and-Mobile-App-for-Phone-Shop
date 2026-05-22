package com.fooddelivery.controller;

import java.time.Instant;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.model.AppUser;
import com.fooddelivery.model.FoodItem;
import com.fooddelivery.model.Inventory;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.OrderStatus;
import com.fooddelivery.model.Review;
import com.fooddelivery.model.Role;
import com.fooddelivery.repository.FoodItemRepository;
import com.fooddelivery.repository.InventoryRepository;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.ReviewRepository;
import com.fooddelivery.repository.UserRepository;
import com.fooddelivery.service.InventoryService;
import com.fooddelivery.service.OrderService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final InventoryService inventoryService;
    private final OrderService orderService;

    @GetMapping("/dashboard")
    public AdminSummary dashboard() {
        return new AdminSummary(foodItemRepository.count(), userRepository.count(), orderRepository.count(),
                reviewRepository.count(), inventoryService.getLowStockItems().size());
    }

    @GetMapping("/foods")
    public List<FoodItem> foods() {
        return foodItemRepository.findAll();
    }

    @PostMapping("/foods")
    public ResponseEntity<FoodItem> createFood(@Valid @RequestBody FoodRequest request) {
        FoodItem foodItem = foodItemRepository.save(FoodItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .available(request.isAvailable())
                .featured(request.isFeatured())
                .prepTimeMinutes(request.getPrepTimeMinutes())
                .stockQuantity(request.getStockQuantity())
                .minimumStock(request.getMinimumStock())
                .unit(request.getUnit())
                .lowStockAlert(false)
                .createdAt(Instant.now())
                .build());

        // Create inventory record
        Inventory inventory = Inventory.builder()
                .foodItemId(foodItem.getId())
                .foodItemName(foodItem.getName())
                .totalQuantity(request.getStockQuantity())
                .availableQuantity(request.getStockQuantity())
                .reservedQuantity(0)
                .reorderLevel(request.getMinimumStock())
                .reorderQuantity(request.getReorderQuantity())
        foodItem.setStockQuantity(request.getStockQuantity());
        foodItem.setMinimumStock(request.getMinimumStock());
        foodItem.setUnit(request.getUnit());
                .unit(request.getUnit())
                .location(request.getLocation())
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();
        inventoryService.createInventory(inventory);

        return ResponseEntity.status(HttpStatus.CREATED).body(foodItem);
    }

    @PutMapping("/foods/{id}")
    public FoodItem updateFood(@PathVariable String id, @Valid @RequestBody FoodRequest request) {
        FoodItem foodItem = foodItemRepository.findById(id).orElseThrow();
        foodItem.setName(request.getName());
        foodItem.setDescription(request.getDescription());
        foodItem.setCategory(request.getCategory());
        foodItem.setPrice(request.getPrice());
        foodItem.setImageUrl(request.getImageUrl());
        foodItem.setAvailable(request.isAvailable());
        foodItem.setFeatured(request.isFeatured());
        foodItem.setPrepTimeMinutes(request.getPrepTimeMinutes());
        return foodItemRepository.save(foodItem);
    }

    @DeleteMapping("/foods/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable String id) {
        foodItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public List<AppUser> users() {
        return userRepository.findAll();
    }

    @PutMapping("/users/{id}/role")
    public AppUser changeRole(@PathVariable String id, @RequestBody RoleRequest request) {
        AppUser user = userRepository.findById(id).orElseThrow();
        user.setRole(request.getRole());
        return userRepository.save(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/orders")
    public List<Order> orders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @PutMapping("/orders/{id}/status")
    public Order updateOrderStatus(@PathVariable String id, @RequestBody OrderStatusRequest request) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(request.getStatus());
        order.setUpdatedAt(Instant.now());
        return orderRepository.save(order);
    }

    @GetMapping("/reviews")
    public List<Review> reviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    @PutMapping("/reviews/{id}/approve")
    public Review approveReview(@PathVariable String id) {
        Review review = reviewRepository.findById(id).orElseThrow();
        review.setApproved(true);
        return reviewRepository.save(review);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        reviewRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class AdminSummary {
        private final long foodCount;
        private final long userCount;
        private final long orderCount;
        private final long reviewCount;
        private final long lowStockCount;
    }

    @Data
    public static class FoodRequest {
        @NotBlank
        private String name;

        @NotBlank
        private String description;

        @NotBlank
        private String category;

        @NotNull
        private java.math.BigDecimal price;

        @NotBlank
        private String imageUrl;

        private boolean available;
        private boolean featured;

        @Min(0)
        private int stockQuantity;

        @Min(0)
        private int minimumStock;

        @Min(1)
        private int reorderQuantity;

        private String unit;
        private String location;

        @Min(1)
        private int prepTimeMinutes;
    }

    @Data
    public static class RoleRequest {
        @NotNull
        private Role role;
    }

    @Data
    public static class OrderStatusRequest {
        @NotNull
        private OrderStatus status;
    }
}