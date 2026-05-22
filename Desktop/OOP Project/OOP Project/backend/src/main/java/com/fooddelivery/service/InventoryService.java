package com.fooddelivery.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.model.Inventory;
import com.fooddelivery.repository.InventoryRepository;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public Inventory createInventory(Inventory inventory) {
        inventory.setCreatedAt(Instant.now());
        inventory.setLastUpdated(Instant.now());
        inventory.setAvailableQuantity(inventory.getTotalQuantity());
        inventory.setReservedQuantity(0);
        return inventoryRepository.save(inventory);
    }

    public Optional<Inventory> getInventoryByFoodItemId(String foodItemId) {
        return inventoryRepository.findByFoodItemId(foodItemId);
    }

    public Inventory updateInventory(String inventoryId, Inventory inventoryDetails) {
        Optional<Inventory> inventory = inventoryRepository.findById(inventoryId);
        if (inventory.isPresent()) {
            Inventory inv = inventory.get();
            if (inventoryDetails.getTotalQuantity() > 0) {
                inv.setTotalQuantity(inventoryDetails.getTotalQuantity());
            }
            if (inventoryDetails.getReorderLevel() > 0) {
                inv.setReorderLevel(inventoryDetails.getReorderLevel());
            }
            if (inventoryDetails.getReorderQuantity() > 0) {
                inv.setReorderQuantity(inventoryDetails.getReorderQuantity());
            }
            if (inventoryDetails.getLocation() != null) {
                inv.setLocation(inventoryDetails.getLocation());
            }
            if (inventoryDetails.getExpiryDate() != null) {
                inv.setExpiryDate(inventoryDetails.getExpiryDate());
            }
            inv.setLastUpdated(Instant.now());
            return inventoryRepository.save(inv);
        }
        return null;
    }

    public boolean reduceInventory(String foodItemId, int quantity) {
        Optional<Inventory> inventory = inventoryRepository.findByFoodItemId(foodItemId);
        if (inventory.isPresent()) {
            Inventory inv = inventory.get();
            if (inv.getAvailableQuantity() >= quantity) {
                inv.setAvailableQuantity(inv.getAvailableQuantity() - quantity);
                inv.setReservedQuantity(inv.getReservedQuantity() + quantity);
                inv.setLastUpdated(Instant.now());
                inventoryRepository.save(inv);
                return true;
            }
        }
        return false;
    }

    public boolean restockInventory(String foodItemId, int quantity) {
        Optional<Inventory> inventory = inventoryRepository.findByFoodItemId(foodItemId);
        if (inventory.isPresent()) {
            Inventory inv = inventory.get();
            inv.setTotalQuantity(inv.getTotalQuantity() + quantity);
            inv.setAvailableQuantity(inv.getAvailableQuantity() + quantity);
            inv.setLastUpdated(Instant.now());
            inventoryRepository.save(inv);
            return true;
        }
        return false;
    }

    public List<Inventory> getAllInventories() {
        return inventoryRepository.findAll();
    }

    public Optional<Inventory> getInventoryById(String inventoryId) {
        return inventoryRepository.findById(inventoryId);
    }

    public boolean deleteInventory(String inventoryId) {
        if (inventoryRepository.existsById(inventoryId)) {
            inventoryRepository.deleteById(inventoryId);
            return true;
        }
        return false;
    }

    public boolean isLowStock(String foodItemId) {
        Optional<Inventory> inventory = inventoryRepository.findByFoodItemId(foodItemId);
        if (inventory.isPresent()) {
            Inventory inv = inventory.get();
            return inv.getAvailableQuantity() <= inv.getReorderLevel();
        }
        return false;
    }

    public List<Inventory> getLowStockItems() {
        List<Inventory> allInventories = inventoryRepository.findAll();
        return allInventories.stream()
                .filter(inv -> inv.getAvailableQuantity() <= inv.getReorderLevel())
                .toList();
    }
}
