import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, User, Mail, Lock, Loader2 } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }) => {
    const [isLogin, setIsLogin] = useState(defaultMode === 'login');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    // Update mode when defaultMode prop changes
    useEffect(() => {
        if (isOpen) {
            setIsLogin(defaultMode === 'login');
            setError('');
            setFormData({ username: '', email: '', password: '' });
        }
    }, [isOpen, defaultMode]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;
            if (isLogin) {
                result = await login(formData.email, formData.password);
            } else {
                if (!formData.username.trim()) {
                    setError('Username is required');
                    setLoading(false);
                    return;
                }
                result = await register(formData.username, formData.email, formData.password);
            }

            if (result.success) {
                onClose();
                setFormData({ username: '', email: '', password: '' });
                
                // Redirect admin to admin panel
                if (result.userType === 'admin') {
                    navigate('/admin');
                }
            } else {
                setError(result.error || 'An error occurred');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Auth error:', err);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ username: '', email: '', password: '' });
    };

    return (
        <div className="modal active">
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="modal-subtitle">
                    {isLogin ? 'Login to your account' : 'Join FlightHub today'}
                </p>

                {error && (
                    <div className="error-message" style={{ 
                        background: '#fee2e2', 
                        color: '#dc2626', 
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Username</label>
                            <div className="input-with-icon">
                                <User className="input-icon" />
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required={!isLogin}
                                    placeholder="Enter your username"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email</label>
                        <div className="input-with-icon">
                            <Mail className="input-icon" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="Enter your email"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon" />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={6}
                                placeholder="Enter your password"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary btn-block" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="spinning" size={20} style={{ marginRight: '0.5rem' }} />
                                {isLogin ? 'Logging in...' : 'Creating account...'}
                            </>
                        ) : (
                            isLogin ? 'Login' : 'Sign Up'
                        )}
                    </button>
                </form>

                <div className="modal-footer">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <a href="#" onClick={(e) => { e.preventDefault(); switchMode(); }}>
                        {isLogin ? 'Sign up' : 'Login'}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
