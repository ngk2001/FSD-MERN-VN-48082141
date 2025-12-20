import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { User, Mail, Lock, Save, TrendingUp } from 'lucide-react';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [sellerRequest, setSellerRequest] = useState('none');

    const navigate = useNavigate();
    const { user, login } = useContext(AuthContext);
    const { addToast } = useToast();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setName(user.name);
            setEmail(user.email);
            fetchUserDetails();
        }
    }, [navigate, user]);

    const fetchUserDetails = async () => {
        try {
            const { data } = await axios.get('/api/users/profile', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setSellerRequest(data.sellerRequest || 'none');
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };


    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Input validation
        if (name.trim().length < 2) {
            const msg = 'Name must be at least 2 characters';
            setMessage(msg);
            addToast(msg, 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const msg = 'Please enter a valid email address';
            setMessage(msg);
            addToast(msg, 'error');
            return;
        }
        
        // Password validation (only if changing password)
        if (password && password.length > 0) {
            if (password.length < 6) {
                const msg = 'Password must be at least 6 characters';
                setMessage(msg);
                addToast(msg, 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                setMessage('Passwords do not match');
                addToast('Passwords do not match', 'error');
                return;
            }
        }
        
        try {
            const updateData = { id: user._id, name: name.trim(), email: email.trim() };
            // Only send password if it's being changed
            if (password && password.length > 0) {
                updateData.password = password;
            }
            
            const { data } = await axios.put(
                '/api/users/profile',
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            
            login(data);
            addToast('Profile updated successfully', 'success');
            setMessage(null);
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            setMessage(errorMsg);
            addToast(errorMsg, 'error');
        }
    };

    const requestSellerStatus = async () => {
        try {
            const { data } = await axios.put(
                '/api/users/profile',
                { sellerRequest: 'pending' },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            setSellerRequest('pending');
            
            // Notify admins about the seller request
            await axios.post('/api/notifications/notify-admins', {
                type: 'seller_request',
                title: 'New Seller Request',
                message: `${user.name} (${user.email}) has requested to become a seller.`,
                relatedUserId: user._id
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            
            addToast('Seller request submitted successfully', 'success');
        } catch (error) {
            addToast('Error submitting seller request', 'error');
        }
    };

    const getSellerStatusMessage = () => {
        if (user?.isSeller) {
            return (
                <div style={{ padding: '1rem', background: '#d1fae5', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                    <p style={{ color: '#065f46', fontWeight: '600' }}>✓ You are an approved seller</p>
                </div>
            );
        }

        switch (sellerRequest) {
            case 'pending':
                return (
                    <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                        <p style={{ color: '#92400e', fontWeight: '600' }}>⏳ Your seller request is pending approval</p>
                    </div>
                );
            case 'rejected':
                return (
                    <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                        <p style={{ color: '#991b1b', fontWeight: '600' }}>✗ Your seller request was rejected</p>
                        <button 
                            onClick={requestSellerStatus}
                            className="btn btn-sm btn-outline"
                            style={{ marginTop: '0.5rem' }}
                        >
                            Request Again
                        </button>
                    </div>
                );
            default:
                return (
                    <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                        <p style={{ color: '#1e40af', marginBottom: '0.5rem' }}>Want to become a seller?</p>
                        <button 
                            onClick={requestSellerStatus}
                            className="btn btn-sm btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <TrendingUp size={16} />
                            Request Seller Status
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>User Profile</h2>
                    <p>Update your personal information</p>
                </div>

                {getSellerStatusMessage()}

                {message && <div className="error-message" style={{ padding: '1rem', marginBottom: '1.5rem' }}>{message}</div>}

                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">
                        <Save size={20} />
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
