package com.hyundai.complaints.controller;

import com.hyundai.complaints.entity.Promotion;
import com.hyundai.complaints.repository.PromotionRepository;
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

    // 1. GET ALL: For the Marketing Dashboard to see all vouchers
    @GetMapping
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    // 2. CREATE: For adding a new voucher
    @PostMapping
    public Promotion createPromotion(@RequestBody Promotion promotion) {
        promotion.setPromoCode(promotion.getPromoCode().toUpperCase());
        return promotionRepository.save(promotion);
    }

    // 3. VALIDATE: For the frontend to check if a code is valid (What we built earlier)
    @GetMapping("/validate/{code}")
    public ResponseEntity<?> validatePromoCode(@PathVariable String code) {
        Optional<Promotion> promoOpt = promotionRepository.findByPromoCode(code.toUpperCase());
        if (promoOpt.isPresent() && promoOpt.get().isActive()) {
            return ResponseEntity.ok(promoOpt.get());
        }
        return ResponseEntity.badRequest().body("Invalid or inactive promo code.");
    }
    // 4. TOGGLE STATUS (Deactivate / Reactivate)
    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> togglePromotionStatus(@PathVariable Long id) {
        Optional<Promotion> promoOpt = promotionRepository.findById(id);
        if (promoOpt.isPresent()) {
            Promotion promo = promoOpt.get();
            // Flip the boolean (if true make false, if false make true)
            promo.setActive(!promo.isActive());
            promotionRepository.save(promo);
            return ResponseEntity.ok(promo);
        }
        return ResponseEntity.notFound().build();
    }

    // 5. DELETE: Completely remove a voucher
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable Long id) {
        if (promotionRepository.existsById(id)) {
            promotionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}