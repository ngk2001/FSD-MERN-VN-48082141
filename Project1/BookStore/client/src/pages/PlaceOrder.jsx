import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const PlaceOrder = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();

    const [shippingAddress, setShippingAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');

    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            navigate('/cart');
        }
        
        const shipping = JSON.parse(sessionStorage.getItem('shippingAddress') || 'null');
        const payment = sessionStorage.getItem('paymentMethod');

        if (!shipping || !payment) {
            navigate('/shipping');
            return;
        }

        setShippingAddress(shipping);
        setPaymentMethod(payment);
    }, [navigate, cartItems]);

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = (itemsPrice * 0.15).toFixed(2);
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    const placeOrderHandler = async () => {
        try {
            // Ensure all items have a format
            const orderItemsWithFormat = cartItems.map(item => ({
                ...item,
                format: item.format || 'Paperback'
            }));

            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: orderItemsWithFormat,
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            // Clear cart and session storage
            clearCart();
            sessionStorage.removeItem('shippingAddress');
            sessionStorage.removeItem('paymentMethod');
            addToast('Order placed successfully!', 'success');
            navigate(`/order/${data._id}`);
        } catch (error) {
            addToast(error.response?.data?.message || error.message, 'error');
        }
    };

    if (!shippingAddress) return <div className="loader">Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
            <button onClick={() => navigate('/payment')} className="back-btn">
                <ArrowLeft size={20} /> Back to Payment
            </button>

            <h1 className="page-title">Place Order</h1>

            <div className="cart-grid">
                <div>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Shipping</h3>
                            <button onClick={() => navigate('/shipping')} className="btn btn-sm btn-outline">Edit</button>
                        </div>
                        <p><strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Payment Method</h3>
                            <button onClick={() => navigate('/payment')} className="btn btn-sm btn-outline">Edit</button>
                        </div>
                        <p><strong>Method:</strong> {paymentMethod}</p>
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>Order Items</h3>
                            <button onClick={() => navigate('/cart')} className="btn btn-sm btn-outline">Edit Cart</button>
                        </div>
                        {cartItems.map((item) => (
                            <div key={`${item.product}-${item.format}`} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                <img src={item.image} alt={item.name} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                <div style={{ flex: 1 }}>
                                    <Link to={`/book/${item.product}`} style={{ fontWeight: '600', color: 'var(--text)' }}>
                                        {item.name}
                                    </Link>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Format: {item.format}</p>
                                    <p style={{ color: 'var(--primary)', fontWeight: '700' }}>₹{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="summary-card">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Items</span>
                        <span>₹{itemsPrice}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>₹{shippingPrice}</span>
                    </div>
                    <div className="summary-row">
                        <span>Tax</span>
                        <span>₹{taxPrice}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{totalPrice}</span>
                    </div>
                    <button
                        onClick={placeOrderHandler}
                        className="btn btn-primary btn-block"
                        disabled={cartItems.length === 0}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
