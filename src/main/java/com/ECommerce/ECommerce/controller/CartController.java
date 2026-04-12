package com.ECommerce.ECommerce.controller;

import com.ECommerce.ECommerce.model.CartItem;
import com.ECommerce.ECommerce.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    public CartItem addItem(@RequestBody CartItem item) {
        return cartService.addItem(item);
    }

    @GetMapping
    public List<CartItem> getAllItems() {
        return cartService.getAllItems();
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        cartService.deleteItem(id);
    }
}