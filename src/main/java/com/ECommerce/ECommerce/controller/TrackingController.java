package com.ECommerce.ECommerce.controller;

import com.ECommerce.ECommerce.dto.OrderTrackingResponse;
import com.ECommerce.ECommerce.model.RiderLocation;
import com.ECommerce.ECommerce.service.TrackingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin(origins = "*")
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @GetMapping("/orders/available")
    public ResponseEntity<List<OrderTrackingResponse>> getAvailableOrders() {
        return ResponseEntity.ok(trackingService.getAllAvailableOrders());
    }

    @GetMapping("/orders/rider/{riderId}")
    public ResponseEntity<List<OrderTrackingResponse>> getRiderOrders(@PathVariable Long riderId) {
        return ResponseEntity.ok(trackingService.getRiderOrders(riderId));
    }

    @PostMapping("/orders/{orderId}/accept")
    public ResponseEntity<?> acceptOrder(@PathVariable Long orderId, @RequestBody Map<String, Long> payload) {
        trackingService.acceptOrder(orderId, payload.get("riderId"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/location/update")
    public ResponseEntity<?> updateLocation(@RequestBody Map<String, Object> payload) {
        trackingService.updateLocation(
                Long.valueOf(payload.get("riderId").toString()),
                payload.get("orderId") != null ? Long.valueOf(payload.get("orderId").toString()) : null,
                Double.parseDouble(payload.get("latitude").toString()),
                Double.parseDouble(payload.get("longitude").toString())
        );
        return ResponseEntity.ok().build();
    }

    @GetMapping("/location/rider/{riderId}")
    public ResponseEntity<RiderLocation> getRiderLocation(@PathVariable Long riderId) {
        return trackingService.getRiderLocation(riderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/location/order/{orderId}")
    public ResponseEntity<RiderLocation> getOrderLocation(@PathVariable Long orderId) {
        return trackingService.getOrderLocation(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
