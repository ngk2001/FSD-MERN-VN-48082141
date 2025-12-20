import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import { Package, CheckCircle, Clock, Eye } from 'lucide-react';

const SellerOrders = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/api/orders/seller', {
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
    }, [user, addToast]);

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
            <h1 className="page-title">My Sales</h1>

            {orders.length === 0 ? (
                <div className="cart-empty-state">
                    <Package size={64} className="empty-cart-icon" />
                    <h2>No sales yet</h2>
                    <p>List more books to increase your sales!</p>
                    <Link to="/seller/add-book" className="btn btn-primary">
                        Add Book
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
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>₹{order.sellerTotal ? order.sellerTotal.toFixed(2) : (order.totalPrice ? order.totalPrice.toFixed(2) : '0.00')}</td>
                                    <td>
                                        {order.isPaid ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                                                <CheckCircle size={16} />
                                                Paid
                                            </span>
                                        ) : (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
                                                <Clock size={16} />
                                                Pending
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

export default SellerOrders;
