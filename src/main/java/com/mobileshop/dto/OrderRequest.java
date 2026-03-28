package com.mobileshop.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotEmpty(message = "Cart items cannot be empty")
        @jakarta.validation.Valid
    private List<OrderItemRequest> items;

        @NotBlank(message = "Payment method is required")
        @Pattern(
            regexp = "CREDIT_CARD|DEBIT_CARD|CASH_ON_DELIVERY|BANK_TRANSFER",
            flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "Payment method must be CREDIT_CARD, DEBIT_CARD, CASH_ON_DELIVERY, or BANK_TRANSFER"
        )
    private String paymentMethod;

    @Data
    public static class OrderItemRequest {

        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }
}
