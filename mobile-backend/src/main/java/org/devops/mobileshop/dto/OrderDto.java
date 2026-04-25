package org.devops.mobileshop.dto;

import java.util.List;



public record OrderDto(String customerName, String customerId    , String  shippingAddress , String billingAddress , List<String
        > ids ) {





}
