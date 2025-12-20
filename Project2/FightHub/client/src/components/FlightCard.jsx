import { Plane, Clock, Calendar } from 'lucide-react';

const FlightCard = ({ flight, onBook }) => {
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const getPrice = () => {
        const economyClass = flight.classes.find(c => c.className === 'economy');
        return economyClass ? economyClass.price : flight.basePrice;
    };

    return (
        <div className="flight-card">
            <div className="flight-header">
                <div className="flight-airline">
                    <div className="airline-logo">
                        {flight.airline.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="airline-info">
                        <h3>{flight.airline}</h3>
                        <p>{flight.flightId}</p>
                    </div>
                </div>
                <div className="flight-status">Scheduled</div>
            </div>

            <div className="flight-details">
                <div className="flight-location origin">
                    <div className="location-code">{flight.origin.split(' ')[0]}</div>
                    <div className="location-time">{formatTime(flight.departureTime)}</div>
                    <div className="location-name">{formatDate(flight.departureTime)}</div>
                </div>

                <div className="flight-route">
                    <div className="route-duration">{flight.duration}</div>
                    <div className="route-line"></div>
                    <div className="route-stops">Non-stop</div>
                </div>

                <div className="flight-location destination">
                    <div className="location-code">{flight.destination.split(' ')[0]}</div>
                    <div className="location-time">{formatTime(flight.arrivalTime)}</div>
                    <div className="location-name">{formatDate(flight.arrivalTime)}</div>
                </div>
            </div>

            <div className="flight-footer">
                <div className="flight-price">
                    <span className="price-label">Economy from</span>
                    <span className="price-amount">₹{getPrice().toLocaleString()}</span>
                </div>
                <button className="btn-primary" onClick={() => onBook(flight)}>
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default FlightCard;
