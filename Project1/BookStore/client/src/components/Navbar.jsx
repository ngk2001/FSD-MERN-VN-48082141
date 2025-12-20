import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, BookOpen, LogOut, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();

    const [keyword, setKeyword] = React.useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/?keyword=${keyword}`);
        } else {
            navigate('/');
        }
    };

    const handleLogout = () => {
        setKeyword(''); // Clear search on logout
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <BookOpen size={24} />
                    BookStore
                </Link>

                <form onSubmit={submitHandler} className="nav-search">
                    <input 
                        type="text" 
                        name="search" 
                        placeholder="Search books..." 
                        className="nav-search-input"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </form>

                <ul className="nav-links">
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Home
                        </NavLink>
                    </li>
                    {user && user.isSeller && !user.isAdmin && (
                        <>
                            <li>
                                <NavLink to="/seller/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                    <ShoppingCart size={20} />
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/seller/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                    <ShoppingCart size={20} />
                                    My Sales
                                </NavLink>
                            </li>
                        </>
                    )}
                    {user && !user.isSeller && !user.isAdmin && (
                        <>
                            <li>
                                <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                    <div className="cart-icon-wrapper">
                                        <ShoppingCart size={20} />
                                        {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                                    </div>
                                    Cart
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/wishlist" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                    <Heart size={20} />
                                    Wishlist
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/myorders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                    <ShoppingCart size={20} />
                                    My Orders
                                </NavLink>
                            </li>
                        </>
                    )}
                    {user ? (
                        <>
                            {user.isAdmin && (
                                <>
                                    <li>
                                        <NavLink to="/admin/booklist" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                            Books
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/admin/orderlist" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                            Orders
                                        </NavLink>
                                    </li>
                                </>
                            )}
                            <li>
                                <NotificationBell />
                            </li>
                            <li className="user-info">
                                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none', width: '100%', height: '100%' }}>
                                    <User size={20} />
                                    <span>{user.name}</span>
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="nav-link btn-link">
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                <User size={20} />
                                Login
                            </NavLink>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
