package com.ECommerce.ECommerce.complaints.controller;

import com.ECommerce.ECommerce.complaints.entity.Promotion;
import com.ECommerce.ECommerce.complaints.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*")
public class PromotionController {

    @Autowired
    private PromotionRepository promotionRepository;

    @GetMapping
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    @PostMapping
    public Promotion createPromotion(@RequestBody Promotion promotion) {
        promotion.setPromoCode(promotion.getPromoCode().toUpperCase());
        return promotionRepository.save(promotion);
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<?> validatePromoCode(@PathVariable String code) {
        Optional<Promotion> promoOpt = promotionRepository.findByPromoCode(code.toUpperCase());
        if (promoOpt.isPresent() && promoOpt.get().isActive()) {
            return ResponseEntity.ok(promoOpt.get());
        }
        return ResponseEntity.badRequest().body("Invalid or inactive promo code.");
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> togglePromotionStatus(@PathVariable Long id) {
        Optional<Promotion> promoOpt = promotionRepository.findById(id);
        if (promoOpt.isPresent()) {
            Promotion promo = promoOpt.get();
            promo.setActive(!promo.isActive());
            promotionRepository.save(promo);
            return ResponseEntity.ok(promo);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable Long id) {
        if (promotionRepository.existsById(id)) {
            promotionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
