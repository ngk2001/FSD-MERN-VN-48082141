import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

import { useToast } from '../context/ToastContext';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const { data } = await axios.get('/api/users/wishlist', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setWishlist(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const removeFromWishlistHandler = async (id) => {
        try {
            await axios.delete(`/api/users/wishlist/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setWishlist(wishlist.filter((item) => item._id !== id));
            addToast('Removed from wishlist', 'success');
        } catch (error) {
            addToast('Error removing from wishlist', 'error');
        }
    };

    const addToCartHandler = (book) => {
        addToCart({
            product: book._id,
            name: book.title,
            image: book.image,
            price: book.price,
            countInStock: book.countInStock,
            qty: 1,
            format: 'Paperback'
        });
        addToast('Added to cart!', 'success');
    };

    if (!user) return <div className="container">Please login to view wishlist</div>;
    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="container wishlist-page">
            <h1 className="page-title">My Wishlist</h1>
            {wishlist.length === 0 ? (
                <div className="cart-empty-state">
                    <Heart size={64} className="empty-cart-icon" />
                    <h2>Your wishlist is empty</h2>
                    <Link to="/" className="btn btn-primary">Browse Books</Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlist.map((book) => (
                        <div key={book._id} className="card book-card">
                            <Link to={`/book/${book._id}`}>
                                <img src={book.image} alt={book.title} className="book-image" />
                            </Link>
                            <div className="book-info">
                                <Link to={`/book/${book._id}`}>
                                    <h3 className="book-title">{book.title}</h3>
                                </Link>
                                <p className="book-author">by {book.author}</p>
                                <div className="book-price-row">
                                    <span className="book-price">${book.price}</span>
                                    <div className="wishlist-actions">
                                        <button
                                            onClick={() => addToCartHandler(book)}
                                            className="btn-icon"
                                            title="Add to Cart"
                                        >
                                            <ShoppingCart size={20} />
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlistHandler(book._id)}
                                            className="btn-icon delete-btn"
                                            title="Remove"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
