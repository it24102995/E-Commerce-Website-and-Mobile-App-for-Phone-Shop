package com.ECommerce.ECommerce.service;

import com.ECommerce.ECommerce.dto.ProductRequest;
import com.ECommerce.ECommerce.model.Product;
import com.ECommerce.ECommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // ── READ ─────────────────────────────────────────────────────

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.searchProducts(query);
    }

    // ── CREATE (with duplicate name check) ───────────────────────

    public Map<String, Object> createProduct(ProductRequest request) {
        Map<String, Object> response = new HashMap<>();

        if (productRepository.existsByNameIgnoreCase(request.getName())) {
            response.put("success", false);
            response.put("message", "Product with name '" + request.getName() + "' already exists");
            return response;
        }

        Product product = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .stock(request.getStock())
                .image(request.getImage())
                .discount(request.getDiscount() != null ? request.getDiscount() : 0)
                .isNewArrival(request.getIsNewArrival() != null ? request.getIsNewArrival() : false)
                .build();

        Product saved = productRepository.save(product);

        response.put("success", true);
        response.put("message", "Product added successfully");
        response.put("product", saved);
        return response;
    }

    // ── UPDATE (with duplicate name check) ───────────────────────

    public Map<String, Object> updateProduct(Long id, ProductRequest request) {
        Map<String, Object> response = new HashMap<>();

        Optional<Product> existingOpt = productRepository.findById(id);
        if (existingOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Product not found");
            return response;
        }

        // Check duplicate name, excluding current product
        Optional<Product> duplicate = productRepository.findByNameIgnoreCase(request.getName());
        if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
            response.put("success", false);
            response.put("message", "Another product with name '" + request.getName() + "' already exists");
            return response;
        }

        Product product = existingOpt.get();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        if (request.getImage() != null && !request.getImage().isBlank()) {
            product.setImage(request.getImage());
        }
        product.setDiscount(request.getDiscount() != null ? request.getDiscount() : 0);
        product.setIsNewArrival(request.getIsNewArrival() != null ? request.getIsNewArrival() : false);

        Product saved = productRepository.save(product);

        response.put("success", true);
        response.put("message", "Product updated successfully");
        response.put("product", saved);
        return response;
    }

    // ── DELETE ───────────────────────────────────────────────────

    public Map<String, Object> deleteProduct(Long id) {
        Map<String, Object> response = new HashMap<>();

        if (!productRepository.existsById(id)) {
            response.put("success", false);
            response.put("message", "Product not found");
            return response;
        }

        productRepository.deleteById(id);
        response.put("success", true);
        response.put("message", "Product deleted successfully");
        return response;
    }

    // ── STATS ───────────────────────────────────────────────────

    public Map<String, Object> getProductStats() {
        List<Product> all = productRepository.findAll();
        long total     = all.size();
        long inStock   = all.stream().filter(p -> p.getStock() > 0).count();
        long outStock  = all.stream().filter(p -> p.getStock() == 0).count();
        long lowStock  = all.stream().filter(p -> p.getStock() > 0 && p.getStock() <= 5).count();
        double value   = all.stream().mapToDouble(p -> p.getPrice() * p.getStock()).sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", total);
        stats.put("inStock", inStock);
        stats.put("outOfStock", outStock);
        stats.put("lowStock", lowStock);
        stats.put("totalInventoryValue", value);
        return stats;
    }
}
