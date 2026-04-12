# Frontend-Backend Connection Testing Guide

## Test 1: Check Backend is Running
Open browser and visit:
```
http://localhost:8081/api/cart
```
**Expected Response**: Empty JSON array `[]` (database is empty on first run)

---

## Test 2: Add Item to Cart (API Test)
Run this command in PowerShell:
```powershell
$body = @{
    name = "iPhone 15 Pro"
    price = 999.99
    img = "phone1.jpg"
    quantity = 1
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/cart" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$response | ConvertTo-Json
```

**Expected Response**: JSON object with id, name, price, img, quantity

---

## Test 3: Get All Cart Items
Open browser and visit:
```
http://localhost:8081/api/cart
```
**Expected Response**: JSON array containing the item you just added

---

## Test 4: Delete Cart Item
Run this command (replace {id} with actual item ID from previous response):
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/cart/{id}" `
    -Method DELETE
```

**Expected Response**: No error, item removed from cart

---

## Test 5: Frontend UI Test
1. Open `http://localhost:5173` in your browser
2. **Check Browser Console** for errors (F12)
3. Try adding a product to cart
4. Go to cart page and verify the item appears
5. Try deleting the item

**Expected**: No CORS errors, items appear/disappear from cart

---

## Test 6: Checkout & Payment API
1. Add items to cart
2. Go to Checkout
3. Fill in payment form:
   - Full Name: Test User
   - Email: test@example.com
   - Address: 123 Main St
   - Card: 1234567890123456
   - Expiry: 12/25
   - CVV: 123
4. Click "Confirm Payment"

**Expected Responses**:
- Payment status: "PAID"
- Redirects to Invoice page
- Cart is cleared after successful payment

---

## Test 7: Check Database
Connect to MySQL:
```bash
mysql -u root -p
USE hyundai_shop;
SELECT * FROM payments;
SELECT * FROM cart_items;
```

**Expected**: Should see your payment record and cart items tables created automatically

---

## Troubleshooting

### CORS Error in Browser Console
**Error**: `Access to XMLHttpRequest blocked by CORS policy`
**Solution**: Backend CORS is already configured at `http://localhost:5173`

### Cannot Connect to Backend
**Check**:
- Backend running on port 8081? `http://localhost:8081`
- MySQL service running?
- Firewall not blocking port 8081?

### Database Connection Failed
**Check**:
- MySQL running and `hyundai_shop` database exists
- Credentials in `application.properties` are correct
- Port 3306 is accessible

### Frontend Shows Blank Page
**Check**:
- Node modules installed? Run `npm install`
- Check browser console (F12) for JavaScript errors
- Vite dev server running on port 5173?

