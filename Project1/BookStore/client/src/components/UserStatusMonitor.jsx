import { useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserStatusMonitor = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.isAdmin) return;

        const checkUserStatus = async () => {
            try {
                const { data } = await axios.get('/api/users/profile', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                // Check if seller status changed
                if (data.isSeller !== user.isSeller) {
                    updateUser({ isSeller: data.isSeller, sellerRequest: data.sellerRequest });
                    
                    // If user just became a seller, redirect to seller dashboard
                    if (data.isSeller && !user.isSeller) {
                        navigate('/seller/dashboard');
                    }
                }

                // Check if admin status changed
                if (data.isAdmin !== user.isAdmin) {
                    updateUser({ isAdmin: data.isAdmin });
                    
                    // If user just became admin, redirect to admin dashboard
                    if (data.isAdmin && !user.isAdmin) {
                        navigate('/admin/dashboard');
                    }
                }
            } catch (error) {
                console.error('Error checking user status:', error);
            }
        };

        // Check immediately
        checkUserStatus();

        // Then check every 10 seconds
        const interval = setInterval(checkUserStatus, 10000);

        return () => clearInterval(interval);
    }, [user, updateUser, navigate]);

    return null; // This component doesn't render anything
};

export default UserStatusMonitor;
