import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const OrderDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`/api/orders/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setOrder(data);
                setLoading(false);
            } catch (error) {
                addToast(error.response?.data?.message || error.message, 'error');
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [id, user, addToast]);

    const payHandler = async () => {
        try {
            const { data } = await axios.put(
                `/api/orders/${id}/pay`,
                {
                    id: `PAY-${Date.now()}`,
                    status: 'COMPLETED',
                    update_time: new Date().toISOString(),
                    email_address: user.email,
                },
                {
                    headers: { Authorization: `Bearer ${user.token}` },
                }
            );
            setOrder(data);
            addToast('Payment successful!', 'success');
            
            // Reload the page to show updated status
            window.location.reload();
        } catch (error) {
            addToast(error.response?.data?.message || error.message, 'error');
        }
    };

    if (loading) return <div className="loader">Loading...</div>;
    if (!order) return <div className="error-message">Order not found</div>;

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
            <h1 className="page-title">Order {order._id}</h1>

            <div className="cart-grid">
                <div>
                    {/* Order Status */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Package size={24} color="var(--primary)" />
                            Order Status
                        </h3>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {order.isPaid ? (
                                    <CheckCircle size={20} color="var(--success)" />
                                ) : (
                                    <Clock size={20} color="var(--warning)" />
                                )}
                                <span>
                                    {order.isPaid 
                                        ? `Paid on ${order.paidAt?.substring(0, 10)}` 
                                        : order.paymentMethod === 'Cash on Delivery' 
                                            ? 'Pay on Delivery' 
                                            : 'Not Paid'
                                    }
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {order.isDelivered ? (
                                    <Truck size={20} color="var(--success)" />
                                ) : (
                                    <Clock size={20} color="var(--warning)" />
                                )}
                                <span>{order.isDelivered ? `Delivered on ${order.deliveredAt?.substring(0, 10)}` : 'Not Delivered'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Shipping Address</h3>
                        <p><strong>Name:</strong> {order.user?.name}</p>
                        <p><strong>Email:</strong> {order.user?.email}</p>
                        <p>
                            <strong>Address:</strong> {order.shippingAddress.address},{' '}
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
                            {order.shippingAddress.country}
                        </p>
                    </div>

                    {/* Payment Method */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Payment Method</h3>
                        <p><strong>Method:</strong> {order.paymentMethod}</p>
                    </div>

                    {/* Order Items */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Order Items</h3>
                        {order.orderItems.map((item) => (
                            <div key={`${item.product}-${item.format}`} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                <img src={item.image} alt={item.name} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                <div style={{ flex: 1 }}>
                                    <Link to={`/book/${item.product}`} style={{ fontWeight: '600', color: 'var(--text)' }}>
                                        {item.name}
                                    </Link>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        Format: {item.format} | Qty: {item.qty}
                                    </p>
                                    <p style={{ color: 'var(--primary)', fontWeight: '700' }}>${item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="summary-card">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Items</span>
                        <span>${order.itemsPrice}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>${order.shippingPrice}</span>
                    </div>
                    <div className="summary-row">
                        <span>Tax</span>
                        <span>${order.taxPrice}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>${order.totalPrice}</span>
                    </div>
                    {!order.isPaid && user && !user.isAdmin && order.paymentMethod !== 'Cash on Delivery' && (
                        <button onClick={payHandler} className="btn btn-primary btn-block">
                            Pay Now (Mock)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
