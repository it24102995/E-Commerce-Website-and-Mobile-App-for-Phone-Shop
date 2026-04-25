package com.ECommerce.ECommerce.repository;

import com.ECommerce.ECommerce.model.RiderLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RiderLocationRepository extends JpaRepository<RiderLocation, Long> {
    Optional<RiderLocation> findByOrderId(Long orderId);
    Optional<RiderLocation> findByRiderId(Long riderId);
}
