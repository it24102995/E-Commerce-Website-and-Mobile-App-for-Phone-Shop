package com.fooddelivery.controller;

import java.util.List;
import java.util.Optional;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.model.Inventory;
import com.fooddelivery.service.InventoryService;

@RestController
@RequestMapping("/api/admin/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<Inventory> createInventory(@Valid @RequestBody Inventory inventory) {
        try {
            Inventory createdInventory = inventoryService.createInventory(inventory);
            return new ResponseEntity<>(createdInventory, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventories() {
        try {
            List<Inventory> inventories = inventoryService.getAllInventories();
            return new ResponseEntity<>(inventories, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getInventoryById(@PathVariable String id) {
        Optional<Inventory> inventory = inventoryService.getInventoryById(id);
        if (inventory.isPresent()) {
            return new ResponseEntity<>(inventory.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/food-item/{foodItemId}")
    public ResponseEntity<Inventory> getInventoryByFoodItemId(@PathVariable String foodItemId) {
        Optional<Inventory> inventory = inventoryService.getInventoryByFoodItemId(foodItemId);
        if (inventory.isPresent()) {
            return new ResponseEntity<>(inventory.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventory(@PathVariable String id,
            @Valid @RequestBody Inventory inventory) {
        Inventory updatedInventory = inventoryService.updateInventory(id, inventory);
        if (updatedInventory != null) {
            return new ResponseEntity<>(updatedInventory, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{foodItemId}/reduce")
    public ResponseEntity<String> reduceInventory(@PathVariable String foodItemId,
            @RequestParam int quantity) {
        if (quantity <= 0) {
            return new ResponseEntity<>("Quantity must be greater than 0", HttpStatus.BAD_REQUEST);
        }
        boolean success = inventoryService.reduceInventory(foodItemId, quantity);
        if (success) {
            return new ResponseEntity<>("Inventory reduced successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Insufficient inventory or food item not found", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{foodItemId}/restock")
    public ResponseEntity<String> restockInventory(@PathVariable String foodItemId,
            @RequestParam int quantity) {
        if (quantity <= 0) {
            return new ResponseEntity<>("Quantity must be greater than 0", HttpStatus.BAD_REQUEST);
        }
        boolean success = inventoryService.restockInventory(foodItemId, quantity);
        if (success) {
            return new ResponseEntity<>("Inventory restocked successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Food item inventory not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/low-stock/items")
    public ResponseEntity<List<Inventory>> getLowStockItems() {
        try {
            List<Inventory> lowStockItems = inventoryService.getLowStockItems();
            return new ResponseEntity<>(lowStockItems, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{foodItemId}/is-low-stock")
    public ResponseEntity<Boolean> isLowStock(@PathVariable String foodItemId) {
        boolean isLow = inventoryService.isLowStock(foodItemId);
        return new ResponseEntity<>(isLow, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInventory(@PathVariable String id) {
        boolean success = inventoryService.deleteInventory(id);
        if (success) {
            return new ResponseEntity<>("Inventory deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Inventory not found", HttpStatus.NOT_FOUND);
        }
    }
}
