import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const BookCard = ({ book }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const { addToast } = useToast();

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigation to book details if clicking button
        if (!user) {
            addToast('Please login or register to purchase and add to cart', 'info');
            navigate('/login');
            return;
        }
        addToCart({
            product: book._id,
            name: book.title,
            image: book.image,
            price: book.price,
            countInStock: book.countInStock,
            qty: 1,
            format: 'Paperback'
        });
        addToast('Book added to cart!', 'success');
    };

    return (
        <div className="card book-card">
            <Link to={`/book/${book._id}`}>
                <img src={book.image} alt={book.title} className="book-image" />
            </Link>
            <div className="book-info">
                <Link to={`/book/${book._id}`}>
                    <h3 className="book-title">{book.title}</h3>
                </Link>
                <p className="book-author">by {book.author}</p>
                {book.user && book.user.name && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Sold by: {book.user.name}
                    </p>
                )}

                <div className="book-rating">
                    <span className="rating-value">{book.rating}</span>
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    <span className="review-count">({book.numReviews})</span>
                </div>

                <div className="book-price-row">
                    <span className="book-price">₹{Number(book.price).toFixed(2)}</span>
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={handleAddToCart}
                        disabled={book.countInStock === 0}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', height: 'auto' }}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
