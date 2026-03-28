package com.mobileshop.validation;

import com.mobileshop.dto.LoginRequest;
import com.mobileshop.dto.OrderRequest;
import com.mobileshop.dto.ProductRequest;
import com.mobileshop.dto.RegisterRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DtoValidationTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        factory.close();
    }

    @Test
    void registerRequest_shouldRejectWeakPassword() {
        RegisterRequest req = new RegisterRequest();
        req.setName("John Doe");
        req.setEmail("john@example.com");
        req.setPassword("weakpass");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(req);

        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("uppercase, lowercase, and a number")));
    }

    @Test
    void loginRequest_shouldRejectInvalidEmail() {
        LoginRequest req = new LoginRequest();
        req.setEmail("not-an-email");
        req.setPassword("Secret123");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(req);

        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Invalid email format")));
    }

    @Test
    void productRequest_shouldRejectNegativeDiscount() {
        ProductRequest req = new ProductRequest();
        req.setName("Phone");
        req.setPrice(1000.0);
        req.setStock(10);
        req.setDiscount(-1);

        Set<ConstraintViolation<ProductRequest>> violations = validator.validate(req);

        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Discount cannot be negative")));
    }

    @Test
    void orderRequest_shouldValidateNestedItemsAndPaymentMethod() {
        OrderRequest req = new OrderRequest();
        req.setUserId(1L);

        OrderRequest.OrderItemRequest badItem = new OrderRequest.OrderItemRequest();
        badItem.setProductId(5L);
        badItem.setQuantity(0);
        req.setItems(List.of(badItem));
        req.setPaymentMethod("UNKNOWN");

        Set<ConstraintViolation<OrderRequest>> violations = validator.validate(req);

        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Quantity must be at least 1")));
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Payment method must be")));
    }

    @Test
    void orderRequest_shouldPassForValidPayload() {
        OrderRequest req = new OrderRequest();
        req.setUserId(1L);

        OrderRequest.OrderItemRequest item = new OrderRequest.OrderItemRequest();
        item.setProductId(5L);
        item.setQuantity(2);

        req.setItems(List.of(item));
        req.setPaymentMethod("CASH_ON_DELIVERY");

        Set<ConstraintViolation<OrderRequest>> violations = validator.validate(req);

        assertFalse(violations.iterator().hasNext());
    }
}
