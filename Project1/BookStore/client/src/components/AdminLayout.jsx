import React, { useContext } from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    const { user, loading } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    if (loading) {
        return <div className="loader">Loading...</div>;
    }

    if (!user || !user.isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="admin-layout">
            <div className={`admin-sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)} />
            
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            <div className="admin-content">
                <div className="admin-mobile-header">
                    <button className="admin-menu-btn" onClick={() => setIsSidebarOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <div className="admin-mobile-logo">
                        <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
                            <span style={{ fontWeight: '800', fontSize: '1.25rem', fontFamily: 'Playfair Display, serif', color: 'var(--primary)' }}>BookStore</span>
                        </Link>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
