import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Product.css';
import iphoneImg from '../assets/iPhone-15-Pro.jpg';
import samsungImg from '../assets/S24Ultra.jpg';

const Product = ({ fetchCart }) => {
    const navigate = useNavigate();

    const phones = [
        {
            name: "iPhone 15 Pro",
            price: 350000,
            img: iphoneImg,
            stock: "In Stock"
        },
        {
            name: "Samsung S24 Ultra",
            price: 420000,
            img: samsungImg,
            stock: "In Stock"
        }
    ];

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
                    img: product.img,
                    quantity: 1
                })
            });

            if (!res.ok) {
                throw new Error('Failed to add item');
            }

            await fetchCart();
            navigate('/cart');
        } catch (error) {
            console.error('Add to cart error:', error);
            alert('Failed to add item to cart');
        }
    };

    return (
        <div className="product-page">
            <header className="shop-header">
                <h2>Exquisite Collection</h2>
                <p>Experience luxury in every touch</p>
            </header>

            <div className="product-grid">
                {phones.map((p, index) => (
                    <div key={index} className="luxury-card">
                        <div className="img-container">
                            <img src={p.img} alt={p.name} />
                        </div>
                        <h3>{p.name}</h3>
                        <p className="price">Rs. {p.price.toLocaleString()}</p>
                        <span className="stock-tag">{p.stock}</span>
                        <button className="gold-btn" onClick={() => addToCart(p)}>
                            ADD TO CART
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Product;