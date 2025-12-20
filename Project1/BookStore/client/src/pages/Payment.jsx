import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Banknote } from 'lucide-react';

const Payment = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

    const submitHandler = (e) => {
        e.preventDefault();
        sessionStorage.setItem('paymentMethod', paymentMethod);
        navigate('/placeorder');
    };

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
            <button onClick={() => navigate('/shipping')} className="back-btn">
                <ArrowLeft size={20} /> Back to Shipping
            </button>

            <div className="auth-container" style={{ marginTop: '2rem' }}>
                <div className="auth-card" style={{ maxWidth: '600px' }}>
                    <div className="auth-header">
                        <h2>Payment Method</h2>
                        <p>Select your preferred payment method</p>
                    </div>

                    <form onSubmit={submitHandler} className="auth-form">
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '1rem', border: '2px solid var(--border)', borderRadius: '0.75rem', marginBottom: '1rem', background: paymentMethod === 'Cash on Delivery' ? 'var(--background)' : 'white' }}>
                                <input
                                    type="radio"
                                    value="Cash on Delivery"
                                    checked={paymentMethod === 'Cash on Delivery'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                                />
                                <Banknote size={24} color="var(--primary)" />
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontSize: '1rem', fontWeight: '500', display: 'block' }}>Cash on Delivery</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pay when you receive your order</span>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '1rem', border: '2px solid var(--border)', borderRadius: '0.75rem', marginBottom: '1rem', background: paymentMethod === 'PayPal' ? 'var(--background)' : 'white' }}>
                                <input
                                    type="radio"
                                    value="PayPal"
                                    checked={paymentMethod === 'PayPal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                                />
                                <Smartphone size={24} color="var(--primary)" />
                                <span style={{ fontSize: '1rem', fontWeight: '500' }}>PayPal or Credit Card</span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '1rem', border: '2px solid var(--border)', borderRadius: '0.75rem', background: paymentMethod === 'Stripe' ? 'var(--background)' : 'white' }}>
                                <input
                                    type="radio"
                                    value="Stripe"
                                    checked={paymentMethod === 'Stripe'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                                />
                                <CreditCard size={24} color="var(--primary)" />
                                <span style={{ fontSize: '1rem', fontWeight: '500' }}>Stripe</span>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            Continue to Place Order
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Payment;
