import React, { useContext } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutList, PlusSquare, LogOut, BookOpen, ShoppingBag, Package } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <Link to="/admin/dashboard" className="sidebar-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <BookOpen size={24} />
                    <span>BookStore</span>
                </Link>
                <button className="sidebar-close-btn" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'} onClick={onClose}>
                    <LayoutList size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/admin/book/new" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'} onClick={onClose}>
                    <PlusSquare size={20} />
                    <span>Add Items</span>
                </NavLink>

                <NavLink to="/admin/booklist" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'} onClick={onClose}>
                    <BookOpen size={20} />
                    <span>List Items</span>
                </NavLink>

                <NavLink to="/admin/sellerlist" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'} onClick={onClose}>
                    <ShoppingBag size={20} />
                    <span>Sellers</span>
                </NavLink>

                <NavLink to="/admin/sellers-inventory" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'} onClick={onClose}>
                    <Package size={20} />
                    <span>Sellers Inventory</span>
                </NavLink>

                <NavLink to="/admin/orderlist" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'} onClick={onClose}>
                    <ShoppingBag size={20} />
                    <span>Orders</span>
                </NavLink>

            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="sidebar-link logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
