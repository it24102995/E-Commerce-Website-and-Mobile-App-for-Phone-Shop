package com.mobileshop.service;

import com.mobileshop.dto.OrderRequest;
import com.mobileshop.model.Order;
import com.mobileshop.model.Product;
import com.mobileshop.model.User;
import com.mobileshop.repository.OrderRepository;
import com.mobileshop.repository.ProductRepository;
import com.mobileshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Map<String, Object> placeOrder(OrderRequest request) {
        Map<String, Object> response = new HashMap<>();

        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        List<Order> createdOrders = new ArrayList<>();
        double totalAmount = 0;

        for (OrderRequest.OrderItemRequest item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId()).orElse(null);
            if (product == null) {
                response.put("success", false);
                response.put("message", "Product not found: ID " + item.getProductId());
                return response;
            }

            if (product.getStock() < item.getQuantity()) {
                response.put("success", false);
                response.put("message", "Insufficient stock for: " + product.getName()
                        + " (available: " + product.getStock() + ")");
                return response;
            }

            // Reduce stock
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            Order order = Order.builder()
                    .user(user)
                    .product(product)
                    .quantity(item.getQuantity())
                    .paymentStatus("COMPLETED")
                    .build();

            createdOrders.add(orderRepository.save(order));
            totalAmount += product.getPrice() * item.getQuantity();
        }

        response.put("success", true);
        response.put("message", "Order placed successfully");
        response.put("orders", createdOrders);
        response.put("totalAmount", totalAmount);
        return response;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public Map<String, Object> updatePaymentStatus(Long orderId, String status) {
        Map<String, Object> response = new HashMap<>();
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Order not found");
            return response;
        }
        Order order = orderOpt.get();
        order.setPaymentStatus(status);
        orderRepository.save(order);
        response.put("success", true);
        response.put("message", "Payment status updated to " + status);
        return response;
    }
}
