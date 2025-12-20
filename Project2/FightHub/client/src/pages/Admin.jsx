import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminFlights, createFlight, deleteFlight, getAllBookings, updateBooking } from '../services/api';
import { Plus, Trash2, Plane, Users, Calendar, TrendingUp, DollarSign, MapPin, Clock, Edit2, LogOut } from 'lucide-react';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [flights, setFlights] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFlight, setNewFlight] = useState({
        flightId: '',
        airline: '',
        origin: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        basePrice: ''
    });
    
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        fetchFlights();
        fetchBookings();
    }, []);

    const fetchFlights = async () => {
        try {
            const data = await getAdminFlights();
            setFlights(data.data || []);
        } catch (error) {
            console.error('Error fetching flights:', error);
        }
    };

    const fetchBookings = async () => {
        try {
            const data = await getAllBookings();
            setBookings(data.data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleAddFlight = async (e) => {
        e.preventDefault();
        try {
            const start = new Date(newFlight.departureTime);
            const end = new Date(newFlight.arrivalTime);
            const diff = end - start;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const duration = `${hours}h ${minutes}m`;

            const flightData = {
                ...newFlight,
                flightName: newFlight.airline,
                duration,
                totalSeats: 180,
                availableSeats: 180,
                classes: [
                    { className: 'economy', price: Number(newFlight.basePrice), availableSeats: 120 },
                    { className: 'premium-economy', price: Number(newFlight.basePrice) * 1.5, availableSeats: 30 },
                    { className: 'business', price: Number(newFlight.basePrice) * 3, availableSeats: 30 }
                ]
            };

            await createFlight(flightData);
            setShowAddModal(false);
            setNewFlight({
                flightId: '',
                airline: '',
                origin: '',
                destination: '',
                departureTime: '',
                arrivalTime: '',
                basePrice: ''
            });
            fetchFlights();
            alert('Flight added successfully');
        } catch (error) {
            console.error('Add flight error:', error);
            alert('Failed to add flight: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteFlight = async (id) => {
        if (window.confirm('Are you sure you want to delete this flight?')) {
            try {
                await deleteFlight(id);
                fetchFlights();
            } catch (error) {
                alert('Failed to delete flight');
            }
        }
    };

    const handleUpdateBookingStatus = async (id, status) => {
        if (window.confirm(`Are you sure you want to mark this booking as ${status}?`)) {
            try {
                await updateBooking(id, status);
                fetchBookings();
            } catch (error) {
                alert('Failed to update booking status');
            }
        }
    };

    // Calculate statistics
    const totalRevenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <Plane className="admin-logo-icon" />
                    <span>SkyWings Admin</span>
                </div>
                <nav className="admin-nav">
                    <button 
                        className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <TrendingUp size={20} />
                        <span>Overview</span>
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'flights' ? 'active' : ''}`}
                        onClick={() => setActiveTab('flights')}
                    >
                        <Plane size={20} />
                        <span>Manage Flights</span>
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        <Calendar size={20} />
                        <span>Bookings</span>
                    </button>
                    <button 
                        className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <Users size={20} />
                        <span>Users</span>
                    </button>
                </nav>
                <div className="admin-sidebar-footer">
                    <button className="admin-nav-item admin-logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div>
                        <h1 className="admin-title">
                            {activeTab === 'overview' && 'Dashboard Overview'}
                            {activeTab === 'flights' && 'Manage Flights'}
                            {activeTab === 'bookings' && 'All Bookings'}
                            {activeTab === 'users' && 'User Management'}
                        </h1>
                        <p className="admin-subtitle">Welcome back, {user?.username || 'Admin'}</p>
                    </div>
                    {activeTab === 'flights' && (
                        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                            <Plus size={20} />
                            Add New Flight
                        </button>
                    )}
                </header>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="admin-content">
                        <div className="stats-grid">
                            <div className="stat-card stat-card-primary">
                                <div className="stat-icon">
                                    <DollarSign size={24} />
                                </div>
                                <div className="stat-content">
                                    <p className="stat-label">Total Revenue</p>
                                    <h3 className="stat-value">₹{totalRevenue.toLocaleString()}</h3>
                                </div>
                            </div>
                            <div className="stat-card stat-card-success">
                                <div className="stat-icon">
                                    <Calendar size={24} />
                                </div>
                                <div className="stat-content">
                                    <p className="stat-label">Confirmed Bookings</p>
                                    <h3 className="stat-value">{confirmedBookings}</h3>
                                </div>
                            </div>
                            <div className="stat-card stat-card-warning">
                                <div className="stat-icon">
                                    <Plane size={24} />
                                </div>
                                <div className="stat-content">
                                    <p className="stat-label">Active Flights</p>
                                    <h3 className="stat-value">{flights.length}</h3>
                                </div>
                            </div>
                            <div className="stat-card stat-card-danger">
                                <div className="stat-icon">
                                    <TrendingUp size={24} />
                                </div>
                                <div className="stat-content">
                                    <p className="stat-label">Cancelled</p>
                                    <h3 className="stat-value">{cancelledBookings}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="admin-grid">
                            <div className="admin-card">
                                <div className="admin-card-header">
                                    <h3>Recent Bookings</h3>
                                    <button className="btn-link" onClick={() => setActiveTab('bookings')}>View All</button>
                                </div>
                                <div className="admin-card-body">
                                    {bookings.slice(0, 5).map(booking => (
                                        <div key={booking._id} className="recent-item">
                                            <div className="recent-item-info">
                                                <p className="recent-item-title">{booking.userId?.username || 'Unknown'}</p>
                                                <p className="recent-item-subtitle">{booking.origin?.split(' ')[0]} → {booking.destination?.split(' ')[0]}</p>
                                            </div>
                                            <span className={`status-badge ${booking.status}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="admin-card">
                                <div className="admin-card-header">
                                    <h3>Popular Routes</h3>
                                </div>
                                <div className="admin-card-body">
                                    {flights.slice(0, 5).map(flight => (
                                        <div key={flight._id} className="recent-item">
                                            <div className="recent-item-info">
                                                <p className="recent-item-title">{flight.origin?.split(' ')[0]} → {flight.destination?.split(' ')[0]}</p>
                                                <p className="recent-item-subtitle">{flight.airline}</p>
                                            </div>
                                            <span className="route-price">₹{flight.classes?.find(c => c.className === 'economy')?.price?.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Flights Tab */}
                {activeTab === 'flights' && (
                    <div className="admin-content">
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Flight ID</th>
                                        <th>Airline</th>
                                        <th>Route</th>
                                        <th>Schedule</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flights.map(flight => (
                                        <tr key={flight._id}>
                                            <td>
                                                <span className="flight-id-badge">{flight.flightId}</span>
                                            </td>
                                            <td>
                                                <div className="airline-cell">
                                                    <div className="airline-logo-small">{flight.airline?.substring(0, 2).toUpperCase()}</div>
                                                    <span>{flight.airline}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="route-cell">
                                                    <span>{flight.origin?.split(' ')[0]}</span>
                                                    <span className="route-arrow">→</span>
                                                    <span>{flight.destination?.split(' ')[0]}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="schedule-cell">
                                                    <span>{new Date(flight.departureTime).toLocaleDateString()}</span>
                                                    <span className="schedule-time">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="price-cell">₹{flight.classes?.find(c => c.className === 'economy')?.price?.toLocaleString() || 'N/A'}</span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteFlight(flight._id)}>
                                                        <Trash2 size={18} />
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

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="admin-content">
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Customer</th>
                                        <th>Flight</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(booking => (
                                        <tr key={booking._id}>
                                            <td>
                                                <span className="booking-id">#{booking._id.slice(-6).toUpperCase()}</span>
                                            </td>
                                            <td>
                                                <div className="customer-cell">
                                                    <div className="customer-avatar">{booking.userId?.username?.charAt(0).toUpperCase() || '?'}</div>
                                                    <div>
                                                        <p className="customer-name">{booking.userId?.username || 'Unknown'}</p>
                                                        <p className="customer-email">{booking.userId?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flight-cell">
                                                    <p className="flight-id">{booking.flightId?.flightId}</p>
                                                    <p className="flight-route">{booking.origin?.split(' ')[0]} → {booking.destination?.split(' ')[0]}</p>
                                                </div>
                                            </td>
                                            <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                            <td>
                                                <span className="amount-cell">₹{booking.totalPrice?.toLocaleString() || 'N/A'}</span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${booking.status}`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                {booking.status === 'confirmed' && (
                                                    <button
                                                        className="btn-small btn-danger"
                                                        onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="admin-content">
                        <div className="admin-card" style={{ maxWidth: '600px' }}>
                            <div className="admin-card-header">
                                <h3>User Management</h3>
                            </div>
                            <div className="admin-card-body">
                                <p style={{ color: 'var(--text-gray)', textAlign: 'center', padding: '2rem' }}>
                                    User management features coming soon...
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Add Flight Modal */}
            {showAddModal && (
                <div className="modal active">
                    <div className="modal-overlay" onClick={() => setShowAddModal(false)}></div>
                    <div className="modal-content">
                        <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
                        <h2>Add New Flight</h2>
                        <form onSubmit={handleAddFlight}>
                            <div className="form-group">
                                <label>Flight ID</label>
                                <input
                                    type="text"
                                    value={newFlight.flightId}
                                    onChange={e => setNewFlight({ ...newFlight, flightId: e.target.value })}
                                    required
                                    placeholder="e.g. AI-202"
                                />
                            </div>
                            <div className="form-group">
                                <label>Airline</label>
                                <input
                                    type="text"
                                    value={newFlight.airline}
                                    onChange={e => setNewFlight({ ...newFlight, airline: e.target.value })}
                                    required
                                    placeholder="e.g. Air India"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Origin</label>
                                    <input
                                        type="text"
                                        value={newFlight.origin}
                                        onChange={e => setNewFlight({ ...newFlight, origin: e.target.value })}
                                        required
                                        placeholder="e.g. Delhi (DEL)"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Destination</label>
                                    <input
                                        type="text"
                                        value={newFlight.destination}
                                        onChange={e => setNewFlight({ ...newFlight, destination: e.target.value })}
                                        required
                                        placeholder="e.g. Mumbai (BOM)"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Departure</label>
                                    <input
                                        type="datetime-local"
                                        value={newFlight.departureTime}
                                        onChange={e => setNewFlight({ ...newFlight, departureTime: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Arrival</label>
                                    <input
                                        type="datetime-local"
                                        value={newFlight.arrivalTime}
                                        onChange={e => setNewFlight({ ...newFlight, arrivalTime: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Base Price (₹)</label>
                                <input
                                    type="number"
                                    value={newFlight.basePrice}
                                    onChange={e => setNewFlight({ ...newFlight, basePrice: e.target.value })}
                                    required
                                    min="0"
                                />
                            </div>
                            <button type="submit" className="btn-primary btn-block" style={{ marginTop: '1rem' }}>
                                Create Flight
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
