import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingCart, ArrowLeft, Quote, BookOpen, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const { data } = await axios.get(`/api/books/${id}`);
                setBook(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    const handleAddToCart = () => {
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
            format: selectedFormat
        });
        addToast('Book added to cart!', 'success');
    };

    const handleAddToWishlist = async () => {
        if (!user) {
            addToast('Please login to add to wishlist', 'info');
            navigate('/login');
            return;
        }
        try {
            await axios.post(`/api/users/wishlist/${id}`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            addToast('Added to wishlist!', 'success');
        } catch (err) {
            addToast(err.response?.data?.message || err.message, 'error');
        }
    };

    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [selectedFormat, setSelectedFormat] = useState('Paperback');

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `/api/books/${id}/reviews`,
                { rating, comment },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            addToast('Review submitted!', 'success');
            setRating('');
            setComment('');
            // Refresh book details
            const { data } = await axios.get(`/api/books/${id}`);
            setBook(data);
        } catch (err) {
            addToast(err.response?.data?.message || err.message, 'error');
        }
    };

    const [showPreview, setShowPreview] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    if (loading) return <div className="loader">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!book) return <div className="error-message">Book not found</div>;

    return (
        <div className="container book-details-page">
            <button onClick={() => navigate(-1)} className="back-btn">
                <ArrowLeft size={20} /> Back to Books
            </button>

            <div className="book-details-grid">
                <div className="book-cover-section">
                    <img src={book.image} alt={book.title} className="detail-image" />
                </div>

                <div className="book-info-section">
                    <h1 className="detail-title">{book.title}</h1>
                    <p className="detail-author">by {book.author}</p>

                    <div className="detail-rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={20}
                                    fill={i < Math.floor(book.rating) ? "#fbbf24" : "none"}
                                    color="#fbbf24"
                                />
                            ))}
                        </div>
                        <span className="rating-text">{book.rating} ({book.numReviews} reviews)</span>
                    </div>

                    <div className="detail-price-box">
                        <span className="detail-price">₹{book.price}</span>
                        <span className={`stock-status ${book.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {book.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)' }}>
                            Format <span style={{ fontWeight: '400', fontSize: '0.85rem', color: 'var(--text-muted)' }}>(Select your preferred book format)</span>
                        </label>
                        <select
                            value={selectedFormat}
                            onChange={(e) => setSelectedFormat(e.target.value)}
                            className="form-control"
                            style={{ 
                                maxWidth: '200px',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '2px solid var(--primary)',
                                backgroundColor: 'var(--background)',
                                color: 'var(--text)',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                outline: 'none',
                                fontWeight: '500'
                            }}
                        >
                            {book.formats && book.formats.length > 0 ? (
                                book.formats.map(fmt => (
                                    <option key={fmt.name} value={fmt.name}>
                                        {fmt.name} {fmt.price ? `(₹${fmt.price})` : ''}
                                    </option>
                                ))
                            ) : (
                                <>
                                    <option value="Paperback">Paperback</option>
                                    <option value="E-book">E-book</option>
                                    <option value="Hardcover">Hardcover</option>
                                </>
                            )}
                        </select>
                    </div>

                    <p className="detail-description">{book.description}</p>

                    <div className="detail-actions">
                        <button
                            onClick={handleAddToCart}
                            className="btn btn-outline btn-lg"
                            disabled={book.countInStock === 0}
                        >
                            <ShoppingCart size={20} />
                            Add to Cart
                        </button>
                        <button
                            onClick={() => {
                                if (!user) {
                                    addToast('Please login to purchase', 'info');
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
                                    format: selectedFormat
                                });
                                navigate('/placeorder');
                            }}
                            className="btn btn-primary btn-lg"
                            disabled={book.countInStock === 0}
                        >
                            Buy Now
                        </button>
                        <button
                            onClick={handleAddToWishlist}
                            className="btn btn-outline btn-lg"
                            title="Add to Wishlist"
                        >
                            <Heart size={20} />
                        </button>
                        {book.samplePages && book.samplePages.length > 0 && (
                            <button
                                onClick={() => setShowPreview(true)}
                                className="btn btn-secondary btn-lg"
                            >
                                <BookOpen size={20} />
                                Preview
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{book.title} - Preview</h2>
                            <button onClick={() => setShowPreview(false)} className="close-btn">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="page-content">
                                <p style={{ whiteSpace: 'pre-line' }}>{book.samplePages[currentPage]}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="btn btn-outline"
                            >
                                Previous Page
                            </button>
                            <span>Page {currentPage + 1} of {book.samplePages.length}</span>
                            <button
                                disabled={currentPage === book.samplePages.length - 1}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="btn btn-primary"
                            >
                                Next Page
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="book-extra-content">
                {book.quotes && book.quotes.length > 0 && (
                    <div className="quotes-section">
                        <h3><Quote size={24} /> Memorable Quotes</h3>
                        <div className="quotes-grid">
                            {book.quotes.map((quote, index) => (
                                <div key={index} className="quote-card">
                                    <p>"{quote}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="reviews-section">
                <h3>Reviews ({book.numReviews})</h3>
                {book.reviews.length === 0 && <div className="no-reviews">No reviews yet</div>}

                <div className="reviews-list">
                    {book.reviews.map((review) => (
                        <div key={review._id} className="review-card">
                            <div className="review-header">
                                <strong>{review.name}</strong>
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill={i < review.rating ? "#fbbf24" : "none"}
                                            color="#fbbf24"
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="review-date">{review.createdAt.substring(0, 10)}</p>
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    ))}
                </div>

                <div className="write-review">
                    <h3>Write a Customer Review</h3>
                    {user ? (
                        <form onSubmit={submitReviewHandler}>
                            <div className="form-group">
                                <label>Rating</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="">Select...</option>
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Comment</label>
                                <textarea
                                    row="3"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="form-control"
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </form>
                    ) : (
                        <div className="alert-info">
                            Please <a href="/login">sign in</a> to write a review
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
