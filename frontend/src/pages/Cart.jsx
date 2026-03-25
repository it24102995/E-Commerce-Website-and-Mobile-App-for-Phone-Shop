import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ cartItems, fetchCart }) => {
    const navigate = useNavigate();

    const removeItem = async (id) => {
        try {
            const res = await fetch(`http://localhost:8081/api/cart/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error('Failed to delete item');
            }

            await fetchCart();
        } catch (error) {
            console.error('Remove item error:', error);
            alert('Failed to remove item');
        }
    };

    const subtotal = cartItems.reduce(
        (acc, item) => acc + (item.price * item.quantity),
        0
    );

    return (
        <div className="cart-layout">
            <div className="cart-items-section">
                <h2 className="section-title">Your Selection</h2>

                {cartItems.length > 0 ? (
                    cartItems.map(item => (
                        <div key={item.id} className="cart-item-card">
                            <img src={item.img} alt={item.name} />
                            <div className="cart-item-info">
                                <h4>{item.name}</h4>
                                <p>Rs. {item.price.toLocaleString()}</p>
                                <p>Qty: {item.quantity}</p>
                            </div>
                            <button
                                className="remove-btn"
                                onClick={() => removeItem(item.id)}
                            >
                                ✕
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="empty-cart-msg">
                        <p>Your selection is empty.</p>
                        <button className="gold-btn" onClick={() => navigate('/')}>
                            Return to Shop
                        </button>
                    </div>
                )}
            </div>

            <div className="summary-card">
                <h3>Order Summary</h3>
                <div className="summary-row">
                    <span>Items</span>
                    <span>{cartItems.length}</span>
                </div>
                <div className="summary-row grand-total">
                    <span>Total</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <button
                    className="checkout-btn"
                    onClick={() => navigate('/checkout')}
                    disabled={cartItems.length === 0}
                >
                    PROCEED TO CHECKOUT
                </button>
            </div>
        </div>
    );
};

export default Cart;