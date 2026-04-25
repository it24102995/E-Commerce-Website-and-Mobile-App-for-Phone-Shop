import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import PaymentHistory from './pages/PaymentHistory';
import AdminSidebar from './components/AdminSidebar';
import DeliverLogin from './pages/DeliverLogin';
import DeliverSignup from './pages/DeliverSignup';
import DeliverDashboard from './pages/DeliverDashboard';
import RiderView from './pages/RiderView';
import CustomerTrackingView from './pages/CustomerTrackingView';
import CustomerOrders from './pages/CustomerOrders';
import './index.css';

function App() {
    const [cart, setCart] = useState([]);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [selectedCheckoutItems, setSelectedCheckoutItems] = useState([]);

    const fetchCart = async () => {
        try {
            const res = await fetch('http://localhost:8081/api/cart');
            if (!res.ok) throw new Error('Failed to fetch cart');
            const data = await res.json();
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const toggleFavorite = (id) => {
        setFavoriteIds((prev) =>
            prev.includes(id)
                ? prev.filter((itemId) => itemId !== id)
                : [...prev, id]
        );
    };

    const updateQuantity = async (item, newQuantity) => {
        if (newQuantity <= 0) {
            await removeItem(item.id);
            return;
        }

        try {
            const res = await fetch(`http://localhost:8081/api/cart/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...item,
                    quantity: newQuantity
                })
            });

            if (!res.ok) throw new Error('Failed to update quantity');
            await fetchCart();
        } catch (error) {
            console.error('Update quantity error:', error);
            alert('Failed to update quantity');
        }
    };

    const removeItem = async (id) => {
        try {
            const res = await fetch(`http://localhost:8081/api/cart/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete item');
            await fetchCart();
        } catch (error) {
            console.error('Remove item error:', error);
            alert('Failed to remove item');
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const isPaymentHistory = window.location.hash.includes('/payment-history');

    return (
        <Router>
            {!isPaymentHistory && <Navbar cartCount={cart.length} />}

            <div className={isPaymentHistory ? "admin-app-container" : "app-container"}>
                {isPaymentHistory && <AdminSidebar activePage="payments" />}
                <Routes>
                    <Route path="/" element={<Navigate to="/shop.html" replace />} />
                    <Route path="/product/:slug" element={<ProductDetails fetchCart={fetchCart} />} />
                    <Route
                        path="/cart"
                        element={
                            <Cart
                                cartItems={cart}
                                fetchCart={fetchCart}
                                favoriteIds={favoriteIds}
                                toggleFavorite={toggleFavorite}
                                updateQuantity={updateQuantity}
                                removeItem={removeItem}
                                setSelectedCheckoutItems={setSelectedCheckoutItems}
                            />
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <Checkout
                                cartItems={selectedCheckoutItems.length > 0 ? selectedCheckoutItems : cart}
                                setPaymentInfo={setPaymentInfo}
                                fetchCart={fetchCart}
                            />
                        }
                    />
                    <Route
                        path="/invoice"
                        element={<Invoice cartItems={selectedCheckoutItems.length > 0 ? selectedCheckoutItems : cart} paymentInfo={paymentInfo} />}
                    />
                    <Route path="/payment-history" element={<PaymentHistory />} />
                    <Route path="/deliver-login" element={<DeliverLogin />} />
                    <Route path="/deliver-signup" element={<DeliverSignup />} />
                    <Route path="/deliver-dashboard" element={<DeliverDashboard />} />
                    <Route path="/rider-view/:orderId" element={<RiderView />} />
                    <Route path="/track-order/:orderId" element={<CustomerTrackingView />} />
                    <Route path="/my-orders" element={<CustomerOrders />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
