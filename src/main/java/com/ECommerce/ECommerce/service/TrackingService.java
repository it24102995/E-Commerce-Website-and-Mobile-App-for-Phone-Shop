package com.ECommerce.ECommerce.service;

import com.ECommerce.ECommerce.dto.OrderTrackingResponse;
import com.ECommerce.ECommerce.model.Order;
import com.ECommerce.ECommerce.model.RiderLocation;
import com.ECommerce.ECommerce.repository.OrderRepository;
import com.ECommerce.ECommerce.repository.RiderLocationRepository;
import com.ECommerce.ECommerce.repository.RiderRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TrackingService {

    private final OrderRepository orderRepository;
    private final RiderLocationRepository riderLocationRepository;
    private final RiderRepository riderRepository;

    public TrackingService(OrderRepository orderRepository, 
                           RiderLocationRepository riderLocationRepository,
                           RiderRepository riderRepository) {
        this.orderRepository = orderRepository;
        this.riderLocationRepository = riderLocationRepository;
        this.riderRepository = riderRepository;
    }

    public List<OrderTrackingResponse> getAllAvailableOrders() {
        return orderRepository.findAll().stream()
                .filter(o -> o.getRider() == null && "PAID".equalsIgnoreCase(o.getStatus()))
                .map(this::mapToTrackingResponse)
                .collect(Collectors.toList());
    }

    public List<OrderTrackingResponse> getRiderOrders(Long riderId) {
        return orderRepository.findAll().stream()
                .filter(o -> o.getRider() != null && o.getRider().getId().equals(riderId))
                .map(this::mapToTrackingResponse)
                .collect(Collectors.toList());
    }

    public void acceptOrder(Long orderId, Long riderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setRider(riderRepository.findById(riderId)
                .orElseThrow(() -> new RuntimeException("Rider not found")));
        order.setStatus("ACCEPTED");
        orderRepository.save(order);
    }

    public void updateLocation(Long riderId, Long orderId, double lat, double lng) {
        RiderLocation location = riderLocationRepository.findByRiderId(riderId)
                .orElse(new RiderLocation());
        location.setRiderId(riderId);
        location.setOrderId(orderId);
        location.setLatitude(lat);
        location.setLongitude(lng);
        riderLocationRepository.save(location);
    }

    public Optional<RiderLocation> getRiderLocation(Long riderId) {
        return riderLocationRepository.findByRiderId(riderId);
    }

    public Optional<RiderLocation> getOrderLocation(Long orderId) {
        return riderLocationRepository.findByOrderId(orderId);
    }

    private OrderTrackingResponse mapToTrackingResponse(Order order) {
        return OrderTrackingResponse.builder()
                .orderId(order.getId())
                .customerName(order.getCustomerName() != null ? order.getCustomerName() : (order.getUser() != null ? order.getUser().getName() : "Guest"))
                .customerId(order.getUser() != null ? order.getUser().getId() : 0L)
                .shippingAddress(order.getShippingAddress() != null ? order.getShippingAddress() : "No Address Provided")
                .billingAddress(order.getShippingAddress() != null ? order.getShippingAddress() : "No Address Provided")
                .status(order.getStatus())
                .productList(Collections.singletonList(
                        OrderTrackingResponse.ProductItemDTO.builder()
                                .model(order.getProductName() != null ? order.getProductName() : (order.getProduct() != null ? order.getProduct().getName() : "Unknown Product"))
                                .price(order.getProductPrice() > 0 ? order.getProductPrice() : (order.getProduct() != null ? order.getProduct().getPrice() : 0.0))
                                .quantity(order.getQuantity())
                                .image(order.getProductImage() != null ? order.getProductImage() : (order.getProduct() != null ? order.getProduct().getImage() : ""))
                                .build()
                ))
                .build();
    }
}
