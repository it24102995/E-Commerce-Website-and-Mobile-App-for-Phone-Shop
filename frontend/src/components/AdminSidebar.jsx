import React, { useState } from 'react';
import './AdminSidebar.css';

const AdminSidebar = ({ activePage }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const user = JSON.parse(localStorage.getItem('ms_user') || '{}');
    const adminName = user.name ? `Hello, ${user.name}` : 'Hello, Admin';

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('ms_user');
        window.location.href = 'index.html';
    };

    return (
        <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>

            {/* Brand Header */}
            <div className="sidebar-header">
                <i className="fa-solid fa-mobile-screen-button"></i>
                {!isCollapsed && <span>HYUNDAI PREMIER</span>}
            </div>

            {/* Toggle Button - same position as static HTML (after brand) */}
            <button
                className="toggle-sidebar-btn-sq"
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                <i className={`fa-solid ${isCollapsed ? 'fa-angles-right' : 'fa-angles-left'}`}></i>
            </button>

            {/* Navigation - same icons as admin.html */}
            <nav className="sidebar-nav">
                <a href="admin.html#dashboard" className={activePage === 'dashboard' ? 'active' : ''} title="Dashboard">
                    <i className="fa-solid fa-gauge"></i>
                    {!isCollapsed && <span>Dashboard</span>}
                </a>
                <a href="admin.html#inventory" className={activePage === 'products' ? 'active' : ''} title="Product Management">
                    <i className="fa-solid fa-box"></i>
                    {!isCollapsed && <span>Product Management</span>}
                </a>
                <a href="admin.html#orders" className={activePage === 'orders' ? 'active' : ''} title="Order Management">
                    <i className="fa-solid fa-cart-shopping"></i>
                    {!isCollapsed && <span>Order Management</span>}
                </a>
                <a href="admin.html#reviews" className={activePage === 'reviews' ? 'active' : ''} title="Reviews Management">
                    <i className="fa-solid fa-comments"></i>
                    {!isCollapsed && <span>Reviews Management</span>}
                </a>
                <a href="shop.html#/payment-history" className={activePage === 'payments' ? 'active' : ''} title="Payment History">
                    <i className="fa-solid fa-file-invoice-dollar"></i>
                    {!isCollapsed && <span>Payment History</span>}
                </a>
                <a href="complaint-admin.html" className={activePage === 'complaints' ? 'active' : ''} title="Complaint Management">
                    <i className="fa-solid fa-headset"></i>
                    {!isCollapsed && <span>Complaint Management</span>}
                </a>
                <a href="profiles.html" className={activePage === 'profiles' ? 'active' : ''} title="User Profiles">
                    <i className="fa-solid fa-address-card"></i>
                    {!isCollapsed && <span>User Profiles</span>}
                </a>
                <a href="user-management.html" className={activePage === 'settings' ? 'active' : ''} title="User Settings">
                    <i className="fa-solid fa-users-gear"></i>
                    {!isCollapsed && <span>User Settings</span>}
                </a>
            </nav>

            {/* Footer - greeting with 👋 emoji exactly like static HTML JS */}
            <div className="sidebar-footer">
                {!isCollapsed && (
                    <div className="admin-email-pill-white">
                        <span>👋 {adminName}</span>
                    </div>
                )}
                <button onClick={logout} className="logout-btn-navy">
                    <i className="fa-solid fa-right-from-bracket"></i>
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
