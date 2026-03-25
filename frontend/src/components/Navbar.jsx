import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ cartCount }) => {
    const navigate = useNavigate();
    return (
        <nav className="navbar">
            <div className="logo" onClick={() => navigate('/')}>HYUNDAI PREMEIR</div>
            <div className="nav-links">
                <span onClick={() => navigate('/')}>Home</span>
                <div className="cart-icon-wrapper" onClick={() => navigate('/cart')}>
                    <span className="cart-text">Cart ({cartCount})</span>
                    <span className="cart-emoji">🛒</span>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;