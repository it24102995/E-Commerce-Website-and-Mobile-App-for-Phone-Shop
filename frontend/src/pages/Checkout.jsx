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

    const [selectedMethod, setSelectedMethod] = useState('');

    const [cardForm, setCardForm] = useState({
        cardholderName: '',
        email: '',
        address: '',
        city: '',
        country: 'Sri Lanka'
    });

    const [codForm, setCodForm] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        city: '',
        country: 'Sri Lanka'
    });

    const [errors, setErrors] = useState({});
    const [cardError, setCardError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }, [cartItems]);

    const formattedDate = new Date().toLocaleString();

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setCardForm((prev) => ({
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

    const handleCodInputChange = (e) => {
        const { name, value } = e.target;

        const finalValue =
            name === 'phoneNumber' ? value.replace(/\D/g, '').substring(0, 10) : value;

        setCodForm((prev) => ({
            ...prev,
            [name]: finalValue
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleCardChange = (event) => {
        if (event.error) {
            setCardError(event.error.message);
        } else {
            setCardError('');
        }
    };

    const validateCardForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!cardForm.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
        if (!emailRegex.test(cardForm.email)) newErrors.email = 'Invalid email address';
        if (!cardForm.address.trim()) newErrors.address = 'Billing address is required';
        if (!cardForm.city.trim()) newErrors.city = 'City is required';
        if (cartItems.length === 0) newErrors.cart = 'Your cart is empty';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateCodForm = () => {
        const newErrors = {};

        if (!codForm.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!/^\d{10}$/.test(codForm.phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10 digits';
        if (!codForm.address.trim()) newErrors.address = 'Delivery address is required';
        if (!codForm.city.trim()) newErrors.city = 'City is required';
        if (cartItems.length === 0) newErrors.cart = 'Your cart is empty';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMethod) {
            setErrors({ paymentMethod: 'Please select a payment method' });
            return;
        }

        if (selectedMethod === 'COD') {
            if (!validateCodForm()) return;

            setPaymentInfo({
                paymentId: 'COD-' + Date.now(),
                status: 'PENDING',
                amount: subtotal,
                customerName: codForm.fullName,
                phoneNumber: codForm.phoneNumber,
                address: codForm.address,
                city: codForm.city,
                country: codForm.country,
                paymentMethod: 'Cash on Delivery',
                paidAt: formattedDate
            });

            navigate('/invoice');
            return;
        }

        if (selectedMethod === 'CARD') {
            if (!validateCardForm()) return;
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
                            name: cardForm.cardholderName,
                            email: cardForm.email,
                            address: {
                                line1: cardForm.address,
                                city: cardForm.city,
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
                        customerName: cardForm.cardholderName,
                        email: cardForm.email,
                        address: cardForm.address,
                        city: cardForm.city,
                        country: cardForm.country,
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
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-box">
                <div className="checkout-topbar">
                    <span className="checkout-badge">SECURE CHECKOUT</span>
                    <span className="checkout-powered">Choose your preferred payment method</span>
                </div>

                <h2 className="luxury-header">Checkout Options</h2>
                <p className="checkout-subtext">
                    Select how you would like to complete your order.
                </p>

                <form className="checkout-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <p className="form-label">Select Payment Method</p>

                        <div className="payment-choice-grid">
                            <div
                                className={`payment-choice-card ${selectedMethod === 'CARD' ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedMethod('CARD');
                                    setErrors({});
                                }}
                            >
                                <h3>Card Payment</h3>
                                <p>Pay now using debit or credit card</p>
                            </div>

                            <div
                                className={`payment-choice-card ${selectedMethod === 'COD' ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedMethod('COD');
                                    setErrors({});
                                }}
                            >
                                <h3>Cash on Delivery</h3>
                                <p>Pay when your order is delivered</p>
                            </div>
                        </div>

                        {errors.paymentMethod && (
                            <span className="error-text">{errors.paymentMethod}</span>
                        )}
                    </div>

                    {selectedMethod === 'CARD' && (
                        <>
                            <div className="form-section">
                                <p className="form-label">Cardholder Details</p>

                                <input
                                    type="text"
                                    name="cardholderName"
                                    placeholder="Cardholder Name"
                                    value={cardForm.cardholderName}
                                    className={errors.cardholderName ? 'input-error' : ''}
                                    onChange={handleCardInputChange}
                                />
                                {errors.cardholderName && <span className="error-text">{errors.cardholderName}</span>}

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={cardForm.email}
                                    className={errors.email ? 'input-error' : ''}
                                    onChange={handleCardInputChange}
                                />
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>

                            <div className="form-section">
                                <p className="form-label">Billing Address</p>

                                <textarea
                                    name="address"
                                    placeholder="Street Address"
                                    rows="3"
                                    value={cardForm.address}
                                    className={errors.address ? 'input-error' : ''}
                                    onChange={handleCardInputChange}
                                />
                                {errors.address && <span className="error-text">{errors.address}</span>}

                                <div className="form-group">
                                    <div className="input-field">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={cardForm.city}
                                            className={errors.city ? 'input-error' : ''}
                                            onChange={handleCardInputChange}
                                        />
                                        {errors.city && <span className="error-text">{errors.city}</span>}
                                    </div>

                                    <div className="input-field">
                                        <input
                                            type="text"
                                            name="country"
                                            value={cardForm.country}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <p className="form-label">Card Details</p>

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
                        </>
                    )}

                    {selectedMethod === 'COD' && (
                        <>
                            <div className="form-section">
                                <p className="form-label">Delivery Details</p>

                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={codForm.fullName}
                                    className={errors.fullName ? 'input-error' : ''}
                                    onChange={handleCodInputChange}
                                />
                                {errors.fullName && <span className="error-text">{errors.fullName}</span>}

                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={codForm.phoneNumber}
                                    className={errors.phoneNumber ? 'input-error' : ''}
                                    onChange={handleCodInputChange}
                                />
                                {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}

                                <textarea
                                    name="address"
                                    placeholder="Delivery Address"
                                    rows="3"
                                    value={codForm.address}
                                    className={errors.address ? 'input-error' : ''}
                                    onChange={handleCodInputChange}
                                />
                                {errors.address && <span className="error-text">{errors.address}</span>}

                                <div className="form-group">
                                    <div className="input-field">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={codForm.city}
                                            className={errors.city ? 'input-error' : ''}
                                            onChange={handleCodInputChange}
                                        />
                                        {errors.city && <span className="error-text">{errors.city}</span>}
                                    </div>

                                    <div className="input-field">
                                        <input
                                            type="text"
                                            name="country"
                                            value={codForm.country}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <div className="cod-note-box">
                                    <strong>Cash on Delivery Selected</strong>
                                    <p>Our delivery team will collect your payment when the order arrives.</p>
                                </div>
                            </div>
                        </>
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
                            : selectedMethod === 'COD'
                                ? 'PLACE COD ORDER'
                                : 'CONTINUE'}
                    </button>

                    <p className="security-note">
                        🔒 Secure checkout and protected order processing
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