import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tracking.css';

const CustomerOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let user = null;
        try {
            const rawUser = localStorage.getItem('ms_user');
            if (rawUser && rawUser !== 'undefined') {
                user = JSON.parse(rawUser);
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage:", e);
        }

        if (!user || (!user.userId && !user.id)) {
            navigate('/');
            return;
        }

        const userIdToFetch = user.userId || user.id;

        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:8081/api/orders?userId=${userIdToFetch}`);
                if (!response.ok) throw new Error('Failed to fetch orders');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error("Expected array but got:", data);
                    setOrders([]);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    if (loading) return <div className="tracking-container"><div className="empty-text">Loading your orders...</div></div>;

    return (
        <div className="tracking-container">
            <header className="tracking-header">
                <h1>My Orders</h1>
                <div className="rider-info">
                    <button onClick={() => navigate('/')} className="btn-logout">Back to Shop</button>
                </div>
            </header>

            <div className="order-section">
                <div className="order-list">
                    {orders.length === 0 && <p className="empty-text">You have no orders yet.</p>}
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-card-header">
                                <div>
                                    <p className="order-id">Order #{order.id}</p>
                                    <p className="order-date">{new Date(order.orderDate).toLocaleString()}</p>
                                    <p className="order-amount" style={{fontWeight: 'bold', color: '#2d5cf7', marginTop: '4px'}}>
                                        Total: LKR {((order.productPrice || order.product?.price || 0) * order.quantity).toLocaleString()}
                                    </p>
                                    <p style={{marginTop: '10px', fontSize: '0.9rem', color: '#374151'}}>
                                        <strong>Status:</strong> <span className={`pay-badge pay-${(order.paymentStatus||'PENDING').toLowerCase()}`}>{order.status || 'PENDING'}</span>
                                    </p>
                                    <p style={{marginTop: '4px', fontSize: '0.9rem', color: '#374151'}}>
                                        <strong>Assigned Rider:</strong> {order.rider?.name ? (
                                            <span style={{color: 'var(--golden)', fontWeight: 'bold'}}>🏍️ {order.rider.name}</span>
                                        ) : (
                                            <span style={{color: '#9ca3af'}}>Finding a rider...</span>
                                        )}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => navigate(`/track-order/${order.id}`)}
                                    className="btn-track"
                                >Track Order</button>
                            </div>
                            <div className="product-list">
                                <div>{order.productName || order.product?.name || 'Product'} (x{order.quantity})</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerOrders;
