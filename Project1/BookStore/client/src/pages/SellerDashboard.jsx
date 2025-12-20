import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, ShoppingBag, DollarSign, Package, Eye } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const SellerDashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalSales: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!user.isSeller && !user.isAdmin) {
            navigate('/');
            return;
        }

        fetchSellerData();
    }, [user, navigate]);

    const fetchSellerData = async () => {
        if (!user || !user.token) {
            setLoading(false);
            return;
        }



        try {
            const [booksRes, ordersRes] = await Promise.all([
                axios.get('/api/books'),
                axios.get('/api/orders/seller', {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
            ]);

            const books = booksRes.data;
            const orders = ordersRes.data;
            
            // Books owned by this seller (whether created or cloned)
            // book.user is now populated as an object, so we need to compare book.user._id
            const myBooks = books.filter(b => {
                const bookUserId = typeof b.user === 'object' ? b.user._id : b.user;
                return bookUserId === user._id;
            });

            setStats({
                totalStoreBooks: books.length,
                myBooks: myBooks.length,
                totalSales: orders.length,
                totalRevenue: orders.reduce((sum, order) => sum + (order.sellerTotal || 0), 0),
                pendingOrders: orders.filter(o => !o.isDelivered).length
            });

            setRecentOrders(orders.slice(0, 5));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching seller data:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="loader">Loading...</div>;
    if (!user) return null;

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 className="page-title">Seller Dashboard</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                    Welcome back, {user.name}! Here's your business overview.
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                My Books
                            </h3>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)' }}>
                                {stats.myBooks}
                            </div>
                        </div>
                        <BookOpen size={32} color="var(--primary)" />
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                Total Store Books
                            </h3>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                {stats.totalStoreBooks}
                            </div>
                        </div>
                        <BookOpen size={32} color="var(--text-muted)" />
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                Total Sales
                            </h3>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--success)' }}>
                                {stats.totalSales}
                            </div>
                        </div>
                        <ShoppingBag size={32} color="var(--success)" />
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                Revenue
                            </h3>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--accent)' }}>
                                ₹{stats.totalRevenue.toFixed(2)}
                            </div>
                        </div>
                        <DollarSign size={32} color="var(--accent)" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <Link to="/seller/add-book" className="card" style={{ padding: '2rem', textAlign: 'center', display: 'block', transition: 'var(--transition)' }}>
                        <BookOpen size={32} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Create New Book</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>List a brand new book</p>
                    </Link>
                    <Link to="/seller/add-existing-book" className="card" style={{ padding: '2rem', textAlign: 'center', display: 'block', transition: 'var(--transition)' }}>
                        <Package size={32} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Add Existing Book</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Add from catalog</p>
                    </Link>
                    <Link to="/seller/books" className="card" style={{ padding: '2rem', textAlign: 'center', display: 'block', transition: 'var(--transition)' }}>
                        <Package size={32} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>My Books</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your inventory</p>
                    </Link>
                    <Link to="/seller/orders" className="card" style={{ padding: '2rem', textAlign: 'center', display: 'block', transition: 'var(--transition)' }}>
                        <ShoppingBag size={32} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>View Orders</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track your sales</p>
                    </Link>
                </div>
            </div>

            {/* Recent Orders */}
            <div>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Recent Orders</h2>
                {recentOrders.length === 0 ? (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>No orders yet</p>
                    </div>
                ) : (
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'var(--background)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase' }}>Order ID</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase' }}>Date</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                            {order._id.substring(0, 8)}...
                                        </td>
                                        <td style={{ padding: '1rem' }}>{order.createdAt.substring(0, 10)}</td>
                                        <td style={{ padding: '1rem', fontWeight: '700', color: 'var(--primary)' }}>
                                            ₹{order.sellerTotal ? order.sellerTotal.toFixed(2) : (order.totalPrice ? order.totalPrice.toFixed(2) : '0.00')}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {order.isDelivered ? (
                                                <span style={{ color: 'var(--success)', fontWeight: '600' }}>Delivered</span>
                                            ) : (
                                                <span style={{ color: 'var(--warning)', fontWeight: '600' }}>Pending</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <Link to={`/order/${order._id}`} className="btn btn-sm btn-outline">
                                                <Eye size={16} />
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;
