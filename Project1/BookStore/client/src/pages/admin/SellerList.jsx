import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, CheckCircle, XCircle, Trash2, Clock } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const SellerList = () => {
    const [sellers, setSellers] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();

    useEffect(() => {
        fetchSellers();
    }, [user.token]);

    const fetchSellers = async () => {
        try {
            const { data } = await axios.get('/api/users', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            
            const approvedSellers = data.filter(u => u.isSeller);
            const pending = data.filter(u => u.sellerRequest === 'pending');
            
            setSellers(approvedSellers);
            setPendingRequests(pending);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const approveSellerRequest = async (userId) => {
        try {
            await axios.put(`/api/users/${userId}`, 
                { isSeller: true, sellerRequest: 'approved' },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            addToast('Seller request approved', 'success');
            fetchSellers();
        } catch (error) {
            addToast('Error approving seller request', 'error');
        }
    };

    const rejectSellerRequest = async (userId) => {
        try {
            await axios.put(`/api/users/${userId}`, 
                { sellerRequest: 'rejected' },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            addToast('Seller request rejected', 'success');
            fetchSellers();
        } catch (error) {
            addToast('Error rejecting seller request', 'error');
        }
    };

    const removeSeller = async (userId) => {
        if (window.confirm('Are you sure you want to remove seller status?')) {
            try {
                await axios.put(`/api/users/${userId}`, 
                    { isSeller: false, sellerRequest: 'none' },
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                addToast('Seller status removed', 'success');
                fetchSellers();
            } catch (error) {
                addToast('Error removing seller', 'error');
            }
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div>
            <div className="admin-header">
                <h1>Manage Sellers</h1>
                <p>Approve seller requests and manage approved sellers</p>
            </div>

            {pendingRequests.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700', color: 'var(--warning)' }}>
                        Pending Seller Requests ({pendingRequests.length})
                    </h2>
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.map((request) => (
                                    <tr key={request._id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                            {request._id.substring(0, 8)}...
                                        </td>
                                        <td style={{ fontWeight: '600' }}>{request.name}</td>
                                        <td>{request.email}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => approveSellerRequest(request._id)}
                                                    className="action-btn"
                                                    style={{ background: 'var(--success)', color: 'white' }}
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => rejectSellerRequest(request._id)}
                                                    className="action-btn"
                                                    style={{ background: '#ef4444', color: 'white' }}
                                                    title="Reject"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
                    Approved Sellers ({sellers.length})
                </h2>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Admin</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellers.map((seller) => (
                                <tr key={seller._id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                        {seller._id.substring(0, 8)}...
                                    </td>
                                    <td style={{ fontWeight: '600' }}>{seller.name}</td>
                                    <td>{seller.email}</td>
                                    <td>
                                        {seller.isAdmin ? (
                                            <span style={{ color: 'var(--success)' }}>
                                                <CheckCircle size={16} />
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>
                                                <XCircle size={16} />
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link to={`/admin/user/${seller._id}/edit`} className="action-btn" title="Edit">
                                                <Eye size={18} />
                                            </Link>
                                            <button
                                                onClick={() => removeSeller(seller._id)}
                                                className="action-btn"
                                                style={{ background: '#ef4444', color: 'white' }}
                                                title="Remove Seller Status"
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
        </div>
    );
};

export default SellerList;
