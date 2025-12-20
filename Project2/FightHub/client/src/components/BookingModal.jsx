import { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ flight, isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [passengers, setPassengers] = useState(1);
    const [seatClass, setSeatClass] = useState('economy');
    const [passengerDetails, setPassengerDetails] = useState([{ name: '', age: '', seat: '' }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !flight) return null;

    const handlePassengerChange = (count) => {
        setPassengers(count);
        const newDetails = [...passengerDetails];
        if (count > newDetails.length) {
            for (let i = newDetails.length; i < count; i++) {
                newDetails.push({ name: '', age: '', seat: '' });
            }
        } else {
            newDetails.splice(count);
        }
        setPassengerDetails(newDetails);
    };

    const updatePassenger = (index, field, value) => {
        const newDetails = [...passengerDetails];
        newDetails[index][field] = value;
        setPassengerDetails(newDetails);
    };

    const calculateTotal = () => {
        const selectedClass = flight.classes.find(c => c.className === seatClass);
        const basePrice = selectedClass ? selectedClass.price : 0;
        return basePrice * passengers;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const bookingData = {
                flightId: flight._id,
                passengers,
                seatClass,
                seats: passengerDetails.map(p => ({
                    passengerName: p.name,
                    passengerAge: Number(p.age),
                    seatNumber: p.seat || 'Any'
                })),
                totalPrice: calculateTotal(),
                paymentMethod: 'credit-card'
            };

            await createBooking(bookingData);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal active">
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content modal-large">
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2>Complete Your Booking</h2>
                <div className="booking-summary" style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)' }}>
                    <h3>{flight.airline} - {flight.flightId}</h3>
                    <p>{flight.origin} → {flight.destination}</p>
                    <p>{new Date(flight.departureTime).toLocaleString()}</p>
                </div>

                {error && <div className="toast error show" style={{ position: 'static', transform: 'none', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Passengers</label>
                            <select
                                value={passengers}
                                onChange={(e) => handlePassengerChange(parseInt(e.target.value))}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                            >
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Class</label>
                            <select
                                value={seatClass}
                                onChange={(e) => setSeatClass(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                            >
                                {flight.classes.map(cls => (
                                    <option key={cls.className} value={cls.className}>
                                        {cls.className.charAt(0).toUpperCase() + cls.className.slice(1)} (₹{cls.price})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <h4 style={{ margin: '1.5rem 0 1rem' }}>Passenger Details</h4>
                    {passengerDetails.map((passenger, index) => (
                        <div key={index} className="form-row" style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={passenger.name}
                                    onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                                    required
                                    placeholder="Full Name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Age</label>
                                <input
                                    type="number"
                                    value={passenger.age}
                                    onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                                    required
                                    min="1"
                                    placeholder="Age"
                                />
                            </div>
                            <div className="form-group">
                                <label>Seat Preference</label>
                                <select
                                    value={passenger.seat}
                                    onChange={(e) => updatePassenger(index, 'seat', e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                                >
                                    <option value="">Any</option>
                                    <option value="window">Window</option>
                                    <option value="aisle">Aisle</option>
                                </select>
                            </div>
                        </div>
                    ))}

                    <div className="payment-section" style={{ marginTop: '2rem' }}>
                        <h4>Payment Method</h4>
                        <div className="payment-option" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-light)', marginTop: '0.5rem' }}>
                            <CreditCard size={20} color="var(--primary)" />
                            <span>Credit Card</span>
                        </div>
                    </div>

                    <div className="total-price" style={{ marginTop: '2rem', textAlign: 'right', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        Total: ₹{calculateTotal().toLocaleString()}
                    </div>

                    <button type="submit" className="btn-primary btn-block" style={{ marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
