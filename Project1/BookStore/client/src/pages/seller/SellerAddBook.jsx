import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Upload, ArrowLeft } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const SellerAddBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Fiction');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [popular, setPopular] = useState(false);
    const [author, setAuthor] = useState('');
    const [countInStock, setCountInStock] = useState(10);

    const [loading, setLoading] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const isNew = !id;

    useEffect(() => {
        if (isNew) {
            setLoading(false);
            return;
        }

        const fetchBook = async () => {
            try {
                const { data } = await axios.get(`/api/books/${id}`);
                // Security check: ensure the book belongs to the seller
                if (data.user !== user._id && !user.isAdmin) {
                    addToast('You are not authorized to edit this book', 'error');
                    navigate('/seller/books');
                    return;
                }
                setTitle(data.title);
                setDescription(data.description);
                setCategory(data.genre);
                setPrice(data.price);
                setImage(data.image);
                setPopular(data.popular || false);
                setAuthor(data.author);
                setCountInStock(data.countInStock);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                addToast('Error fetching book details', 'error');
            }
        };

        if (user) {
            fetchBook();
        }
    }, [id, isNew, user, navigate, addToast]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setLoadingUpdate(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);

            setImage(data);
            setLoadingUpdate(false);
        } catch (error) {
            console.error(error);
            setLoadingUpdate(false);
            addToast('Error uploading image', 'error');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        setLoadingUpdate(true);
        try {
            const bookData = {
                title,
                description,
                genre: category,
                price,
                image,
                popular,
                author,
                countInStock
            };

            if (isNew) {
                await axios.post('/api/books', bookData, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                addToast('Book listed successfully', 'success');
            } else {
                await axios.put(`/api/books/${id}`, bookData, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                addToast('Book updated successfully', 'success');
            }

            setLoadingUpdate(false);
            navigate('/seller/books');
        } catch (error) {
            addToast(error.response?.data?.message || error.message, 'error');
            setLoadingUpdate(false);
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
            <button onClick={() => navigate('/seller/books')} className="btn btn-outline" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={18} /> Back to My Books
            </button>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>
                    {isNew ? 'List New Book' : 'Edit Book'}
                </h1>

                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Book Title</label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter book title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Author</label>
                        <input
                            type="text"
                            className="form-control"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Enter author name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter book description"
                            required
                        ></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                            <select
                                className="form-control"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="Fiction">Fiction</option>
                                <option value="Non-Fiction">Non-Fiction</option>
                                <option value="Science">Science</option>
                                <option value="History">History</option>
                                <option value="Biography">Biography</option>
                                <option value="Children">Children</option>
                                <option value="Health">Health</option>
                                <option value="Academic">Academic</option>
                                <option value="Business">Business</option>
                                <option value="Religious">Religious</option>
                                <option value="Art">Art</option>
                                <option value="Travel">Travel</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Price ($)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Stock Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                            placeholder="0"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Book Cover Image</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter image URL"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <input
                                type="file"
                                id="image-file"
                                onChange={uploadFileHandler}
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => document.getElementById('image-file').click()}
                                title="Upload Image"
                            >
                                <Upload size={20} /> Upload
                            </button>
                        </div>
                        {image && (
                            <div style={{ marginTop: '1rem', width: '100px', height: '150px', overflow: 'hidden', borderRadius: '4px', border: '1px solid var(--border)' }}>
                                <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                    </div>

                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={popular}
                                onChange={(e) => setPopular(e.target.checked)}
                                style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                            />
                            <span style={{ fontSize: '1rem' }}>Mark as Popular/Featured</span>
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loadingUpdate}>
                        {loadingUpdate ? 'Saving...' : (isNew ? 'List Book' : 'Update Book')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SellerAddBook;
