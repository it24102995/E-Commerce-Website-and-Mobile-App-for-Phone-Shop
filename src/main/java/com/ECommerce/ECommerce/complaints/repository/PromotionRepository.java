package com.ECommerce.ECommerce.complaints.repository;

import com.ECommerce.ECommerce.complaints.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findByPromoCode(String promoCode);
}
