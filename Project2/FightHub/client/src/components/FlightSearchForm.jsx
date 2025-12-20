import { useState } from 'react';
import { Search, Calendar, MapPin, Users, ArrowRightLeft, Armchair } from 'lucide-react';

const FlightSearchForm = ({ onSearch }) => {
    const [searchParams, setSearchParams] = useState({
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        passengers: 1,
        seatClass: 'economy',
        tripType: 'one-way'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchParams);
    };

    const handleSwap = () => {
        setSearchParams(prev => ({
            ...prev,
            origin: prev.destination,
            destination: prev.origin
        }));
    };

    return (
        <div className="search-card" id="mainSearchCard">
            <div className="search-tabs">
                <button
                    className={`tab-btn ${searchParams.tripType === 'one-way' ? 'active' : ''}`}
                    onClick={() => setSearchParams({ ...searchParams, tripType: 'one-way' })}
                >
                    One Way
                </button>
                <button
                    className={`tab-btn ${searchParams.tripType === 'round-trip' ? 'active' : ''}`}
                    onClick={() => setSearchParams({ ...searchParams, tripType: 'round-trip' })}
                >
                    Round Trip
                </button>
            </div>

            <form onSubmit={handleSubmit} className="search-form">
                <div className="location-row">
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>From</label>
                        <div className="input-with-icon">
                            <MapPin className="input-icon" />
                            <input
                                type="text"
                                placeholder="Delhi (DEL)"
                                value={searchParams.origin}
                                onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="button" className="swap-btn" onClick={handleSwap}>
                        <ArrowRightLeft />
                    </button>

                    <div className="form-group" style={{ flex: 1 }}>
                        <label>To</label>
                        <div className="input-with-icon">
                            <MapPin className="input-icon" />
                            <input
                                type="text"
                                placeholder="Mumbai (BOM)"
                                value={searchParams.destination}
                                onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Departure</label>
                        <div className="input-with-icon">
                            <Calendar className="input-icon" />
                            <input
                                type="date"
                                value={searchParams.departureDate}
                                onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    {searchParams.tripType === 'round-trip' && (
                        <div className="form-group">
                            <label>Return</label>
                            <div className="input-with-icon">
                                <Calendar className="input-icon" />
                                <input
                                    type="date"
                                    value={searchParams.returnDate}
                                    onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                                    min={searchParams.departureDate}
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Passengers</label>
                        <div className="input-with-icon">
                            <Users className="input-icon" />
                            <select
                                value={searchParams.passengers}
                                onChange={(e) => setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) })}
                            >
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Class</label>
                        <div className="input-with-icon">
                            <Armchair className="input-icon" />
                            <select
                                value={searchParams.seatClass}
                                onChange={(e) => setSearchParams({ ...searchParams, seatClass: e.target.value })}
                            >
                                <option value="economy">Economy</option>
                                <option value="premium-economy">Premium Economy</option>
                                <option value="business">Business</option>
                                <option value="first-class">First Class</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn-search">
                    <Search />
                    Search Flights
                </button>
            </form>
        </div>
    );
};

export default FlightSearchForm;
