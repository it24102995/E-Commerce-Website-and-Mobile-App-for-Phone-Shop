package com.ECommerce.ECommerce.service;

import com.ECommerce.ECommerce.model.CartItem;
import com.ECommerce.ECommerce.repository.CartItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;

    public CartService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public CartItem addItem(CartItem item) {
        if (item.getQuantity() <= 0) {
            item.setQuantity(1);
        }
        return cartItemRepository.save(item);
    }

    public List<CartItem> getAllItems() {
        return cartItemRepository.findAll();
    }

    public void deleteItem(Long id) {
        cartItemRepository.deleteById(id);
    }

    public void clearCart() {
        cartItemRepository.deleteAll();
    }

    public double getCartTotal() {
        return cartItemRepository.findAll()
                .stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
}