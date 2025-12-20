import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchFlights } from '../services/api';
import FlightCard from '../components/FlightCard';
import BookingModal from '../components/BookingModal';
import { Filter, Search, ArrowUpDown } from 'lucide-react';

const Flights = () => {
    const [searchParams] = useSearchParams();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [priceFilter, setPriceFilter] = useState(50000);
    const [selectedAirlines, setSelectedAirlines] = useState([]);
    const [availableAirlines, setAvailableAirlines] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('price-low');

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            try {
                const params = Object.fromEntries(searchParams.entries());
                const data = await searchFlights(params);
                const flightData = data.data || [];
                setFlights(flightData);

                // Extract unique airlines
                const airlines = [...new Set(flightData.map(f => f.airline))];
                setAvailableAirlines(airlines);
                setSelectedAirlines(airlines); // Select all by default
            } catch (error) {
                console.error('Error fetching flights:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [searchParams]);

    const handleBook = (flight) => {
        setSelectedFlight(flight);
        setIsBookingModalOpen(true);
    };

    const handleAirlineChange = (airline) => {
        setSelectedAirlines(prev => {
            if (prev.includes(airline)) {
                return prev.filter(a => a !== airline);
            } else {
                return [...prev, airline];
            }
        });
    };

    const getFlightPrice = (flight) => {
        const economyClass = flight.classes.find(c => c.className === 'economy');
        return economyClass ? economyClass.price : flight.basePrice;
    };

    const filteredFlights = flights
        .filter(flight => {
            const economyClass = flight.classes.find(c => c.className === 'economy');
            const matchesPrice = economyClass ? economyClass.price <= priceFilter : false;
            const matchesAirline = selectedAirlines.includes(flight.airline);
            
            // Search filter
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = searchQuery === '' || 
                flight.airline.toLowerCase().includes(searchLower) ||
                flight.flightId.toLowerCase().includes(searchLower) ||
                flight.origin.toLowerCase().includes(searchLower) ||
                flight.destination.toLowerCase().includes(searchLower);
            
            return matchesPrice && matchesAirline && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return getFlightPrice(a) - getFlightPrice(b);
                case 'price-high':
                    return getFlightPrice(b) - getFlightPrice(a);
                case 'departure-early':
                    return new Date(a.departureTime) - new Date(b.departureTime);
                case 'departure-late':
                    return new Date(b.departureTime) - new Date(a.departureTime);
                case 'duration':
                    return a.duration.localeCompare(b.duration);
                default:
                    return 0;
            }
        });

    return (
        <div className="container page active">
            <div className="page-header">
                <h1>Flight Results</h1>
                <p>Found {filteredFlights.length} flights for your trip</p>
            </div>

            {/* Search Bar */}
            <div className="search-bar-container">
                <div className="search-bar">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by airline, flight number, origin or destination..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="sort-container">
                    <ArrowUpDown size={18} />
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="departure-early">Departure: Earliest</option>
                        <option value="departure-late">Departure: Latest</option>
                        <option value="duration">Duration</option>
                    </select>
                </div>
            </div>

            <div className="flights-container">
                <aside className="flights-filters">
                    <div className="filter-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Filter size={20} />
                        <h3>Filters</h3>
                    </div>

                    <div className="filter-group">
                        <label>Price Range</label>
                        <div className="price-range">
                            <input
                                type="range"
                                min="1000"
                                max="100000"
                                step="1000"
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(parseInt(e.target.value))}
                            />
                            <span>Up to ₹{priceFilter.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Airlines</label>
                        <div className="checkbox-group">
                            {availableAirlines.map(airline => (
                                <label key={airline}>
                                    <input
                                        type="checkbox"
                                        checked={selectedAirlines.includes(airline)}
                                        onChange={() => handleAirlineChange(airline)}
                                    />
                                    {airline}
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                <div className="flights-list">
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Searching for best flights...</p>
                        </div>
                    ) : filteredFlights.length > 0 ? (
                        filteredFlights.map(flight => (
                            <FlightCard key={flight._id} flight={flight} onBook={handleBook} />
                        ))
                    ) : (
                        <div className="empty-state">
                            <h3>No flights found</h3>
                            <p>Try adjusting your search criteria or filters</p>
                        </div>
                    )}
                </div>
            </div>

            <BookingModal
                flight={selectedFlight}
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                onSuccess={() => {
                    // Show success message or redirect
                    alert('Booking Successful!');
                }}
            />
        </div>
    );
};

export default Flights;
