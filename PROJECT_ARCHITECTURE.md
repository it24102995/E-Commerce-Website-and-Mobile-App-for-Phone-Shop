# Project Architecture & Connection Map

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│                   http://localhost:5173                     │
│                                                             │
│  ┌──────────┐  ┌────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Product │  │  Cart  │  │ Checkout │  │ Invoice  │     │
│  └──────────┘  └────────┘  └──────────┘  └──────────┘     │
└────────────────────────────────────────────────────────────┘
                           │
                   (HTTP Fetch Requests)
                           │
        ┌─────────────────────────────────────┐
        │   CORS Configuration (Port 5173)    │
        │   SecurityConfig.java + Allowed     │
        └─────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│             Backend (Spring Boot 3.4.5)                     │
│           http://localhost:8081/api                         │
│                                                             │
│  Controllers:                                               │
│  ├── CartController      (/api/cart)                        │
│  │   ├── POST   - Add item to cart                          │
│  │   ├── GET    - Get all cart items                        │
│  │   └── DELETE - Delete item from cart                     │
│  │                                                          │
│  └── PaymentController   (/api/payment)                     │
│      └── POST /pay - Process payment                        │
│                                                             │
│  Services:                                                  │
│  ├── CartService                                            │
│  ├── PaymentService                                         │
│  └── PaymentServiceImpl                                      │
│                                                             │
│  Models:                                                    │
│  ├── CartItem (JPA Entity)                                  │
│  └── Payment (JPA Entity)                                   │
└─────────────────────────────────────────────────────────────┘
                           │
              (JDBC/JPA - Hibernate ORM)
                           │
┌─────────────────────────────────────────────────────────────┐
│              MySQL Database                                 │
│         hyundai_shop (localhost:3306)                       │
│                                                             │
│  Tables:                                                    │
│  ├── cart_items                                             │
│  │   ├── id (Long PK)                                       │
│  │   ├── name (String)                                      │
│  │   ├── price (double)                                     │
│  │   ├── img (String)                                       │
│  │   └── quantity (int)                                     │
│  │                                                          │
│  └── payments                                               │
│      ├── id (Long PK)                                       │
│      ├── full_name (String)                                 │
│      ├── email (String)                                     │
│      ├── address (String)                                   │
│      ├── card_number (String)                               │
│      ├── expiry (String)                                    │
│      ├── cvv (String)                                       │
│      ├── status (String) - "PAID", "FAILED"                 │
│      ├── amount (double)                                    │
│      └── payment_date (LocalDateTime)                       │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints Summary

### Cart Management
| Method | Endpoint | Purpose | Frontend Call |
|--------|----------|---------|---------------|
| GET | `/api/cart` | Fetch all cart items | App.jsx - fetchCart() |
| POST | `/api/cart` | Add item to cart | Product.jsx - addToCart() |
| DELETE | `/api/cart/{id}` | Remove item from cart | Cart.jsx - deleteItem() |

### Payment Processing
| Method | Endpoint | Purpose | Frontend Call |
|--------|----------|---------|---------------|
| POST | `/api/payment/pay` | Process payment | Checkout.jsx - handleSubmit() |

## Frontend Component Flow

```
Main (http://localhost:5173)
│
├── App.jsx (Main Router)
│   ├── fetchCart() - Gets cart items from backend
│   └── Routes:
│       ├── /        → Product.jsx
│       ├── /cart    → Cart.jsx  
│       └── /invoice → Invoice.jsx
│
├── Product.jsx
│   └── addToCart() → POST /api/cart
│
├── Cart.jsx
│   ├── deleteItem() → DELETE /api/cart/{id}
│   └── checkout() → navigate to Checkout
│
├── Checkout.jsx
│   └── handleSubmit() → POST /api/payment/pay
│
└── Invoice.jsx
    └── Displays after successful payment
```

## Key Configuration Files

### Backend
- **Port**: 8081 (server.port)
- **Database**: hyundai_shop
- **Credentials**: root / Lionel&2324
- **CORS**: Enabled for http://localhost:5173

### Frontend  
- **Port**: 5173 (default Vite)
- **Backend URL**: http://localhost:8081
- **Build Tool**: Vite
- **Framework**: React 19.2.0

## Security Configuration

The SecurityConfig.java includes:
- ✓ CSRF disabled (REST API)
- ✓ CORS enabled with CorsConfigurationSource bean
- ✓ All /api/** endpoints permit all access
- ✓ Cross-origin requests from http://localhost:5173 allowed

