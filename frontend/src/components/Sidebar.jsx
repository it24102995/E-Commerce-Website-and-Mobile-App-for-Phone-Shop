import React from 'react';
import './Sidebar.css';

const Sidebar = () => (
    <aside className="sidebar">
        <h3>Categories</h3>
        <ul>
            <li>Premium iPhones</li>
            <li>Flagship Samsung</li>
            <li>Exclusive Accessories</li>
            <li>Limited Editions</li>
        </ul>
        <div className="promo-box">
            <strong>OFFER</strong><br/>
            Get 10% Off on Golden Edition Items
        </div>
    </aside>
);
export default Sidebar;
