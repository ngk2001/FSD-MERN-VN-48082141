import { useNavigate } from 'react-router-dom';
import FlightSearchForm from '../components/FlightSearchForm';
import { Shield, Clock, Globe, Plane } from 'lucide-react';
import heroAirplane from '../assets/hero-airplane.png';

const Home = () => {
    const navigate = useNavigate();

    const handleSearch = (params) => {
        // Navigate to flights page with search params
        const searchString = new URLSearchParams(params).toString();
        navigate(`/flights?${searchString}`);
    };


    return (
        <div className="home-page">
            <div className="hero" style={{ backgroundImage: `url(${heroAirplane})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">
                        Your Journey Begins Here
                    </h1>
                    <p className="hero-subtitle">
                        Book flights instantly. Compare fares. Travel seamlessly.
                    </p>
                </div>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 20 }}>
                <FlightSearchForm onSearch={handleSearch} />
            </div>

            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why Fly With Us?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Shield />
                            </div>
                            <h3>Secure Booking</h3>
                            <p>Your payments and personal data are protected with bank-grade security.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Clock />
                            </div>
                            <h3>Fast & Easy</h3>
                            <p>Book your flight in just a few clicks with our intuitive interface.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Globe />
                            </div>
                            <h3>Global Coverage</h3>
                            <p>Access flights to over 500+ destinations worldwide.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="destinations-section">
                <div className="container">
                    <h2 className="section-title">Popular Destinations</h2>
                    <div className="destinations-grid">
                        <div className="destination-card">
                            <div className="destination-img" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80) center/cover' }}></div>
                            <div className="destination-content">
                                <h3>Agra, India</h3>
                                <p>Visit the Taj Mahal</p>
                            </div>
                        </div>
                        <div className="destination-card">
                            <div className="destination-img" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?auto=format&fit=crop&w=600&q=80) center/cover' }}></div>
                            <div className="destination-content">
                                <h3>Paris, France</h3>
                                <p>City of Love</p>
                            </div>
                        </div>
                        <div className="destination-card">
                            <div className="destination-img" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80) center/cover' }}></div>
                            <div className="destination-content">
                                <h3>Tokyo, Japan</h3>
                                <p>Modern meets Traditional</p>
                            </div>
                        </div>
                        <div className="destination-card">
                            <div className="destination-img" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=600&q=80) center/cover' }}></div>
                            <div className="destination-content">
                                <h3>London, UK</h3>
                                <p>Royal Heritage</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="newsletter-section">
                <div className="container">
                    <div className="newsletter-content">
                        <h2>Subscribe to our Newsletter</h2>
                        <p>Get the latest travel updates and exclusive offers delivered to your inbox.</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Enter your email address" />
                            <button type="submit" className="btn-primary">Subscribe</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
