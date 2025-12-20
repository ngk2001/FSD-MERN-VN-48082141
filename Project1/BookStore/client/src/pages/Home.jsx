import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import BookCard from '../Components/BookCard';
import { Search, X, Filter } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword') || '';
    const genre = queryParams.get('genre') || '';

    // Redirect admin and sellers to their dashboards - they should not see the home page
    useEffect(() => {
        if (user) {
            if (user.isAdmin) {
                navigate('/admin/dashboard');
            } else if (user.isSeller) {
                navigate('/seller/dashboard');
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                let url = `/api/books?keyword=${keyword}`;
                if (genre) {
                    url += `&genre=${genre}`;
                }
                const { data } = await axios.get(url);
                setBooks(data);
                
                // Extract unique categories from all books (or fetch from API if available)
                // For now, we'll just extract from the fetched books if no genre is selected, 
                // or we could have a static list.
                if (!genre && !keyword) {
                    const uniqueGenres = [...new Set(data.map(book => book.genre))];
                    setCategories(uniqueGenres);
                }
                
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBooks();
    }, [keyword, genre]);

    const handleCategoryClick = (cat) => {
        if (cat === genre) {
            navigate('/');
        } else {
            navigate(`/?genre=${cat}`);
        }
    };

    return (
        <div className="home-page">
            <div className="hero-section">
                <div className="container hero-content">
                    <h1>Discover Your Next Favorite Book</h1>
                    <p>Explore our vast collection of bestsellers, classics, and hidden gems.</p>
                </div>
            </div>

            <div className="container">
                {/* Categories Section */}
                <div className="categories-section" style={{ marginBottom: '3rem' }}>
                    <div className="section-header">
                        <h2>Shop by Category</h2>
                        <div className="divider"></div>
                    </div>
                    <div className="categories-flex" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button 
                            className={`btn ${!genre ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => navigate('/')}
                        >
                            All
                        </button>
                        {['Fiction', 'Non-Fiction', 'Science', 'History', 'Children', 'Biography', 'Business'].map((cat) => (
                            <button
                                key={cat}
                                className={`btn ${genre === cat ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => handleCategoryClick(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="section-header">
                    <h2>{keyword ? `Search Results for "${keyword}"` : genre ? `${genre} Books` : 'Featured Books'}</h2>
                    <div className="divider"></div>
                </div>

                {loading ? (
                    <div className="loader">Loading...</div>
                ) : error ? (
                    <div className="error-message">Error: {error}</div>
                ) : books.length === 0 ? (
                    <div className="no-results" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        <h3>No books found</h3>
                        <p>Try adjusting your search or filter to find what you're looking for.</p>
                        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            View All Books
                        </button>
                    </div>
                ) : (
                    <div className="books-grid">
                        {books.map((book) => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
