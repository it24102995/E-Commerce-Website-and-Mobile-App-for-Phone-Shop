package com.ECommerce.ECommerce.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Object> payload) {

        try {
            // 🔐 Stripe init
            Stripe.apiKey = stripeSecretKey;

            // 📌 get amount
            Object amountObj = payload.get("amount");

            if (amountObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Amount is required"));
            }

            long amount;

            try {
                amount = Long.parseLong(amountObj.toString());
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid amount format"));
            }

            if (amount <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Amount must be greater than 0"));
            }

            // 💰 Stripe uses cents → Rs → multiply if needed (optional)
            // example: Rs 1000 = 1000 * 100 = 100000
            // if you want rupees:
            // amount = amount * 100;

            PaymentIntentCreateParams params =
                    PaymentIntentCreateParams.builder()
                            .setAmount(amount)
                            .setCurrency("usd") // ⚠️ test mode → usd only safe
                            .setAutomaticPaymentMethods(
                                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                            .setEnabled(true)
                                            .build()
                            )
                            .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("paymentIntentId", paymentIntent.getId());

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Stripe error: " + e.getMessage()));
        }
    }
}