package com.ECommerce.ECommerce.service;

import com.ECommerce.ECommerce.dto.PaymentRequest;
import com.ECommerce.ECommerce.dto.PaymentResponse;
import com.ECommerce.ECommerce.model.Payment;
import com.ECommerce.ECommerce.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CartService cartService;

    public PaymentService(PaymentRepository paymentRepository, CartService cartService) {
        this.paymentRepository = paymentRepository;
        this.cartService = cartService;
    }

    public PaymentResponse processPayment(PaymentRequest request) {
        double total = cartService.getCartTotal();

        if (total <= 0) {
            return new PaymentResponse(null, "FAILED", 0, "Cart is empty");
        }

        Payment payment = new Payment();
        payment.setFullName(request.getFullName());
        payment.setEmail(request.getEmail());
        payment.setAddress(request.getAddress());
        payment.setCardNumber(request.getCardNumber());
        payment.setExpiry(request.getExpiry());
        payment.setCvv(request.getCvv());
        payment.setAmount(total);
        payment.setStatus("PAID");
        payment.setPaymentDate(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        cartService.clearCart();

        return new PaymentResponse(
                savedPayment.getId(),
                savedPayment.getStatus(),
                savedPayment.getAmount(),
                "Payment successful"
        );
    }
}