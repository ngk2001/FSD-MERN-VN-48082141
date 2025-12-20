import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const AdminSellersInventory = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedSeller, setExpandedSeller] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/');
            return;
        }

        fetchSellersInventory();
    }, [user, navigate]);

    const fetchSellersInventory = async () => {
        try {
            const { data } = await axios.get('/api/admin/sellers-inventory', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setSellers(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const toggleExpand = (sellerId) => {
        setExpandedSeller(expandedSeller === sellerId ? null : sellerId);
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 className="page-title">Sellers Inventory Management</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                    View and manage all sellers' book inventories
                </p>
            </div>

            {/* Summary Cards */}
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
                                Total Sellers
                            </h3>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)' }}>
                                {sellers.length}
                            </div>
                        </div>
                        <Package size={32} color="var(--primary)" />
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                Total Books Listed
                            </h3>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--success)' }}>
                                {sellers.reduce((sum, s) => sum + s.totalBooks, 0)}
                            </div>
                        </div>
                        <BookOpen size={32} color="var(--success)" />
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                Total Inventory Value
                            </h3>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--accent)' }}>
                                ₹{sellers.reduce((sum, s) => sum + s.totalValue, 0).toFixed(2)}
                            </div>
                        </div>
                        <DollarSign size={32} color="var(--accent)" />
                    </div>
                </div>
            </div>

            {/* Sellers List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {sellers.length === 0 ? (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>No sellers found</p>
                    </div>
                ) : (
                    sellers.map((seller) => (
                        <div key={seller._id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            {/* Seller Header */}
                            <div 
                                onClick={() => toggleExpand(seller._id)}
                                style={{ 
                                    padding: '1.5rem', 
                                    cursor: 'pointer',
                                    background: expandedSeller === seller._id ? 'var(--background)' : 'transparent',
                                    transition: 'var(--transition)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                            {seller.name}
                                            {seller.isAdmin && (
                                                <span style={{ 
                                                    marginLeft: '0.5rem', 
                                                    fontSize: '0.75rem', 
                                                    padding: '0.25rem 0.5rem', 
                                                    background: 'var(--primary)', 
                                                    color: 'white', 
                                                    borderRadius: '0.25rem' 
                                                }}>
                                                    ADMIN
                                                </span>
                                            )}
                                        </h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            {seller.email}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                                Books
                                            </div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                                                {seller.totalBooks}
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                                Stock
                                            </div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>
                                                {seller.totalStock}
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                                Value
                                            </div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>
                                                ₹{seller.totalValue.toFixed(2)}
                                            </div>
                                        </div>

                                        {expandedSeller === seller._id ? (
                                            <ChevronUp size={24} color="var(--text-secondary)" />
                                        ) : (
                                            <ChevronDown size={24} color="var(--text-secondary)" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Books List */}
                            {expandedSeller === seller._id && (
                                <div style={{ borderTop: '1px solid var(--border)', padding: '1.5rem', background: 'var(--background)' }}>
                                    {seller.books.length === 0 ? (
                                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                                            No books in inventory
                                        </p>
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                            {seller.books.map((book) => (
                                                <div key={book._id} style={{ 
                                                    background: 'white', 
                                                    borderRadius: '0.5rem', 
                                                    padding: '1rem',
                                                    border: '1px solid var(--border)'
                                                }}>
                                                    <img 
                                                        src={book.image} 
                                                        alt={book.title} 
                                                        style={{ 
                                                            width: '100%', 
                                                            height: '150px', 
                                                            objectFit: 'cover', 
                                                            borderRadius: '0.25rem',
                                                            marginBottom: '0.75rem'
                                                        }} 
                                                    />
                                                    <h4 style={{ 
                                                        fontSize: '0.9rem', 
                                                        fontWeight: '600', 
                                                        marginBottom: '0.25rem',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {book.title}
                                                    </h4>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                        by {book.author}
                                                    </p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>
                                                            ₹{book.price.toFixed(2)}
                                                        </span>
                                                        <span style={{ 
                                                            fontSize: '0.75rem', 
                                                            padding: '0.25rem 0.5rem', 
                                                            background: book.countInStock > 0 ? '#dcfce7' : '#fee2e2',
                                                            color: book.countInStock > 0 ? '#166534' : '#991b1b',
                                                            borderRadius: '0.25rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            {book.countInStock} in stock
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminSellersInventory;
