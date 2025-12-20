import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

import { useToast } from '../context/ToastContext';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

    const checkoutHandler = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/shipping');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container cart-empty-state">
                <ShoppingBag size={64} className="empty-cart-icon" />
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any books to your cart yet.</p>
                <Link to="/" className="btn btn-primary">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container cart-page">
            <h1 className="page-title">Shopping Cart</h1>

            <div className="cart-grid">
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.product} className="cart-item">
                            <img src={item.image} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-info">
                                <Link to={`/book/${item.product}`} className="cart-item-title">
                                    {item.name}
                                </Link>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0' }}>
                                    Format: {item.format || 'Paperback'}
                                </p>
                                <p className="cart-item-price">₹{Number(item.price).toFixed(2)}</p>
                            </div>
                            <div className="cart-item-actions">
                                <button
                                    onClick={() => removeFromCart(item.product)}
                                    className="btn-icon delete-btn"
                                    aria-label="Remove item"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button onClick={clearCart} className="clear-cart-btn">
                        Clear Cart
                    </button>
                </div>

                <div className="cart-summary">
                    <div className="summary-card">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                        <button
                            onClick={checkoutHandler}
                            className="btn btn-primary btn-block checkout-btn"
                        >
                            Proceed to Checkout
                        </button>
                        <Link to="/" className="continue-shopping">
                            <ArrowLeft size={16} /> Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
