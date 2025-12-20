import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Check, X, Edit, Plus } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('/api/users', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                addToast('Error fetching users', 'error');
                setLoading(false);
            }
        };
        fetchUsers();
    }, [user.token, addToast]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setUsers(users.filter(u => u._id !== id));
                addToast('User deleted successfully', 'success');
            } catch (error) {
                console.error(error);
                addToast('Error deleting user', 'error');
            }
        }
    };

    const createUserHandler = () => {
        navigate('/admin/user/new');
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1>Users</h1>
                    <p>Manage registered users</p>
                </div>
                <button className="btn btn-primary" onClick={createUserHandler}>
                    <Plus size={20} />
                    Create User
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ROLE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((userItem) => (
                            <tr key={userItem._id}>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                    {userItem._id.substring(0, 8)}...
                                </td>
                                <td style={{ fontWeight: '600' }}>{userItem.name}</td>
                                <td>{userItem.email}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {userItem.isAdmin && (
                                            <span style={{ 
                                                background: 'var(--primary)', 
                                                color: 'white', 
                                                padding: '0.25rem 0.5rem', 
                                                borderRadius: '4px', 
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                Admin
                                            </span>
                                        )}
                                        {userItem.isSeller && (
                                            <span style={{ 
                                                background: 'var(--accent)', 
                                                color: 'white', 
                                                padding: '0.25rem 0.5rem', 
                                                borderRadius: '4px', 
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                Seller
                                            </span>
                                        )}
                                        {!userItem.isAdmin && !userItem.isSeller && (
                                            <span style={{ 
                                                background: 'var(--background-alt)', 
                                                color: 'var(--text-secondary)', 
                                                padding: '0.25rem 0.5rem', 
                                                borderRadius: '4px', 
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                border: '1px solid var(--border)'
                                            }}>
                                                User
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link 
                                            to={`/admin/user/${userItem._id}/edit`} 
                                            className="action-btn"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            className="action-btn"
                                            style={{ background: '#ef4444', color: 'white' }}
                                            onClick={() => deleteHandler(userItem._id)}
                                            title="Delete"
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

export default UserList;
