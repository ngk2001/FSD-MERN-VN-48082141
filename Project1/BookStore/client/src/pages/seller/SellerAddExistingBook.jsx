import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Plus, Search, ArrowLeft, X } from 'lucide-react';

const AddBookModal = ({ isOpen, onClose, onConfirm, book, initialPrice }) => {
    const [price, setPrice] = useState(initialPrice);
    const [stock, setStock] = useState(10);

    useEffect(() => {
        if (isOpen && book) {
            setPrice(book.price);
            setStock(10);
        }
    }, [isOpen, book]);

    if (!isOpen || !book) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (price < 150 || price > 450) {
            alert('Price must be between ₹150 and ₹450');
            return;
        }
        onConfirm(book._id, price, stock);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', margin: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Add to Inventory</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={book.image} alt={book.title} style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{book.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Original Price: ₹{book.price}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Your Selling Price (₹)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            min="150"
                            max="450"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Stock Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            min="0"
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            Confirm Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SellerAddExistingBook = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [addingBookId, setAddingBookId] = useState(null);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Business'];

    useEffect(() => {
        if (user) {
            fetchAvailableBooks();
        }
    }, [user]);

    useEffect(() => {
        filterBooks();
    }, [searchTerm, selectedGenre, books]);

    const fetchAvailableBooks = async () => {
        try {
            const { data } = await axios.get('/api/seller-books/available', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setBooks(data);
            setFilteredBooks(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            addToast('Error fetching available books', 'error');
            setLoading(false);
        }
    };

    const filterBooks = () => {
        let filtered = [...books];

        if (searchTerm) {
            filtered = filtered.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedGenre) {
            filtered = filtered.filter(book => book.genre === selectedGenre);
        }

        setFilteredBooks(filtered);
    };

    const openAddModal = (book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const handleConfirmAdd = async (bookId, price, stock) => {
        setIsModalOpen(false);
        setAddingBookId(bookId);

        try {
            await axios.post('/api/seller-books', {
                bookId,
                price: parseFloat(price),
                countInStock: parseInt(stock)
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            addToast('Book added to your inventory successfully!', 'success');
            
            // Remove the added book from the list
            setBooks(books.filter(b => b._id !== bookId));
            setFilteredBooks(filteredBooks.filter(b => b._id !== bookId));
        } catch (error) {
            console.error(error);
            addToast(error.response?.data?.message || 'Error adding book to inventory', 'error');
        } finally {
            setAddingBookId(null);
            setSelectedBook(null);
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
            <AddBookModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={handleConfirmAdd}
                book={selectedBook}
            />

            <div style={{ marginBottom: '2rem' }}>
                <button 
                    onClick={() => navigate('/seller/books')} 
                    className="btn btn-outline"
                    style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <ArrowLeft size={20} />
                    Back to My Books
                </button>
                <h1 className="page-title">Add Existing Book to Inventory</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Browse and add books from our catalog to your inventory
                </p>
            </div>

            {/* Filters */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: '1.5rem' 
                }}>
                    <div>
                        <label style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.75rem', 
                            fontWeight: '600',
                            color: 'var(--text)',
                            fontSize: '0.95rem'
                        }}>
                            <Search size={18} style={{ color: 'var(--primary)' }} />
                            Search Books
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    border: '2px solid var(--border)',
                                    borderRadius: '0.75rem',
                                    fontSize: '1rem',
                                    background: 'var(--background)',
                                    color: 'var(--text)',
                                    transition: 'var(--transition)',
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--primary)';
                                    e.target.style.background = 'white';
                                    e.target.style.boxShadow = '0 0 0 4px rgba(13, 148, 136, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--border)';
                                    e.target.style.background = 'var(--background)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <Search 
                                size={18} 
                                style={{ 
                                    position: 'absolute', 
                                    left: '1rem', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)',
                                    pointerEvents: 'none'
                                }} 
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.75rem', 
                            fontWeight: '600',
                            color: 'var(--text)',
                            fontSize: '0.95rem'
                        }}>
                            Filter by Genre
                        </label>
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '2px solid var(--border)',
                                borderRadius: '0.75rem',
                                fontSize: '1rem',
                                background: 'var(--background)',
                                color: 'var(--text)',
                                transition: 'var(--transition)',
                                outline: 'none',
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                                appearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '20px',
                                paddingRight: '3rem'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--primary)';
                                e.target.style.background = 'white';
                                e.target.style.boxShadow = '0 0 0 4px rgba(13, 148, 136, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'var(--border)';
                                e.target.style.background = 'var(--background)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <option value="">All Genres</option>
                            {genres.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Books Grid */}
            {filteredBooks.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        {books.length === 0 
                            ? 'No books available to add. You have already added all available books!' 
                            : 'No books match your search criteria.'}
                    </p>
                    {books.length === 0 && (
                        <button onClick={() => navigate('/seller/add-book')} className="btn btn-primary">
                            Create New Book
                        </button>
                    )}
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '1.5rem' 
                }}>
                    {filteredBooks.map((book) => (
                        <div key={book._id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <img 
                                src={book.image} 
                                alt={book.title} 
                                style={{ 
                                    width: '100%', 
                                    height: '300px', 
                                    objectFit: 'cover' 
                                }} 
                            />
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ 
                                    fontSize: '1.1rem', 
                                    fontWeight: '700', 
                                    marginBottom: '0.5rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {book.title}
                                </h3>
                                <p style={{ 
                                    color: 'var(--text-secondary)', 
                                    fontSize: '0.9rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    by {book.author}
                                </p>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginBottom: '1rem'
                                }}>
                                    <span style={{ 
                                        padding: '0.25rem 0.75rem', 
                                        background: 'var(--primary-light)', 
                                        color: 'var(--primary)', 
                                        borderRadius: '1rem', 
                                        fontSize: '0.85rem',
                                        fontWeight: '600'
                                    }}>
                                        {book.genre}
                                    </span>
                                    <span style={{ 
                                        fontSize: '1.25rem', 
                                        fontWeight: '700', 
                                        color: 'var(--primary)' 
                                    }}>
                                        ₹{book.price}
                                    </span>
                                </div>
                                <p style={{ 
                                    color: 'var(--text-secondary)', 
                                    fontSize: '0.85rem',
                                    marginBottom: '1rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {book.description}
                                </p>
                                <button
                                    onClick={() => openAddModal(book)}
                                    disabled={addingBookId === book._id}
                                    className="btn btn-primary"
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    {addingBookId === book._id ? (
                                        'Adding...'
                                    ) : (
                                        <>
                                            <Plus size={20} />
                                            Add to My Inventory
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerAddExistingBook;
