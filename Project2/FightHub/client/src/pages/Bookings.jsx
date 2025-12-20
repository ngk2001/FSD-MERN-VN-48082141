import { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking, getRescheduleOptions, rescheduleBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Bookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rescheduleFlights, setRescheduleFlights] = useState([]);
    const [selectedNewFlight, setSelectedNewFlight] = useState(null);
    const [rescheduleLoading, setRescheduleLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            const data = await getMyBookings();
            setBookings(data.data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            showNotification('Failed to load bookings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const openCancelModal = (booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
        setSelectedBooking(null);
    };

    const handleCancel = async () => {
        if (!selectedBooking) return;
        
        setActionLoading(true);
        try {
            const response = await cancelBooking(selectedBooking._id);
            showNotification(response.message || 'Booking cancelled successfully!', 'success');
            closeCancelModal();
            fetchBookings();
        } catch (error) {
            showNotification(error.response?.data?.message || 'Failed to cancel booking', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const openRescheduleModal = async (booking) => {
        setSelectedBooking(booking);
        setRescheduleLoading(true);
        setShowRescheduleModal(true);
        
        try {
            const response = await getRescheduleOptions(booking._id);
            setRescheduleFlights(response.data || []);
        } catch (error) {
            showNotification(error.response?.data?.message || 'Failed to load reschedule options', 'error');
            setRescheduleFlights([]);
        } finally {
            setRescheduleLoading(false);
        }
    };

    const closeRescheduleModal = () => {
        setShowRescheduleModal(false);
        setSelectedBooking(null);
        setSelectedNewFlight(null);
        setRescheduleFlights([]);
    };

    const handleReschedule = async () => {
        if (!selectedBooking || !selectedNewFlight) return;
        
        setActionLoading(true);
        try {
            const response = await rescheduleBooking(selectedBooking._id, selectedNewFlight._id);
            showNotification(response.message || 'Booking rescheduled successfully!', 'success');
            closeRescheduleModal();
            fetchBookings();
        } catch (error) {
            showNotification(error.response?.data?.message || 'Failed to reschedule booking', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'confirmed';
            case 'cancelled': return 'cancelled';
            case 'pending': return 'pending';
            case 'completed': return 'completed';
            default: return 'pending';
        }
    };

    const canModifyBooking = (booking) => {
        const status = booking.status?.toLowerCase();
        return status === 'confirmed' || status === 'pending';
    };

    if (!user) {
        return (
            <div className="container page active" style={{ textAlign: 'center', padding: '4rem' }}>
                <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2C10.343 2 9 3.343 9 5c0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z"/>
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    </svg>
                    <h2>Please login to view your bookings</h2>
                    <p>Sign in to access your flight bookings and manage your trips.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container page active">
            {/* Notification */}
            {notification && (
                <div className={`notification notification-${notification.type}`}>
                    <span>{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="notification-close">×</button>
                </div>
            )}

            <div className="page-header">
                <h1>My Bookings</h1>
                <p>Manage your upcoming and past trips</p>
            </div>

            <div className="bookings-list">
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading your bookings...</p>
                    </div>
                ) : bookings.length > 0 ? (
                    bookings.map(booking => (
                        <div key={booking._id} className="booking-card">
                            <div className="booking-header">
                                <div>
                                    <p className="booking-id">Booking ID: {booking.bookingId}</p>
                                    <h3 className="booking-route">
                                        {(booking.flight?.origin || booking.origin || '').split(' ')[0]} → {(booking.flight?.destination || booking.destination || '').split(' ')[0]}
                                    </h3>
                                    <p className="booking-datetime">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                        {formatDate(booking.flight?.departureTime || booking.departureTime)} at {formatTime(booking.flight?.departureTime || booking.departureTime)}
                                    </p>
                                </div>
                                <span className={`booking-status ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="booking-details">
                                <div className="booking-detail">
                                    <span className="detail-label">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                                        </svg>
                                        Airline
                                    </span>
                                    <span className="detail-value">{booking.flight?.airline || booking.flightName || 'N/A'}</span>
                                </div>
                                <div className="booking-detail">
                                    <span className="detail-label">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                            <circle cx="9" cy="7" r="4"/>
                                            <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                                            <path d="M16 3.13a4 4 0 010 7.75"/>
                                        </svg>
                                        Passengers
                                    </span>
                                    <span className="detail-value">{booking.passengers}</span>
                                </div>
                                <div className="booking-detail">
                                    <span className="detail-label">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="5" width="20" height="14" rx="2"/>
                                            <line x1="2" y1="10" x2="22" y2="10"/>
                                        </svg>
                                        Class
                                    </span>
                                    <span className="detail-value" style={{ textTransform: 'capitalize' }}>{booking.seatClass?.replace('-', ' ') || 'Economy'}</span>
                                </div>
                                <div className="booking-detail">
                                    <span className="detail-label">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="12" y1="1" x2="12" y2="23"/>
                                            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                                        </svg>
                                        Total Price
                                    </span>
                                    <span className="detail-value price-highlight">₹{booking.totalPrice?.toLocaleString()}</span>
                                </div>
                            </div>

                            {canModifyBooking(booking) && (
                                <div className="booking-actions">
                                    <button
                                        className="btn-reschedule"
                                        onClick={() => openRescheduleModal(booking)}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                            <path d="M9 16l2 2 4-4"/>
                                        </svg>
                                        Reschedule
                                    </button>
                                    <button
                                        className="btn-cancel"
                                        onClick={() => openCancelModal(booking)}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"/>
                                            <line x1="15" y1="9" x2="9" y2="15"/>
                                            <line x1="9" y1="9" x2="15" y2="15"/>
                                        </svg>
                                        Cancel Booking
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                            <line x1="12" y1="22.08" x2="12" y2="12"/>
                        </svg>
                        <h3>No bookings found</h3>
                        <p>You haven't booked any flights yet. Start exploring destinations!</p>
                    </div>
                )}
            </div>

            {/* Cancel Booking Modal */}
            {showCancelModal && (
                <div className="modal active" onClick={closeCancelModal}>
                    <div className="modal-overlay"></div>
                    <div className="modal-content cancel-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeCancelModal}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                        
                        <div className="cancel-modal-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                        </div>
                        
                        <h2>Cancel Booking?</h2>
                        <p className="modal-subtitle">Are you sure you want to cancel this booking?</p>
                        
                        {selectedBooking && (
                            <div className="cancel-booking-summary">
                                <div className="summary-route">
                                    <strong>{selectedBooking.origin?.split(' ')[0]}</strong>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                    <strong>{selectedBooking.destination?.split(' ')[0]}</strong>
                                </div>
                                <p className="summary-date">{formatDate(selectedBooking.departureTime)}</p>
                                <p className="summary-price">Refund Amount: <span>₹{selectedBooking.totalPrice?.toLocaleString()}</span></p>
                            </div>
                        )}
                        
                        <div className="cancel-info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 16v-4"/>
                                <path d="M12 8h.01"/>
                            </svg>
                            <span>Refund will be processed within 5-7 business days</span>
                        </div>
                        
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={closeCancelModal} disabled={actionLoading}>
                                Keep Booking
                            </button>
                            <button className="btn-danger-solid" onClick={handleCancel} disabled={actionLoading}>
                                {actionLoading ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Cancelling...
                                    </>
                                ) : (
                                    'Yes, Cancel Booking'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Booking Modal */}
            {showRescheduleModal && (
                <div className="modal active modal-large" onClick={closeRescheduleModal}>
                    <div className="modal-overlay"></div>
                    <div className="modal-content reschedule-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeRescheduleModal}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                        
                        <div className="reschedule-header">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <div>
                                <h2>Reschedule Flight</h2>
                                <p className="modal-subtitle">Choose a new flight for your journey</p>
                            </div>
                        </div>
                        
                        {selectedBooking && (
                            <div className="reschedule-current">
                                <span className="current-label">Current Booking</span>
                                <div className="current-flight-info">
                                    <span className="current-route">
                                        {selectedBooking.origin?.split(' ')[0]} → {selectedBooking.destination?.split(' ')[0]}
                                    </span>
                                    <span className="current-date">{formatDate(selectedBooking.departureTime)} • {formatTime(selectedBooking.departureTime)}</span>
                                    <span className="current-price">₹{selectedBooking.totalPrice?.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                        
                        <div className="reschedule-flights">
                            <h3>Available Flights</h3>
                            
                            {rescheduleLoading ? (
                                <div className="loading">
                                    <div className="spinner"></div>
                                    <p>Loading available flights...</p>
                                </div>
                            ) : rescheduleFlights.length > 0 ? (
                                <div className="flights-list">
                                    {rescheduleFlights.map(flight => {
                                        const classInfo = flight.classes?.find(c => c.className === selectedBooking?.seatClass);
                                        const price = classInfo ? classInfo.price * selectedBooking?.passengers : flight.basePrice * selectedBooking?.passengers;
                                        const priceDiff = price - selectedBooking?.totalPrice;
                                        
                                        return (
                                            <div 
                                                key={flight._id} 
                                                className={`reschedule-flight-card ${selectedNewFlight?._id === flight._id ? 'selected' : ''}`}
                                                onClick={() => setSelectedNewFlight(flight)}
                                            >
                                                <div className="flight-card-left">
                                                    <div className="flight-airline">{flight.airline}</div>
                                                    <div className="flight-id">{flight.flightId}</div>
                                                </div>
                                                <div className="flight-card-center">
                                                    <div className="flight-times">
                                                        <span className="time">{formatTime(flight.departureTime)}</span>
                                                        <div className="flight-duration">
                                                            <span className="duration-line"></span>
                                                            <span className="duration-text">{flight.duration}</span>
                                                        </div>
                                                        <span className="time">{formatTime(flight.arrivalTime)}</span>
                                                    </div>
                                                    <div className="flight-date">{formatDate(flight.departureTime)}</div>
                                                </div>
                                                <div className="flight-card-right">
                                                    <div className="flight-price">₹{price?.toLocaleString()}</div>
                                                    {priceDiff !== 0 && (
                                                        <div className={`price-diff ${priceDiff > 0 ? 'extra' : 'refund'}`}>
                                                            {priceDiff > 0 ? `+₹${priceDiff.toLocaleString()}` : `-₹${Math.abs(priceDiff).toLocaleString()}`}
                                                        </div>
                                                    )}
                                                    <div className="flight-seats">{flight.availableSeats} seats left</div>
                                                </div>
                                                <div className="flight-select-indicator">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                                                        <polyline points="22 4 12 14.01 9 11.01"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="no-flights">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                                        <line x1="12" y1="9" x2="12" y2="13"/>
                                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                                    </svg>
                                    <h4>No alternative flights available</h4>
                                    <p>There are no other flights available for this route at the moment.</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={closeRescheduleModal} disabled={actionLoading}>
                                Cancel
                            </button>
                            <button 
                                className="btn-primary" 
                                onClick={handleReschedule} 
                                disabled={actionLoading || !selectedNewFlight}
                            >
                                {actionLoading ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Rescheduling...
                                    </>
                                ) : (
                                    'Confirm Reschedule'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
