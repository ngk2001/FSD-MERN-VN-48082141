import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [wantsToBeSeller, setWantsToBeSeller] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { login } = useContext(AuthContext);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            addToast('Passwords do not match', 'error');
            return;
        }

        try {
            const { data } = await axios.post('/api/users', { 
                name, 
                email, 
                password,
                sellerRequest: wantsToBeSeller ? 'pending' : 'none'
            });
            login(data);
            if (wantsToBeSeller) {
                addToast('Registration successful! Your seller request is pending approval.', 'success');
            } else {
                addToast('Registration successful!', 'success');
            }
            navigate('/');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            addToast(errorMsg, 'error');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join BookStore today</p>
                </div>
                <form onSubmit={submitHandler} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={20} />
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="password-toggle"
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group" style={{ 
                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                        padding: '1.5rem',
                        borderRadius: '0.75rem',
                        border: '2px solid #bfdbfe',
                        marginBottom: '1.5rem'
                    }}>
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: '0.75rem',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: 'var(--text)',
                            margin: 0
                        }}>
                            <input
                                type="checkbox"
                                checked={wantsToBeSeller}
                                onChange={(e) => setWantsToBeSeller(e.target.checked)}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    accentColor: 'var(--primary)',
                                    marginTop: '2px'
                                }}
                            />
                            <div>
                                <div>I want to become a seller</div>
                                <div style={{ 
                                    fontSize: '0.85rem', 
                                    fontWeight: '400', 
                                    color: 'var(--text-secondary)',
                                    marginTop: '0.25rem'
                                }}>
                                    Your request will be reviewed by our admin team
                                </div>
                            </div>
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">
                        <UserPlus size={20} />
                        Register
                    </button>
                </form>
                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
