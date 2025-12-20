import { Mail, Phone, MapPin, HelpCircle } from 'lucide-react';

const About = () => {
    return (
        <div className="container">
            <div className="page-header">
                <h1>About FlightHub</h1>
                <p>Your trusted partner for seamless air travel</p>
            </div>

            <div className="features-section" style={{ padding: '2rem 0' }}>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <HelpCircle />
                        </div>
                        <h3>Our Mission</h3>
                        <p>To make air travel accessible, affordable, and enjoyable for everyone. We believe in connecting people and places with ease.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <MapPin />
                        </div>
                        <h3>Global Reach</h3>
                        <p>With partnerships across 500+ airlines, we connect you to over 2,000 destinations worldwide.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Phone />
                        </div>
                        <h3>24/7 Support</h3>
                        <p>Our dedicated support team is always here to help you with your booking needs, anytime, anywhere.</p>
                    </div>
                </div>
            </div>

            <div className="search-card" style={{ margin: '2rem auto', textAlign: 'center', maxWidth: '800px' }}>
                <h2>Contact Us</h2>
                <p style={{ color: 'var(--text-gray)', marginBottom: '2rem' }}>Have questions? We'd love to hear from you.</p>

                <div style={{ display: 'grid', gap: '1.5rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-light)', borderRadius: '50%', color: 'var(--primary)' }}>
                            <Mail size={20} />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: '600' }}>Email</h4>
                            <p style={{ color: 'var(--text-gray)' }}>support@flighthub.com</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-light)', borderRadius: '50%', color: 'var(--primary)' }}>
                            <Phone size={20} />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: '600' }}>Phone</h4>
                            <p style={{ color: 'var(--text-gray)' }}>+1 (555) 123-4567</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-light)', borderRadius: '50%', color: 'var(--primary)' }}>
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: '600' }}>Office</h4>
                            <p style={{ color: 'var(--text-gray)' }}>123 Aviation Blvd, Sky City, SC 90210</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
