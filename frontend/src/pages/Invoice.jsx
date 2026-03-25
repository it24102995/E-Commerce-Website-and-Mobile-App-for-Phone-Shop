import React from 'react';
import './Invoice.css';

const Invoice = ({ cartItems, paymentInfo }) => {
    const total =
        paymentInfo?.amount ||
        cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const currentDate = paymentInfo?.paidAt || new Date().toLocaleString();

    return (
        <div className="invoice-container">
            <div className="invoice-card">
                <div className="invoice-header">
                    <div>
                        <h1 className="logo">HYUNDAI PREMIER</h1>
                        <p className="invoice-subtitle">Official Payment Receipt</p>
                    </div>
                    <div className="status-badge">{paymentInfo?.status || 'PAID'}</div>
                </div>

                <div className="invoice-meta-grid">
                    <div className="invoice-meta-box">
                        <span className="meta-label">Payment ID</span>
                        <strong>{paymentInfo?.paymentId || 'N/A'}</strong>
                    </div>

                    <div className="invoice-meta-box">
                        <span className="meta-label">Date & Time</span>
                        <strong>{currentDate}</strong>
                    </div>

                    <div className="invoice-meta-box">
                        <span className="meta-label">Customer Name</span>
                        <strong>{paymentInfo?.cardholderName || 'N/A'}</strong>
                    </div>

                    <div className="invoice-meta-box">
                        <span className="meta-label">Email Address</span>
                        <strong>{paymentInfo?.email || 'N/A'}</strong>
                    </div>

                    <div className="invoice-meta-box">
                        <span className="meta-label">Payment Method</span>
                        <strong>{paymentInfo?.paymentMethod || 'Card Payment'}</strong>
                    </div>
                </div>

                <div className="billing-section">
                    <h3>Billing Address</h3>
                    <p>
                        {paymentInfo?.address || 'N/A'}
                        <br />
                        {paymentInfo?.city || ''}
                        {paymentInfo?.city ? ', ' : ''}
                        {paymentInfo?.country || ''}
                    </p>
                </div>

                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style={{ textAlign: 'center' }}>Qty</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right' }}>
                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="invoice-total">
                    <h3>Total Amount: Rs. {total.toLocaleString()}</h3>
                </div>

                <div className="invoice-footer">
                    {paymentInfo?.paymentMethod === 'Cash on Delivery' ? (
                        <p>Payment will be collected at the time of delivery.</p>
                    ) : (
                        <p>Thank you for shopping with Hyundai Premier.</p>
                    )}

                    <button className="print-btn" onClick={() => window.print()}>
                        DOWNLOAD PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Invoice;