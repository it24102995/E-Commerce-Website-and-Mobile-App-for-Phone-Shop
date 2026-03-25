import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import './index.css';

function App() {
    const [cart, setCart] = useState([]);
    const [paymentInfo, setPaymentInfo] = useState(null);

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

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <Router>
            <Navbar cartCount={cart.length} />
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Product fetchCart={fetchCart} />} />
                        <Route path="/cart" element={<Cart cartItems={cart} fetchCart={fetchCart} />} />
                        <Route
                            path="/checkout"
                            element={
                                <Checkout
                                    cartItems={cart}
                                    setPaymentInfo={setPaymentInfo}
                                />
                            }
                        />
                        <Route
                            path="/invoice"
                            element={<Invoice cartItems={cart} paymentInfo={paymentInfo} />}
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;