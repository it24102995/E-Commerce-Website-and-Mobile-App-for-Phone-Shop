import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import './Checkout.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const cardElementOptions = {
    style: {
        base: {
            fontSize: '16px',
            color: '#121111',
            fontFamily: 'Inter, sans-serif',
            '::placeholder': {
                color: '#8f8f8f',
            },
            iconColor: '#234F60',
        },
        invalid: {
            color: '#e74c3c',
            iconColor: '#e74c3c',
        },
    },
    hidePostalCode: false,
};

const CheckoutForm = ({ cartItems, setPaymentInfo }) => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const [formData, setFormData] = useState({
        cardholderName: '',
        email: '',
        address: '',
        city: '',
        country: 'Sri Lanka',
        paymentMethod: 'CARD'
    });

    const [errors, setErrors] = useState({});
    const [cardError, setCardError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }, [cartItems]);

    const formattedDate = new Date().toLocaleString();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
        if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email address';
        if (!formData.address.trim()) newErrors.address = 'Billing address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (cartItems.length === 0) newErrors.cart = 'Your cart is empty';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCardChange = (event) => {
        if (event.error) {
            setCardError(event.error.message);
        } else {
            setCardError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // COD FLOW
        if (formData.paymentMethod === 'COD') {
            setPaymentInfo({
                paymentId: 'COD-' + Date.now(),
                status: 'PENDING',
                amount: subtotal,
                cardholderName: formData.cardholderName,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                country: formData.country,
                paymentMethod: 'Cash on Delivery',
                paidAt: formattedDate
            });

            navigate('/invoice');
            return;
        }

        // CARD FLOW
        if (!stripe || !elements) return;

        setIsProcessing(true);

        try {
            const amount = 1000;

            const response = await fetch('http://localhost:8081/api/payment/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create payment intent');
            }

            const cardElement = elements.getElement(CardElement);

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: formData.cardholderName,
                        email: formData.email,
                        address: {
                            line1: formData.address,
                            city: formData.city,
                            country: 'LK'
                        },
                    },
                },
            });

            if (result.error) {
                setCardError(result.error.message || 'Payment failed');
                setIsProcessing(false);
                return;
            }

            if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                setPaymentInfo({
                    paymentId: result.paymentIntent.id,
                    status: 'PAID',
                    amount: subtotal,
                    cardholderName: formData.cardholderName,
                    email: formData.email,
                    address: formData.address,
                    city: formData.city,
                    country: formData.country,
                    paymentMethod: 'Card Payment',
                    paidAt: formattedDate
                });

                navigate('/invoice');
            } else {
                setCardError('Payment was not completed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            setCardError(error.message || 'Payment request failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-box">
                <div className="checkout-topbar">
                    <span className="checkout-badge">SECURE CHECKOUT</span>
                    <span className="checkout-powered">Powered by Stripe Sandbox</span>
                </div>

                <h2 className="luxury-header">Payment Authorization</h2>
                <p className="checkout-subtext">
                    Complete your order using our protected payment interface.
                </p>

                <form className="checkout-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <p className="form-label">Cardholder Details</p>

                        <input
                            type="text"
                            name="cardholderName"
                            placeholder="Cardholder Name"
                            value={formData.cardholderName}
                            className={errors.cardholderName ? 'input-error' : ''}
                            onChange={handleChange}
                        />
                        {errors.cardholderName && <span className="error-text">{errors.cardholderName}</span>}

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            className={errors.email ? 'input-error' : ''}
                            onChange={handleChange}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-section">
                        <p className="form-label">Billing Address</p>

                        <textarea
                            name="address"
                            placeholder="Street Address"
                            rows="3"
                            value={formData.address}
                            className={errors.address ? 'input-error' : ''}
                            onChange={handleChange}
                        />
                        {errors.address && <span className="error-text">{errors.address}</span>}

                        <div className="form-group">
                            <div className="input-field">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    className={errors.city ? 'input-error' : ''}
                                    onChange={handleChange}
                                />
                                {errors.city && <span className="error-text">{errors.city}</span>}
                            </div>

                            <div className="input-field">
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="Country"
                                    value={formData.country}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <p className="form-label">Payment Method</p>

                        <div className="payment-methods">
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="CARD"
                                    checked={formData.paymentMethod === 'CARD'}
                                    onChange={handleChange}
                                />
                                Card Payment
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={formData.paymentMethod === 'COD'}
                                    onChange={handleChange}
                                />
                                Cash on Delivery
                            </label>
                        </div>
                    </div>

                    {formData.paymentMethod === 'CARD' && (
                        <div className="form-section">
                            <p className="form-label">Card Information</p>

                            <div className={`stripe-card-box ${cardError ? 'input-error' : ''}`}>
                                <CardElement
                                    options={cardElementOptions}
                                    onChange={handleCardChange}
                                />
                            </div>

                            {cardError && <span className="error-text">{cardError}</span>}

                            <div className="card-meta-row">
                                <span>Accepted Cards</span>
                                <span>Visa / Mastercard / Amex</span>
                            </div>
                        </div>
                    )}

                    {formData.paymentMethod === 'COD' && (
                        <div className="form-section">
                            <div className="cod-note-box">
                                <strong>Cash on Delivery Selected</strong>
                                <p>Payment will be collected when your order is delivered.</p>
                            </div>
                        </div>
                    )}

                    {errors.cart && <span className="error-text">{errors.cart}</span>}

                    <div className="summary-preview">
                        <span>Total Payable</span>
                        <strong>Rs. {subtotal.toLocaleString()}</strong>
                    </div>

                    <button
                        type="submit"
                        className="pay-now-btn"
                        disabled={isProcessing || cartItems.length === 0}
                    >
                        {isProcessing
                            ? 'PROCESSING PAYMENT...'
                            : formData.paymentMethod === 'COD'
                                ? 'PLACE COD ORDER'
                                : 'AUTHORIZE PAYMENT'}
                    </button>

                    <p className="security-note">
                        🔒 Secure order processing and protected checkout experience
                    </p>
                </form>
            </div>
        </div>
    );
};

const Checkout = ({ cartItems, setPaymentInfo }) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm cartItems={cartItems} setPaymentInfo={setPaymentInfo} />
        </Elements>
    );
};

export default Checkout;