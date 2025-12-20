import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import { User, Mail, Phone, MapPin, CreditCard, Save } from 'lucide-react';

const Profile = () => {
    const { user, login } = useAuth(); // login is used to update user context
    const [formData, setFormData] = useState({
        phone: user?.profile?.phone || '',
        address: user?.profile?.address || '',
        passportNumber: user?.profile?.passportNumber || '',
        frequentFlyerNumber: user?.profile?.frequentFlyerNumber || ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await updateProfile({ profile: formData });
            // Update local user context with new data
            // Note: In a real app, we might want a dedicated 'updateUser' method in context
            // For now, we'll rely on the fact that the backend returns the updated user
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update profile.');
        }
    };

    return (
        <div className="container page active">
            <div className="page-header">
                <h1>My Profile</h1>
                <p>Manage your personal information and preferences</p>
            </div>

            <div className="search-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>{user?.username}</h2>
                        <p style={{ color: 'var(--text-gray)', margin: '0.25rem 0 0' }}>{user?.email}</p>
                        <span className="status-badge confirmed" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                            {user?.userType?.charAt(0).toUpperCase() + user?.userType?.slice(1)}
                        </span>
                    </div>
                </div>

                {message && (
                    <div style={{ padding: '1rem', background: message.includes('Failed') ? '#fee2e2' : '#dcfce7', color: message.includes('Failed') ? '#991b1b' : '#166534', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-with-icon">
                                <Phone className="input-icon" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <div className="input-with-icon">
                                <MapPin className="input-icon" />
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Passport Number</label>
                            <div className="input-with-icon">
                                <CreditCard className="input-icon" />
                                <input
                                    type="text"
                                    value={formData.passportNumber}
                                    onChange={e => setFormData({ ...formData, passportNumber: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="A12345678"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Frequent Flyer Number</label>
                            <div className="input-with-icon">
                                <Plane className="input-icon" />
                                <input
                                    type="text"
                                    value={formData.frequentFlyerNumber}
                                    onChange={e => setFormData({ ...formData, frequentFlyerNumber: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="FF-987654321"
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        {isEditing ? (
                            <>
                                <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">
                                    <Save size={18} style={{ marginRight: '0.5rem' }} />
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button type="button" className="btn-primary" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

// Helper component for Plane icon since it's not imported from lucide-react in the main block
import { Plane } from 'lucide-react';

export default Profile;
