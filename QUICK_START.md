# Quick Start: Running Your E-Commerce Project

## 📋 Table of Contents
1. Prerequisites
2. Database Setup
3. Running the Backend
4. Running the Frontend
5. Verifying Connection
6. Troubleshooting

---

## ✅ Prerequisites

Make sure you have installed:
- **Java 17** (for backend)
- **Node.js & npm** (for frontend)
- **MySQL Server** (for database)

Verify installations:
```powershell
java -version
node --version
npm --version
mysql --version
```

---

## 🗄️ Database Setup

### 1. Start MySQL Server
Ensure MySQL is running. On Windows with MySQL installed:
```powershell
# Check if MySQL service is running
Get-Service MySQL* | Select Name, Status

# If not running, start it
Start-Service MySQL80
# (or MySQL57, depending on your version)
```

### 2. Create Database
Connect to MySQL and create the database:
```powershell
mysql -u root -p
# Enter password: Lionel&2324

# Then execute:
CREATE DATABASE IF NOT EXISTS hyundai_shop;
EXIT;
```

Or use this one-liner:
```powershell
mysql -u root -pLionel&2324 -e "CREATE DATABASE IF NOT EXISTS hyundai_shop;"
```

---

## ▶️ Running the Backend (Spring Boot)

### Option A: Direct Maven Command
```powershell
cd c:\Users\user\Documents\GitHub\E-Commerce-Website-and-Mobile-App-for-Phone-Shop
mvn spring-boot:run
```

### Option B: Using VS Code
1. Open the project in VS Code
2. In the terminal, type:
   ```powershell
   mvn spring-boot:run
   ```

### Option C: Debug Mode (already running)
The backend is currently running in debug mode (port 8081)

**Backend is ready when you see:**
```
Started ECommerceApplication in X.XXX seconds
Server is running on port: 8081
```

✓ Verify: Visit `http://localhost:8081/api/cart` (should return `[]`)

---

## 🚀 Running the Frontend (React + Vite)

### Step 1: Install Dependencies
```powershell
cd c:\Users\user\Documents\GitHub\E-Commerce-Website-and-Mobile-App-for-Phone-Shop\frontend
npm install
```

### Step 2: Start Development Server
```powershell
npm run dev
```

**Frontend is ready when you see:**
```
VITE v7.3.1 ready in XXX ms

➜  Local:   http://localhost:5173/
```

✓ Visit: `http://localhost:5173` in your browser

---

## 🔗 Verifying Frontend-Backend Connection

### Test 1: Check Both Services Running
- Backend: `http://localhost:8081/api/cart` → Returns `[]`
- Frontend: `http://localhost:5173` → React app loads

### Test 2: Add Item to Cart (From Frontend UI)
1. Open `http://localhost:5173`
2. Click "Add to Cart" on any product
3. Go to Cart page
4. Verify item appears with correct details

### Test 3: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Should see no CORS errors
4. Verify API calls in Network tab show 200 status

### Test 4: Test Checkout Flow
1. Add items to cart
2. Go to Cart → Checkout
3. Fill payment form
4. Submit
5. Should redirect to Invoice page

### Test 5: Verify Database
```powershell
mysql -u root -pLionel&2324 -e "USE hyundai_shop; SELECT * FROM cart_items; SELECT * FROM payments;"
```

---

## 🎯 Complete API Test with PowerShell

### Test Cart Endpoints

**1. Get all cart items:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/cart" -Method GET
```

**2. Add item to cart:**
```powershell
$body = @{
    name = "iPhone 15 Pro"
    price = 999.99
    img = "phone.jpg"
    quantity = 2
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8081/api/cart" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

**3. Delete item from cart (replace {id} with actual ID):**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/cart/1" -Method DELETE
```

**4. Test Payment Endpoint:**
```powershell
$payment = @{
    fullName = "John Doe"
    email = "john@example.com"
    address = "123 Main Street"
    cardNumber = "1234567890123456"
    expiry = "12/25"
    cvv = "123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8081/api/payment/pay" `
    -Method POST `
    -Body $payment `
    -ContentType "application/json"
```

---

## 🐛 Troubleshooting

### Frontend Won't Load
**Problem**: Blank page or "Cannot GET /"
**Solution**:
```powershell
cd frontend
npm install  # Reinstall dependencies
npm run dev  # Start dev server
```

### CORS Error in Browser Console
**Error**: `Access to XMLHttpRequest blocked by CORS policy`
**Status**: ✓ Already fixed - SecurityConfig.java has CORS bean configured

### Backend Port Already in Use
**Error**: `Address already in use: bind`
**Solution**:
```powershell
# Find process using port 8081
Get-NetTCPConnection -LocalPort 8081

# Kill the process (if needed)
Stop-Process -Id {PID} -Force

# Then restart backend
mvn spring-boot:run
```

### Cannot Connect to MySQL
**Error**: `Communications link failure`
**Checklist**:
- [ ] MySQL service is running: `Get-Service MySQL*`
- [ ] Correct password in `application.properties`
- [ ] Database exists: `mysql -u root -pLionel&2324 -e "SHOW DATABASES;"`
- [ ] Port 3306 is accessible

### Frontend Not Connecting to Backend
**Check**:
1. Backend running on port 8081?
2. No typos in API URLs (should be `http://localhost:8081`)
3. Browser console for CORS errors
4. Network tab to see API requests

---

## 📦 Project Structure

```
E-Commerce-Website-and-Mobile-App-for-Phone-Shop/
├── pom.xml                          # Maven configuration
├── src/main/java/...               # Backend code
│   └── com/ECommerce/ECommerce/
│       ├── controller/              # REST endpoints
│       ├── service/                 # Business logic
│       ├── model/                   # JPA entities
│       └── config/                  # Security & configuration
├── src/main/resources/
│   └── application.properties       # Backend config
├── frontend/                        # React Vite app
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx                 # Main component
│       └── pages/                  # React pages
├── TESTING_GUIDE.md                 # Testing instructions
└── PROJECT_ARCHITECTURE.md          # System design
```

---

## 🔑 Key Ports

- **Backend**: `http://localhost:8081`
- **Frontend**: `http://localhost:5173`
- **MySQL**: `localhost:3306`
- **Database**: `hyundai_shop`

---

## ✨ Project Features

- ✓ Add products to cart
- ✓ View cart items
- ✓ Delete items from cart
- ✓ Secure checkout with payment form
- ✓ Process payments
- ✓ Generate invoices
- ✓ CORS enabled for cross-origin requests
- ✓ MySQL data persistence

---

## 📞 Need Help?

1. Check `TESTING_GUIDE.md` for detailed testing steps
2. Review `PROJECT_ARCHITECTURE.md` for system design
3. Check browser console (F12) for errors
4. Check backend console for Java exceptions
5. Verify MySQL is running: `Get-Service MySQL*`

---

**Status**: ✅ Application Ready to Run

Last Updated: March 21, 2026

