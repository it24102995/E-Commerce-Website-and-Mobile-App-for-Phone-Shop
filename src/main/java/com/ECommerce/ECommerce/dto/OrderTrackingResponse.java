package com.ECommerce.ECommerce.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderTrackingResponse {
    private Long orderId;
    private String customerName;
    private Long customerId;
    private String shippingAddress;
    private String billingAddress;
    private String status;
    private double totalAmount;
    private Long riderId;
    private String riderName;
    private List<ProductItemDTO> productList;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductItemDTO {
        private String model;
        private double price;
        private int quantity;
        private String image;
        private int stock;
    }
}
