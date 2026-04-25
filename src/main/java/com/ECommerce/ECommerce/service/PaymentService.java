package com.ECommerce.ECommerce.service;

import com.ECommerce.ECommerce.dto.PaymentRequest;
import com.ECommerce.ECommerce.dto.PaymentResponse;
import com.ECommerce.ECommerce.model.Payment;
import com.ECommerce.ECommerce.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CartService cartService;
    private final com.ECommerce.ECommerce.repository.OrderRepository orderRepository;
    private final com.ECommerce.ECommerce.repository.CartItemRepository cartItemRepository;

    public PaymentService(PaymentRepository paymentRepository, 
                          CartService cartService,
                          com.ECommerce.ECommerce.repository.OrderRepository orderRepository,
                          com.ECommerce.ECommerce.repository.CartItemRepository cartItemRepository) {
        this.paymentRepository = paymentRepository;
        this.cartService = cartService;
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        double total;
        
        // Priority 1: Use amount from request if provided
        if (request.getAmount() > 0) {
            total = request.getAmount();
        } 
        // Priority 2: Calculate from item IDs
        else if (request.getItemIds() != null && !request.getItemIds().isEmpty()) {
            total = cartService.getSelectedItemsTotal(request.getItemIds());
        } 
        // Priority 3: Use full cart total
        else {
            total = cartService.getCartTotal();
        }

        if (total <= 0) {
            System.err.println("PAYMENT FAILED: Calculated total is 0. Request Amount: " + request.getAmount() + ", ItemCount: " + (request.getItemIds() != null ? request.getItemIds().size() : 0));
            return new PaymentResponse(null, "FAILED", 0, "Amount is 0 or items not found. Please try again.");
        }

        Payment payment = new Payment();
        payment.setFullName(request.getFullName());
        payment.setEmail(request.getEmail());
        payment.setAddress(request.getAddress());
        payment.setCity(request.getCity());
        payment.setCountry(request.getCountry());
        payment.setCustomerName(request.getCustomerName());
        payment.setPaymentId(request.getPaymentId() != null ? request.getPaymentId() : "PAY-" + System.currentTimeMillis());
        payment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CARD");
        payment.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber() : "0000000000");
        payment.setCardNumber(request.getCardNumber());
        payment.setExpiry(request.getExpiry());
        payment.setCvv(request.getCvv());
        payment.setAmount(total);
        payment.setStatus("PAID");
        payment.setPaymentDate(LocalDateTime.now());

        try {
            Payment savedPayment = paymentRepository.save(payment);
            System.out.println("Payment saved successfully: " + savedPayment.getId());

            // --- Create Tracking Orders ---
            List<com.ECommerce.ECommerce.model.CartItem> itemsToConvert;
            if (request.getItemIds() != null && !request.getItemIds().isEmpty()) {
                itemsToConvert = cartItemRepository.findAllById(request.getItemIds());
            } else {
                itemsToConvert = cartItemRepository.findAll();
            }

            for (com.ECommerce.ECommerce.model.CartItem item : itemsToConvert) {
                com.ECommerce.ECommerce.model.Order order = new com.ECommerce.ECommerce.model.Order();
                order.setProductName(item.getName());
                order.setProductPrice(item.getPrice());
                order.setProductImage(item.getImage());
                order.setQuantity(item.getQuantity() > 0 ? item.getQuantity() : 1);
                order.setCustomerName(request.getFullName());
                order.setCustomerEmail(request.getEmail());
                order.setShippingAddress(request.getAddress() + ", " + request.getCity() + ", " + request.getCountry());
                order.setOrderDate(LocalDateTime.now());
                order.setStatus("PAID");
                order.setPaymentStatus("PAID");
                
                if (request.getUserId() != null) {
                    com.ECommerce.ECommerce.model.User user = new com.ECommerce.ECommerce.model.User();
                    user.setId(request.getUserId());
                    order.setUser(user);
                }

                // user_id and product_id are now nullable in DB
                orderRepository.save(order);
                System.out.println("Order created for product: " + item.getName());
            }

            if (request.getItemIds() != null && !request.getItemIds().isEmpty()) {
                for (Long id : request.getItemIds()) {
                    cartService.deleteItem(id);
                }
            } else {
                cartService.clearCart();
            }

            return new PaymentResponse(
                    savedPayment.getId(),
                    savedPayment.getStatus(),
                    savedPayment.getAmount(),
                    "Payment successful"
            );
        } catch (Exception e) {
            System.err.println("DATABASE ERROR DURING PAYMENT: " + e.getMessage());
            e.printStackTrace();
            throw e; // Rethrow to trigger transaction rollback
        }
    }
}
