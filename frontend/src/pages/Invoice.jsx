import React from 'react';
import './Invoice.css';

const Invoice = ({ cartItems, paymentInfo }) => {
    const items = paymentInfo?.items || cartItems || [];

    const subtotal =
        paymentInfo?.subtotal ??
        items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const deliveryFee =
        paymentInfo?.deliveryFee ??
        (items.length > 0 ? 2500 : 0);

    const total =
        paymentInfo?.amount ??
        (subtotal + deliveryFee);

    const currentDate = paymentInfo?.paidAt || new Date().toLocaleString();

    const mapQuery = encodeURIComponent(
        `${paymentInfo?.address || ''} ${paymentInfo?.city || ''} ${paymentInfo?.country || ''}`.trim()
    );

    return (
        <div className="invoice-container">
            <div className="invoice-card">
                <div className="invoice-header">
                    <div>
                        <h1 className="logo">HYUNDAI PREMIER</h1>
                        <p className="invoice-subtitle">Official Order Receipt</p>
                    </div>
                    <div className="status-badge">{paymentInfo?.status || 'PAID'}</div>
                </div>

                <div className="invoice-meta-grid">
                    <div className="invoice-meta-box">
                        <span className="meta-label">Reference ID</span>
                        <strong>{paymentInfo?.paymentId || 'N/A'}</strong>
                    </div>

                    <div className="invoice-meta-box">
                        <span className="meta-label">Date & Time</span>
                        <strong>{currentDate}</strong>
                    </div>

                    <div className="invoice-meta-box">
                        <span className="meta-label">Customer Name</span>
                        <strong>{paymentInfo?.customerName || 'N/A'}</strong>
                    </div>

                    <div className="invoice-meta-box">
                        <span className="meta-label">Payment Method</span>
                        <strong>{paymentInfo?.paymentMethod || 'Card Payment'}</strong>
                    </div>

                    {paymentInfo?.email && (
                        <div className="invoice-meta-box">
                            <span className="meta-label">Email Address</span>
                            <strong>{paymentInfo.email}</strong>
                        </div>
                    )}

                    {paymentInfo?.phoneNumber && (
                        <div className="invoice-meta-box">
                            <span className="meta-label">Phone Number</span>
                            <strong>{paymentInfo.phoneNumber}</strong>
                        </div>
                    )}
                </div>

                <div className="billing-section">
                    <h3>Delivery / Billing Address</h3>
                    <p>
                        {paymentInfo?.address || 'N/A'}
                        <br />
                        {paymentInfo?.city || ''}
                        {paymentInfo?.city ? ', ' : ''}
                        {paymentInfo?.country || ''}
                    </p>

                    {(paymentInfo?.address || paymentInfo?.city || paymentInfo?.country) && (
                        <iframe
                            title="Delivery Location Map"
                            className="invoice-map"
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                        ></iframe>
                    )}
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
                        {items.map((item, index) => (
                            <tr key={item.id || `${item.name}-${index}`}>
                                <td>{item.name}</td>
                                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right' }}>
                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="invoice-summary-box">
                    <div className="invoice-summary-row">
                        <span>Subtotal</span>
                        <strong>Rs. {subtotal.toLocaleString()}</strong>
                    </div>

                    <div className="invoice-summary-row">
                        <span>Delivery Fee</span>
                        <strong>Rs. {deliveryFee.toLocaleString()}</strong>
                    </div>

                    <div className="invoice-summary-row total">
                        <span>Total Amount</span>
                        <strong>Rs. {total.toLocaleString()}</strong>
                    </div>
                </div>

                <div className="invoice-footer">
                    {paymentInfo?.paymentMethod === 'Cash on Delivery' ? (
                        <p>Payment will be collected upon delivery of your order.</p>
                    ) : (
                        <p>Your card payment has been successfully authorized.</p>
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
