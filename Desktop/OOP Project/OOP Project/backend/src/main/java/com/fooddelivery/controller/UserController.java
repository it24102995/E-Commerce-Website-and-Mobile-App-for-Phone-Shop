package com.fooddelivery.controller;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
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
import com.fooddelivery.model.Order;
import com.fooddelivery.model.OrderStatus;
import com.fooddelivery.model.Review;
import com.fooddelivery.repository.FoodItemRepository;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.ReviewRepository;
import com.fooddelivery.repository.UserRepository;
import com.fooddelivery.service.CurrentUserService;
import com.fooddelivery.service.OrderService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final FoodItemRepository foodItemRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final OrderService orderService;

    @GetMapping("/profile")
    public AppUser profile() {
        return currentUserService.requireCurrentUser();
    }

    @PutMapping("/profile")
    public AppUser updateProfile(@RequestBody ProfileRequest request) {
        AppUser user = currentUserService.requireCurrentUser();
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        return userRepository.save(user);
    }

    @GetMapping("/orders")
    public List<Order> getOrders() {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(currentUserService.requireCurrentUser().getId());
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        AppUser user = currentUserService.requireCurrentUser();
        Order order = orderRepository.findById(id).orElseThrow();
        if (!order.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/orders")
    public ResponseEntity<Object> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        try {
            AppUser user = currentUserService.requireCurrentUser();
            Order order = orderService.createOrder(user.getId(), user.getFullName(), user.getEmail(),
                    request.getFoodItemId(), request.getAddress(), request.getNote(), request.getQuantity());
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/reviews")
    public ResponseEntity<Review> createReview(@Valid @RequestBody CreateReviewRequest request) {
        AppUser user = currentUserService.requireCurrentUser();
        FoodItem foodItem = foodItemRepository.findById(request.getFoodItemId()).orElseThrow();
        Review review = reviewRepository.save(Review.builder()
                .userId(user.getId())
                .userName(user.getFullName())
                .foodItemId(foodItem.getId())
                .foodItemName(foodItem.getName())
                .rating(request.getRating())
                .comment(request.getComment())
                .approved(false)
                .createdAt(Instant.now())
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @GetMapping("/reviews")
    public List<Review> getMyReviews() {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(currentUserService.requireCurrentUser().getId());
    }

    @PutMapping("/reviews/{id}")
    public Review updateReview(@PathVariable String id, @Valid @RequestBody UpdateReviewRequest request) {
        AppUser user = currentUserService.requireCurrentUser();
        Review review = reviewRepository.findById(id).orElseThrow();
        if (!review.getUserId().equals(user.getId())) {
            throw new IllegalStateException("Not allowed");
        }
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        // mark for re-approval when edited
        review.setApproved(false);
        return reviewRepository.save(review);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        AppUser user = currentUserService.requireCurrentUser();
        Review review = reviewRepository.findById(id).orElseThrow();
        if (!review.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        reviewRepository.delete(review);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/orders/{id}/status")
    public Order refreshOrderStatus(@PathVariable String id) {
        Order order = orderRepository.findById(id).orElseThrow();
        if (!order.getUserId().equals(currentUserService.requireCurrentUser().getId())) {
            throw new IllegalStateException("Not allowed");
        }
        return order;
    }

    @Data
    public static class ProfileRequest {
        private String fullName;
        private String phone;
        private String address;
    }

    @Data
    public static class CreateOrderRequest {
        @NotBlank
        private String foodItemId;

        @Min(1)
        private int quantity;

        @NotBlank
        private String address;

        private String note;
    }

    @Data
    public static class CreateReviewRequest {
        @NotBlank
        private String foodItemId;

        @Min(1)
        @Max(5)
        private int rating;

        @NotNull
        private String comment;
    }

    @Data
    public static class UpdateReviewRequest {
        @Min(1)
        @Max(5)
        private int rating;

        @NotNull
        private String comment;
    }

    @Data
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }
}
