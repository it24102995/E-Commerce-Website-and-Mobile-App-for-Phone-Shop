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
