# Mobile Shop Validation Report

## Scope Covered
- Backend DTO validation annotations
- Controller request/parameter validation
- Global validation exception handling
- Frontend form validation (register + payment flow)
- Automated validation tests

## Validation Rules Implemented

### 1. User Registration Validation
File: `src/main/java/com/mobileshop/dto/RegisterRequest.java`
- `name`
- Required: `@NotBlank`
- Length: `@Size(min = 2, max = 100)`
- `email`
- Required: `@NotBlank`
- Format: `@Email`
- `password`
- Required: `@NotBlank`
- Length: `@Size(min = 8)`
- Complexity: `@Pattern` requiring uppercase + lowercase + number

### 2. User Login Validation
File: `src/main/java/com/mobileshop/dto/LoginRequest.java`
- `email`
- Required: `@NotBlank`
- Format: `@Email`
- `password`
- Required: `@NotBlank`

### 3. Admin Login Validation
File: `src/main/java/com/mobileshop/dto/AdminLoginRequest.java`
- `username`
- Required: `@NotBlank`
- `password`
- Required: `@NotBlank`

### 4. Product Validation
File: `src/main/java/com/mobileshop/dto/ProductRequest.java`
- `name`
- Required: `@NotBlank`
- `price`
- Required: `@NotNull`
- Positive value: `@Positive`
- `stock`
- Required: `@NotNull`
- Minimum: `@Min(0)`
- `discount`
- Minimum: `@Min(0)`
- Maximum: `@Max(100)`

### 5. Order Validation
File: `src/main/java/com/mobileshop/dto/OrderRequest.java`
- `userId`
- Required: `@NotNull`
- `items`
- Required and non-empty: `@NotEmpty`
- Nested validation enabled: `@Valid`
- `paymentMethod`
- Required: `@NotBlank`
- Allowed values only: `CREDIT_CARD|DEBIT_CARD|CASH_ON_DELIVERY|BANK_TRANSFER` via `@Pattern`

Nested item validation (`OrderItemRequest`):
- `productId`
- Required: `@NotNull`
- `quantity`
- Required: `@NotNull`
- Minimum: `@Min(1)`

### 6. Controller Parameter Validation
File: `src/main/java/com/mobileshop/controller/OrderController.java`
- Added `@Validated` at controller level
- `GET /orders?userId=...`
- `userId` validated with `@Min(1)` when provided
- `PATCH /order/{id}/payment?status=...`
- `status` validated with `@NotBlank` + `@Pattern`
- Status normalized to uppercase before service call

### 7. Global Validation Error Handling
File: `src/main/java/com/mobileshop/config/GlobalExceptionHandler.java`
- Handles `MethodArgumentNotValidException` (JSON body bean validation)
- Added handler for `ConstraintViolationException` (query/path param validation)
- Returns `400 Bad Request` with:
- `success: false`
- `message: <validation message>`

### 8. Frontend Validation Alignment
File: `src/main/resources/static/js/app.js`
- Register form now enforces:
- Password min length 8
- Uppercase + lowercase + number
- Updated password strength baseline from 6 to 8 chars

## Issues Found and Fixed
- Missing nested order-item validation cascade
- Fixed by adding `@Valid` on `OrderRequest.items`
- Missing validation for payment method value
- Fixed with `@NotBlank` + allowed-value `@Pattern`
- Missing parameter validation response handling
- Fixed by adding `ConstraintViolationException` handler
- Registration password policy too weak and inconsistent with robust validation
- Fixed backend DTO rule + frontend validation alignment

## Automated Tests Added

### A. DTO Validation Tests
File: `src/test/java/com/mobileshop/validation/DtoValidationTest.java`
- `registerRequest_shouldRejectWeakPassword`
- `loginRequest_shouldRejectInvalidEmail`
- `productRequest_shouldRejectNegativeDiscount`
- `orderRequest_shouldValidateNestedItemsAndPaymentMethod`
- `orderRequest_shouldPassForValidPayload`

### B. Controller Validation Tests
File: `src/test/java/com/mobileshop/validation/OrderControllerValidationTest.java`
- `placeOrder_shouldFailWhenItemQuantityInvalid`
- `placeOrder_shouldFailWhenPaymentMethodMissing`
- `getOrders_shouldFailWhenUserIdIsZero`
- `updatePayment_shouldFailForInvalidStatus`

## Full Test Execution
Command used:
- `mvn test`

Environment note:
- Maven must run with Java 21 (`JAVA_HOME` set to JDK 21).

Result:
- `BUILD SUCCESS`
- Tests run: `9`
- Failures: `0`
- Errors: `0`
- Skipped: `0`

## Current Validation Status
All covered backend and frontend validation paths are passing with automated test verification for DTO and controller-level validation behavior.
