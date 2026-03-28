package com.hyundai.complaints.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String promoCode; // e.g., "SORRY10"

    private double discountPercentage; // e.g., 10.0 for 10% off

    private boolean isActive = true; // Easily turn codes on or off

    // Default Constructor
    public Promotion() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }

    public double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(double discountPercentage) { this.discountPercentage = discountPercentage; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}