package org.devops.mobileshop.dto;

public record ProductDto(String id , String model , double price , int quantity  , String description , int stock  ,String image ) {
}
