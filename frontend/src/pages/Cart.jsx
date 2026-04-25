import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({
    cartItems,
    favoriteIds,
    toggleFavorite,
    updateQuantity,
    removeItem,
    setSelectedCheckoutItems
}) => {
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState([]);
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage('');
        }, 1800);
    };

    const handleToggleFavorite = (id) => {
        const alreadyFavorite = favoriteIds.includes(id);
        toggleFavorite(id);

        if (!alreadyFavorite) {
            showToast('You added this to favourite');
        }
    };

    const toggleSelectItem = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((itemId) => itemId !== id)
                : [...prev, id]
        );
    };

    const selectedItems = cartItems.filter((item) => selectedIds.includes(item.id));

    const subtotal = selectedItems.reduce(
        (acc, item) => acc + (item.price * item.quantity),
        0
    );

    const deliveryFee = 0;
    const grandTotal = subtotal + deliveryFee;

    const handleCheckoutSelected = () => {
        if (selectedItems.length === 0) {
            alert('Please select at least one item');
            return;
        }

        setSelectedCheckoutItems(selectedItems);
        navigate('/checkout');
    };

    return (
        <div className="cart-layout">
            {toastMessage && <div className="toast-message">{toastMessage}</div>}

            <div className="cart-items-section">
                <h2 className="section-title">Your Cart</h2>

                {cartItems.length > 0 ? (
                    <>
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item-card">
                                <div className="select-box">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => toggleSelectItem(item.id)}
                                    />
                                </div>

                                <img src={item.image} alt={item.name} />

                                <div className="cart-item-info">
                                    <div className="cart-item-top">
                                        <h4>{item.name}</h4>

                                        <button
                                            className={`favorite-btn ${favoriteIds.includes(item.id) ? 'active' : ''}`}
                                            onClick={() => handleToggleFavorite(item.id)}
                                        >
                                            ♥
                                        </button>
                                    </div>

                                    <p className="item-price">Rs. {item.price.toLocaleString()}</p>

                                    <div className="quantity-row">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item, item.quantity - 1)}
                                        >
                                            -
                                        </button>

                                        <span className="qty-value">{item.quantity}</span>

                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    className="delete-btn"
                                    onClick={() => removeItem(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <div className="cart-actions-row">
                            <button className="continue-btn" onClick={() => window.location.href = 'index.html#products'}>
                                Continue Shopping
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="empty-cart-msg">
                        <p>Your cart is empty.</p>
                        <button className="gold-btn" onClick={() => window.location.href = 'index.html#products'}>
                            Return to Shop
                        </button>
                    </div>
                )}
            </div>

            <div className="summary-card">
                <h3>Selected Items Summary</h3>

                <div className="summary-row">
                    <span>Selected Items</span>
                    <span>{selectedItems.length}</span>
                </div>

                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                    <span>Delivery</span>
                    <span>Rs. {deliveryFee.toLocaleString()}</span>
                </div>

                <div className="summary-row grand-total">
                    <span>Total</span>
                    <span>Rs. {grandTotal.toLocaleString()}</span>
                </div>

                <button
                    className="checkout-btn"
                    onClick={handleCheckoutSelected}
                    disabled={selectedItems.length === 0}
                >
                    BUY NOW SELECTED
                </button>
            </div>
        </div>
    );
};

export default Cart;
