import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Plus, BookPlus } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const SellerBookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Fetch all books and filter by current seller
                // Since we are now cloning books, "inventory" books are just regular books owned by the seller
                const { data: allBooks } = await axios.get('/api/books');
                // book.user is now populated as an object with _id, so we need to compare book.user._id
                const myBooks = allBooks.filter(book => {
                    const bookUserId = typeof book.user === 'object' ? book.user._id : book.user;
                    return bookUserId === user._id;
                });
                setBooks(myBooks);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                addToast('Error fetching books', 'error');
            }
        };

        if (user) {
            fetchBooks();
        }
    }, [user, addToast]);

    const deleteBook = async (id) => {
        if (!user) return;
        if (window.confirm('Are you sure you want to delete this book? This will permanently remove it from your inventory.')) {
            try {
                // Use the seller-books endpoint which handles ownership check and deletion
                await axios.delete(`/api/seller-books/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setBooks(books.filter((b) => b._id !== id));
                addToast('Book deleted successfully', 'success');
            } catch (error) {
                console.error(error);
                addToast('Error deleting book', 'error');
            }
        }
    };

    const updateStockPrice = async (id, currentStock, currentPrice) => {
        if (!user) return;
        const newPrice = prompt(`Update price (current: $${currentPrice}):`, currentPrice);
        if (newPrice === null) return;

        const parsedPrice = parseFloat(newPrice);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            addToast('Please enter a valid price', 'error');
            return;
        }

        const newStock = prompt(`Update stock quantity (current: ${currentStock}):`, currentStock);
        if (newStock === null) return;

        const parsedStock = parseInt(newStock);
        if (isNaN(parsedStock) || parsedStock < 0) {
            addToast('Please enter a valid stock quantity', 'error');
            return;
        }

        try {
            // Use the seller-books endpoint for updates
            const { data } = await axios.put(`/api/seller-books/${id}`, {
                countInStock: parsedStock,
                price: parsedPrice
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            setBooks(books.map(b => b._id === id ? data : b));
            addToast('Book updated successfully', 'success');
        } catch (error) {
            console.error(error);
            addToast('Error updating book', 'error');
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 className="page-title">My Books</h1>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Link to="/seller/add-existing-book" className="btn btn-outline">
                        <BookPlus size={20} />
                        Add Existing Book
                    </Link>
                    <Link to="/seller/add-book" className="btn btn-primary">
                        <Plus size={20} />
                        Create New Book
                    </Link>
                </div>
            </div>

            {books.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You haven't listed any books yet.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/seller/add-existing-book" className="btn btn-outline">Add Existing Book</Link>
                        <Link to="/seller/add-book" className="btn btn-primary">Create New Book</Link>
                    </div>
                </div>
            ) : (
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'var(--background)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Image</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Price</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Stock</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => (
                                    <tr key={book._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <img src={book.image} alt={book.title} style={{ width: '50px', height: '75px', objectFit: 'cover', borderRadius: '4px' }} />
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: '600' }}>{book.title}</td>
                                        <td style={{ padding: '1rem' }}>{book.genre}</td>
                                        <td style={{ padding: '1rem', fontWeight: '700', color: 'var(--primary)' }}>${book.price}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                padding: '0.25rem 0.5rem', 
                                                borderRadius: '1rem', 
                                                fontSize: '0.85rem', 
                                                background: book.countInStock > 0 ? '#dcfce7' : '#fee2e2', 
                                                color: book.countInStock > 0 ? '#166534' : '#991b1b',
                                                fontWeight: '600'
                                            }}>
                                                {book.countInStock > 0 ? `${book.countInStock} in stock` : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button 
                                                    className="btn btn-sm btn-outline" 
                                                    onClick={() => updateStockPrice(book._id, book.countInStock, book.price)}
                                                    title="Quick Update Price & Stock"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline"
                                                    style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                                    onClick={() => deleteBook(book._id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerBookList;
