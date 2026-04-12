import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Product from './pages/Product';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
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

    return (
        <Router>
            <Navbar cartCount={cart.length} />

            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Product fetchCart={fetchCart} />} />
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
                            />
                        }
                    />
                    <Route
                        path="/invoice"
                        element={<Invoice cartItems={selectedCheckoutItems.length > 0 ? selectedCheckoutItems : cart} paymentInfo={paymentInfo} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;