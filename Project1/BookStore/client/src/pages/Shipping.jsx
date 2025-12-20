import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Shipping = () => {
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        // Save shipping address to sessionStorage
        sessionStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
        navigate('/payment');
    };

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
            <button onClick={() => navigate('/cart')} className="back-btn">
                <ArrowLeft size={20} /> Back to Cart
            </button>

            <div className="auth-container" style={{ marginTop: '2rem' }}>
                <div className="auth-card" style={{ maxWidth: '600px' }}>
                    <div className="auth-header">
                        <h2>Shipping Address</h2>
                        <p>Enter your delivery address</p>
                    </div>

                    <form onSubmit={submitHandler} className="auth-form">
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Postal Code</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter postal code"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Country</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            Continue to Payment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
