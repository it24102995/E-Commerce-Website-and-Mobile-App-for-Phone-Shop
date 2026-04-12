import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductDetails.css';
import products from '../data/products';

const ProductDetails = ({ fetchCart }) => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [toastMessage, setToastMessage] = useState('');

    const product = products.find((item) => item.slug === slug);

    const [selectedImage, setSelectedImage] = useState(product ? product.images[0] : '');

    if (!product) {
        return (
            <div className="product-not-found">
                <h2>Product not found</h2>
                <button onClick={() => navigate('/')}>Go Back Home</button>
            </div>
        );
    }

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage('');
        }, 2000);
    };

    const addToCart = async () => {
        try {
            const res = await fetch('http://localhost:8081/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: product.name,
                    price: product.price,
                    img: selectedImage,
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

    const buyNow = async () => {
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
                    img: selectedImage,
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
        <div className="product-details-page">
            {toastMessage && <div className="toast-message">{toastMessage}</div>}

            <div className="product-details-layout">
                <div className="product-gallery">
                    <div className="main-product-image-box">
                        <img src={selectedImage} alt={product.name} className="main-product-image" />
                    </div>

                    <div className="thumbnail-row">
                        {product.images.map((img, index) => (
                            <div
                                key={index}
                                className={`thumbnail-box ${selectedImage === img ? 'active-thumb' : ''}`}
                                onClick={() => setSelectedImage(img)}
                            >
                                <img src={img} alt={`thumbnail-${index}`} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="product-main-info">
                    <span className="brand-badge">Brand+</span>

                    <h1 className="product-detail-title">{product.name}</h1>

                    <div className="product-rating-row">
                        <span className="stars">★★★★★</span>
                        <span>{product.rating}</span>
                        <span>{product.reviews} Reviews</span>
                        <span>{product.sold} sold</span>
                    </div>

                    <div className="product-price-row">
                        <span className="current-price">LKR {product.price.toLocaleString()}.00</span>
                        <span className="discount-text">
                            {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% off
                        </span>
                        <span className="old-price">LKR {product.oldPrice.toLocaleString()}.00</span>
                    </div>

                    <p className="tax-note">Tax excluded, add at checkout if applicable</p>

                    <p className="product-description">{product.description}</p>

                    <div className="variant-section">
                        <h3>Color: {product.variant}</h3>
                        <div className="variant-row">
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`variant-card ${selectedImage === img ? 'active-variant' : ''}`}
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img src={img} alt={`variant-${index}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="product-side-panel">
                    <div className="sold-by-box">
                        <span className="side-label">Sold By</span>
                        <span className="seller-name">Hyundai Premier Store</span>
                    </div>

                    <div className="feature-box">
                        <div className="feature-item">🚚 Free shipping</div>
                        <div className="feature-item">✅ Certified Original</div>
                        <div className="feature-item">↩ Return & refund policy</div>
                        <div className="feature-item">🔒 Security & Privacy</div>
                    </div>

                    <button className="detail-buy-btn" onClick={buyNow}>
                        Buy now
                    </button>

                    <button className="detail-cart-btn" onClick={addToCart}>
                        Add to cart
                    </button>

                    <div className="share-row">
                        <button className="share-btn">Share</button>
                        <button className="wishlist-btn">♡ 606</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;