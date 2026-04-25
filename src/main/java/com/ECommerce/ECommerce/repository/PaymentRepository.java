package com.ECommerce.ECommerce.repository;

import com.ECommerce.ECommerce.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
