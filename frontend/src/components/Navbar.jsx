import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.jpeg';

const Navbar = ({ cartCount }) => {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-left" onClick={() => navigate('/')}>
                <img src={logo} alt="Logo" className="navbar-logo" />
                <div className="brand-text">
                    <span className="brand-main">HYUNDAI PREMIER</span>
                    <span className="brand-sub">where premium meets technology</span>
                </div>
            </div>

            <div className="nav-links">
                <span onClick={() => navigate('/')}>Home</span>

                <div className="cart-icon-wrapper" onClick={() => navigate('/cart')}>
                    🛒 Cart ({cartCount})
                </div>
            </div>
        </nav>
    );
};

export default Navbar;