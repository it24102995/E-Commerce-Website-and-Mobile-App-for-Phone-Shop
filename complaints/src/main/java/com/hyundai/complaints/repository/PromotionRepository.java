package com.hyundai.complaints.repository;

import com.hyundai.complaints.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    // This tells Spring Boot to find a promo by its text code!
    Optional<Promotion> findByPromoCode(String promoCode);
}