import React, { useState, useEffect } from 'react';
import './PaymentHistory.css';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        paid: 0,
        pending: 0
    });

    const API_BASE = 'http://localhost:8081/api';

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await fetch(`${API_BASE}/admin/payments`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setPayments(data);
            calculateStats(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const revenue = (data || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
        const paidCount = (data || []).filter(p => (p.status || '').toLowerCase() === 'paid').length;
        const pendingCount = (data || []).filter(p => (p.status || '').toLowerCase() === 'pending').length;

        setStats({
            totalRevenue: revenue,
            totalOrders: (data || []).length,
            paid: paidCount,
            pending: pendingCount
        });
    };

    const filteredPayments = (payments || []).filter(p => 
        (p.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.status || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAvatarColor = (name) => {
        const colors = ['#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997', '#17a2b8'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    if (loading) {
        return <div className="loading-container">Loading Payment History...</div>;
    }

    return (
        <div className="admin-main-content">
            <header className="ph-header">
                    <h1>Payment History</h1>
                    <p>Manage and monitor all customer transactions</p>
                </header>

                <div className="stats-grid">
                    <div className="stat-card revenue">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                            <span className="stat-label">TOTAL REVENUE</span>
                            <h2 className="stat-value">Rs. {stats.totalRevenue.toLocaleString()}</h2>
                        </div>
                    </div>
                    <div className="stat-card orders">
                        <div className="stat-icon">📋</div>
                        <div className="stat-info">
                            <span className="stat-label">TOTAL ORDERS</span>
                            <h2 className="stat-value">{stats.totalOrders}</h2>
                        </div>
                    </div>
                    <div className="stat-card paid">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <span className="stat-label">PAID</span>
                            <h2 className="stat-value">{stats.paid}</h2>
                        </div>
                    </div>
                    <div className="stat-card pending">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                            <span className="stat-label">PENDING</span>
                            <h2 className="stat-value">{stats.pending}</h2>
                        </div>
                    </div>
                </div>

                <div className="table-section">
                    <div className="table-controls">
                        <div className="search-wrapper">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Search by name, email, method or status..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <span className="results-count">{filteredPayments.length} results</span>
                    </div>

                    <div className="payment-table-wrapper">
                        <table className="payment-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>CUSTOMER</th>
                                    <th>EMAIL</th>
                                    <th>AMOUNT</th>
                                    <th>METHOD</th>
                                    <th>STATUS</th>
                                    <th>REFERENCE ID</th>
                                    <th>DATE & TIME</th>
                                </tr>
                            </thead>
                            <tbody>
                {filteredPayments.map((p, index) => (
                    <tr key={p.id}>
                        <td>{index + 1}</td>
                        <td>
                            <div className="customer-cell">
                                <div 
                                    className="avatar" 
                                    style={{ backgroundColor: getAvatarColor(p.fullName || 'Unknown') }}
                                >
                                    {(p.fullName || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="customer-info">
                                    <span className="customer-name">{p.fullName || 'N/A'}</span>
                                    <span className="customer-phone">{p.phone || '0773757199'}</span>
                                </div>
                            </div>
                        </td>
                        <td><span className="email-text">{p.email || 'N/A'}</span></td>
                        <td className="amount-cell">Rs. {(p.amount || 0).toLocaleString()}</td>
                        <td>
                            <span className={`method-badge ${p.cardNumber ? 'card' : 'cod'}`}>
                                {p.cardNumber ? '💳 Card' : '📦 COD'}
                            </span>
                        </td>
                        <td>
                            <span className={`status-badge ${(p.status || 'Pending').toLowerCase()}`}>
                                ● {p.status || 'Pending'}
                            </span>
                        </td>
                        <td><code className="ref-id">pi_{p.id}...{Math.random().toString(36).substring(7)}</code></td>
                        <td><span className="date-text">{p.paymentDate ? new Date(p.paymentDate).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span></td>
                    </tr>
                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

export default PaymentHistory;
