import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { Package, CheckCircle, Clock, Eye } from 'lucide-react';

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/api/orders/myorders', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setOrders(data);
                setLoading(false);
            } catch (error) {
                addToast(error.response?.data?.message || error.message, 'error');
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user.token, addToast]);

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
            <h1 className="page-title">My Orders</h1>

            {orders.length === 0 ? (
                <div className="cart-empty-state">
                    <Package size={64} className="empty-cart-icon" />
                    <h2>No orders yet</h2>
                    <p>Start shopping to place your first order!</p>
                    <Link to="/" className="btn btn-primary">
                        Browse Books
                    </Link>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>
                                        {order.isPaid ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                                                <CheckCircle size={16} />
                                                {order.paidAt.substring(0, 10)}
                                            </span>
                                        ) : (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
                                                <Clock size={16} />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                                                <CheckCircle size={16} />
                                                {order.deliveredAt.substring(0, 10)}
                                            </span>
                                        ) : (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
                                                <Clock size={16} />
                                                Processing
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <Link to={`/order/${order._id}`} className="action-btn">
                                            <Eye size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
