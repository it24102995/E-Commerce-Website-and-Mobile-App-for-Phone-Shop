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
        if (request.getItemIds() != null && !request.getItemIds().isEmpty()) {
            total = cartService.getSelectedItemsTotal(request.getItemIds());
        } else {
            total = cartService.getCartTotal();
        }

        if (total <= 0) {
            return new PaymentResponse(null, "FAILED", 0, "Amount is 0 or items not found");
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

        Payment savedPayment = paymentRepository.save(payment);

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
            order.setQuantity(item.getQuantity());
            order.setCustomerName(request.getFullName());
            order.setCustomerEmail(request.getEmail());
            order.setShippingAddress(request.getAddress() + ", " + request.getCity() + ", " + request.getCountry());
            order.setOrderDate(LocalDateTime.now());
            order.setStatus("PAID");
            order.setPaymentStatus("PAID"); // Required by database constraint
            orderRepository.save(order);
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
    }
}
