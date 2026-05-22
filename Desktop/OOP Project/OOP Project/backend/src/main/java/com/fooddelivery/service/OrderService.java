package com.fooddelivery.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.model.FoodItem;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.OrderStatus;
import com.fooddelivery.repository.FoodItemRepository;
import com.fooddelivery.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private InventoryService inventoryService;

    public Order createOrder(String userId, String userName, String userEmail, String foodItemId,
            String address, String note, int quantity) {
        FoodItem foodItem = foodItemRepository.findById(foodItemId).orElseThrow();

        // Check if inventory is available
        if (!inventoryService.reduceInventory(foodItemId, quantity)) {
            throw new IllegalStateException("Insufficient inventory for this item");
        }

        BigDecimal total = foodItem.getPrice().multiply(BigDecimal.valueOf(quantity));

        Order order = Order.builder()
                .userId(userId)
                .userName(userName)
                .userEmail(userEmail)
                .foodItemId(foodItem.getId())
                .foodItemName(foodItem.getName())
                .quantity(quantity)
                .address(address)
                .note(note)
                .totalPrice(total)
                .status(OrderStatus.PENDING)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return orderRepository.save(order);
    }

    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateOrderStatus(String orderId, OrderStatus newStatus) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isPresent()) {
            Order o = order.get();
            o.setStatus(newStatus);
            o.setUpdatedAt(Instant.now());
            return orderRepository.save(o);
        }
        return null;
    }

    public boolean deleteOrder(String orderId) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isPresent()) {
            Order o = order.get();
            // Restore inventory when order is deleted (only if order is still pending)
            if (o.getStatus() == OrderStatus.PENDING) {
                inventoryService.restockInventory(o.getFoodItemId(), o.getQuantity());
            }
            orderRepository.delete(o);
            return true;
        }
        return false;
    }

    public long getTotalOrders() {
        return orderRepository.count();
    }
}
