package com.ECommerce.ECommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rider_locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiderLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rider_id", nullable = false)
    private Long riderId;

    @Column(name = "order_id")
    private Long orderId;

    private double latitude;
    private double longitude;

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.updatedTime = LocalDateTime.now();
    }
}
