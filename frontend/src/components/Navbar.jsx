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
                {JSON.parse(localStorage.getItem('ms_user'))?.role !== 'RIDER' && (
                    <span onClick={() => window.location.href = 'index.html#products'}>Home</span>
                )}
                {JSON.parse(localStorage.getItem('ms_user'))?.role === 'RIDER' && (
                    <span onClick={() => navigate('/deliver-dashboard')}>Dashboard</span>
                )}
                
                {(localStorage.getItem('ms_user') || localStorage.getItem('rider')) ? (
                    <span onClick={() => {
                        localStorage.removeItem('ms_user');
                        localStorage.removeItem('rider');
                        window.location.href = 'index.html';
                    }} className="login-link">Logout</span>
                ) : (
                    <span onClick={() => window.location.href = 'index.html'} className="login-link">Login</span>
                )}

                {(!localStorage.getItem('rider') && JSON.parse(localStorage.getItem('ms_user') || '{}')?.role !== 'RIDER') && (
                    <div className="-icon-wrappercart" onClick={() => navigate('/cart')}>
                        <span className="cart-emoji">🛒</span>
                        <span className="cart-text">Cart ({cartCount})</span>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
