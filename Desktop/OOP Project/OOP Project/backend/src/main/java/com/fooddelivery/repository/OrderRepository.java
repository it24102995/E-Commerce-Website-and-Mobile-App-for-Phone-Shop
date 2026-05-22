package com.fooddelivery.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.fooddelivery.model.Order;
import com.fooddelivery.model.OrderStatus;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);
    List<Order> findAllByOrderByCreatedAtDesc();
}