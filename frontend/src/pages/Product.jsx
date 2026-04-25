import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Product.css';
import products from '../data/products';

const Product = ({ fetchCart }) => {
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage('');
        }, 2000);
    };

    const addToCart = async (product) => {
        try {
            const res = await fetch('http://localhost:8081/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: product.name,
                    price: product.price,
                    img: product.images[0],
                    quantity: 1
                })
            });

            if (!res.ok) {
                throw new Error('Failed to add item');
            }

            await fetchCart();
            showToast('Successfully added to cart');

            setTimeout(() => {
                navigate('/cart');
            }, 1200);
        } catch (error) {
            console.error('Add to cart error:', error);
            alert('Failed to add item to cart');
        }
    };

    const buyNow = async (product) => {
        const confirmed = window.confirm(`Do you want to buy ${product.name} now?`);
        if (!confirmed) return;

        try {
            const res = await fetch('http://localhost:8081/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: product.name,
                    price: product.price,
                    img: product.images[0],
                    quantity: 1
                })
            });

            if (!res.ok) {
                throw new Error('Failed to proceed with Buy Now');
            }

            await fetchCart();
            navigate('/checkout');
        } catch (error) {
            console.error('Buy now error:', error);
            alert('Failed to continue to checkout');
        }
    };

    return (
        <div className="product-page">
            {toastMessage && <div className="toast-message">{toastMessage}</div>}

            <header className="shop-header">
                <h2>Exquisite Collection</h2>
                <p>Experience luxury in every touch</p>
            </header>

            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.id} className="luxury-card">
                        <div
                            className="img-container clickable-image"
                            onClick={() => navigate(`/product/${product.slug}`)}
                        >
                            <img src={product.images[0]} alt={product.name} />
                        </div>

                        <h3 onClick={() => navigate(`/product/${product.slug}`)} className="product-title-link">
                            {product.name}
                        </h3>

                        <p className="price">Rs. {product.price.toLocaleString()}</p>
                        <span className="stock-tag">{product.stock}</span>

                        <div className="product-btn-group">
                            <button
                                className="gold-btn"
                                onClick={() => addToCart(product)}
                            >
                                Add to Cart
                            </button>

                            <button
                                className="buy-now-btn"
                                onClick={() => buyNow(product)}
                            >
                                Buy Now
                            </button>

                            <button
                                className="details-btn"
                                onClick={() => navigate(`/product/${product.slug}`)}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Product;
