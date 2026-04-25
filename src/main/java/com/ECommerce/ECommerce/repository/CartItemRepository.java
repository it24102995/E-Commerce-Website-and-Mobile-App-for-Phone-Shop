package com.ECommerce.ECommerce.repository;

import com.ECommerce.ECommerce.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
