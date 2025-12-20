import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, ShoppingBag, BookOpen, TrendingUp } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSellers: 0,
        totalBooks: 0,
        totalOrders: 0,
        pendingSellerRequests: 0
    });
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, booksRes, ordersRes] = await Promise.all([
                    axios.get('/api/users', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    }),
                    axios.get('/api/books'),
                    axios.get('/api/orders', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    })
                ]);

                const users = usersRes.data;
                const sellers = users.filter(u => u.isSeller);
                const pendingRequests = users.filter(u => u.sellerRequest === 'pending');

                setStats({
                    totalUsers: users.length,
                    totalSellers: sellers.length,
                    totalBooks: booksRes.data.length,
                    totalOrders: ordersRes.data.length,
                    pendingSellerRequests: pendingRequests.length
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, [user.token]);

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div>
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage your bookstore's users, sellers, and inventory</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div className="stat-info">
                            <h3>Total Users</h3>
                            <p>{stats.totalUsers}</p>
                        </div>
                        <div className="stat-icon users">
                            <Users size={24} />
                        </div>
                    </div>
                    <Link to="/admin/userlist" className="btn btn-outline btn-sm" style={{ marginTop: '1rem', width: '100%' }}>
                        View Users
                    </Link>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div className="stat-info">
                            <h3>Total Sellers</h3>
                            <p>{stats.totalSellers}</p>
                            {stats.pendingSellerRequests > 0 && (
                                <div style={{ fontSize: '0.875rem', color: 'var(--warning)', marginTop: '0.5rem' }}>
                                    {stats.pendingSellerRequests} pending
                                </div>
                            )}
                        </div>
                        <div className="stat-icon sales">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <Link to="/admin/sellerlist" className="btn btn-outline btn-sm" style={{ marginTop: '1rem', width: '100%' }}>
                        View Sellers
                    </Link>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div className="stat-info">
                            <h3>Total Books</h3>
                            <p>{stats.totalBooks}</p>
                        </div>
                        <div className="stat-icon products">
                            <BookOpen size={24} />
                        </div>
                    </div>
                    <Link to="/admin/booklist" className="btn btn-outline btn-sm" style={{ marginTop: '1rem', width: '100%' }}>
                        View Books
                    </Link>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div className="stat-info">
                            <h3>Total Orders</h3>
                            <p>{stats.totalOrders}</p>
                        </div>
                        <div className="stat-icon orders">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                    <Link to="/admin/orderlist" className="btn btn-outline btn-sm" style={{ marginTop: '1rem', width: '100%' }}>
                        View Orders
                    </Link>
                </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <Link to="/admin/book/new" className="card" style={{ padding: '2rem', textAlign: 'center', display: 'block' }}>
                        <BookOpen size={32} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Add New Book</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Add a new book to inventory</p>
                    </Link>
                    <Link to="/admin/userlist" className="card" style={{ padding: '2rem', textAlign: 'center', display: 'block' }}>
                        <Users size={32} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Manage Users</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>View and edit user accounts</p>
                    </Link>
                    <Link to="/admin/orderlist" className="card" style={{ padding: '2rem', textAlign: 'center', display: 'block' }}>
                        <ShoppingBag size={32} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>View Orders</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track and manage orders</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
