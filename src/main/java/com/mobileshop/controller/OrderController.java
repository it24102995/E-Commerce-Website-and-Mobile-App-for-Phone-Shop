package com.mobileshop.controller;

import com.mobileshop.dto.OrderRequest;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import com.mobileshop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Validated
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/order")
    public ResponseEntity<Map<String, Object>> placeOrder(@Valid @RequestBody OrderRequest request) {
        Map<String, Object> result = orderService.placeOrder(request);
        boolean success = (boolean) result.get("success");
        return success ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(@RequestParam(required = false) @Min(value = 1, message = "userId must be greater than 0") Long userId) {
        if (userId != null) {
            return ResponseEntity.ok(orderService.getOrdersByUser(userId));
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PatchMapping("/order/{id}/payment")
    public ResponseEntity<Map<String, Object>> updatePayment(
            @PathVariable Long id,
            @RequestParam
            @NotBlank(message = "status is required")
            @Pattern(
                    regexp = "COMPLETED|PENDING|CASH_ON_DELIVERY|BANK_TRANSFER|CREDIT_CARD|DEBIT_CARD",
                    flags = Pattern.Flag.CASE_INSENSITIVE,
                    message = "status must be COMPLETED, PENDING, CASH_ON_DELIVERY, BANK_TRANSFER, CREDIT_CARD, or DEBIT_CARD"
            ) String status) {
        Map<String, Object> result = orderService.updatePaymentStatus(id, status.trim().toUpperCase(Locale.ROOT));
        boolean success = (boolean) result.get("success");
        return success ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
}
