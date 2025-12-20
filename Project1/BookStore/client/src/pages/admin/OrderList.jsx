import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, CheckCircle, Clock, Truck, Trash2, DollarSign } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/api/orders', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user.token]);

    const deliverHandler = async (id) => {
        try {
            await axios.put(`/api/orders/${id}/deliver`, {}, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            addToast('Order marked as delivered', 'success');
            // Refresh orders
            const { data } = await axios.get('/api/orders', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setOrders(data);
        } catch (error) {
            addToast('Error updating order', 'error');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                await axios.delete(`/api/orders/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                addToast('Order deleted successfully', 'success');
                // Refresh orders
                setOrders(orders.filter((order) => order._id !== id));
            } catch (error) {
                addToast('Error deleting order', 'error');
            }
        }
    };

    const payHandler = async (id) => {
        try {
            await axios.put(`/api/orders/${id}/pay`, {
                id: `ADMIN-${Date.now()}`,
                status: 'COMPLETED',
                update_time: new Date().toISOString(),
                email_address: user.email,
            }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            addToast('Order marked as paid', 'success');
            // Refresh orders
            const { data } = await axios.get('/api/orders', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setOrders(data);
        } catch (error) {
            addToast('Error updating order', 'error');
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div>
            <div className="admin-header">
                <h1>Orders Management</h1>
                <p>Manage and track customer orders</p>
            </div>
            <div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
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
                            <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                {order._id.substring(0, 8)}...
                            </td>
                            <td>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{order.user?.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {order.user?.email}
                                    </div>
                                </div>
                            </td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{order.totalPrice.toFixed(2)}</td>
                            <td>
                                {order.isPaid ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                                        <CheckCircle size={16} />
                                        {order.paidAt?.substring(0, 10)}
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
                                        {order.deliveredAt?.substring(0, 10)}
                                    </span>
                                ) : (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
                                        <Clock size={16} />
                                        Processing
                                    </span>
                                )}
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link to={`/order/${order._id}`} className="action-btn" title="View Details">
                                        <Eye size={18} />
                                    </Link>
                                    {!order.isPaid && (
                                        <button
                                            onClick={() => payHandler(order._id)}
                                            className="action-btn"
                                            style={{ background: 'var(--warning)', color: 'white' }}
                                            title="Mark as Paid"
                                        >
                                            <DollarSign size={18} />
                                        </button>
                                    )}
                                    {!order.isDelivered && (
                                        <button
                                            onClick={() => deliverHandler(order._id)}
                                            className="action-btn"
                                            style={{ background: 'var(--success)', color: 'white' }}
                                            title="Mark as Delivered"
                                        >
                                            <Truck size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteHandler(order._id)}
                                        className="action-btn"
                                        style={{ background: '#ef4444', color: 'white' }}
                                        title="Delete Order"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default OrderList;
