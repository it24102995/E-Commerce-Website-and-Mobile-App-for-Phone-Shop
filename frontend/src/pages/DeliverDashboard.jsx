import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { trackingService } from '../service/trackingService';
import './Tracking.css';

const DeliverDashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [rider, setRider] = useState(null);

    useEffect(() => {
        const storedRider = JSON.parse(localStorage.getItem('rider'));
        if (!storedRider) {
            navigate('/deliver-login');
            return;
        }
        setRider(storedRider);
        fetchOrders(storedRider.id);

        const interval = setInterval(() => fetchOrders(storedRider.id), 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async (riderId) => {
        try {
            const available = await trackingService.getAvailableOrders();
            const accepted = await trackingService.getRiderOrders(riderId);
            setOrders(available);
            setMyOrders(accepted);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

    const handleAccept = async (orderId) => {
        try {
            await trackingService.acceptOrder(orderId, rider.id);
            Swal.fire('Accepted!', 'Order has been assigned to you.', 'success');
            fetchOrders(rider.id);
        } catch (error) {
            Swal.fire('Error', 'Could not accept order.', 'error');
        }
    };

    return (
        <div className="tracking-container">
            {!rider ? (
                <div className="empty-text">Loading Rider Profile...</div>
            ) : (
                <>
                <header className="tracking-header">
                    <h1>Rider Dashboard</h1>
                    <div className="rider-info">
                        <span className="rider-name">Hi, {rider.name}</span>
                        <button 
                            onClick={() => { localStorage.removeItem('rider'); navigate('/deliver-login'); }}
                            className="btn-logout"
                        >Logout</button>
                    </div>
                </header>

                <div className="dashboard-grid">
                    {/* Available Orders */}
                    <section className="order-section">
                        <h2>📦 Available Orders</h2>
                        <div className="order-list">
                            {orders.length === 0 && <p className="empty-text">No available orders at the moment.</p>}
                            {orders.map(order => (
                                <div key={order.orderId} className="order-card">
                                    <div className="order-card-header">
                                        <div>
                                            <p className="order-id">Order #{order.orderId}</p>
                                            <p className="customer-name">{order.customerName}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleAccept(order.orderId)}
                                            className="btn-accept"
                                        >Accept</button>
                                    </div>
                                    <div className="product-list">
                                        {order.productList && order.productList.map((p, i) => (
                                            <div key={i}>{p.model} (x{p.quantity})</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* My Accepted Orders */}
                    <section className="order-section">
                        <h2 style={{color: 'var(--golden)'}}>✅ My Orders</h2>
                        <div className="order-list">
                            {myOrders.length === 0 && <p className="empty-text">No accepted orders yet.</p>}
                            {myOrders.map(order => (
                                <div key={order.orderId} className="order-card" style={{borderColor: 'var(--icy-lake)'}}>
                                    <div className="order-card-header">
                                        <div>
                                            <p className="order-id" style={{color: 'var(--golden)'}}>Order #{order.orderId}</p>
                                            <p className="customer-name">{order.customerName}</p>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/rider-view/${order.orderId}`)}
                                            className="btn-track"
                                        >Track / Update</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                </>
            )}
        </div>
    );
};

export default DeliverDashboard;
