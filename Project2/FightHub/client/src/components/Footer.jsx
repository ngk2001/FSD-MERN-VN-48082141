import { Plane, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="nav-brand" style={{ marginBottom: '1rem' }}>
                            <Plane className="brand-icon" />
                            <span className="brand-name">FlightHub</span>
                        </div>
                        <p className="footer-text">
                            Your trusted partner for seamless air travel. We connect you to the world with comfort and style.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link"><Facebook size={20} /></a>
                            <a href="#" className="social-link"><Twitter size={20} /></a>
                            <a href="#" className="social-link"><Instagram size={20} /></a>
                            <a href="#" className="social-link"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/flights">Search Flights</Link></li>
                                <li><Link to="/bookings">My Bookings</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3>Support</h3>
                            <ul>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">FAQs</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3>Contact</h3>
                            <ul className="contact-list">
                                <li>
                                    <Mail size={16} />
                                    <span>support@flighthub.com</span>
                                </li>
                                <li>
                                    <Phone size={16} />
                                    <span>+1 (555) 123-4567</span>
                                </li>
                                <li>
                                    <MapPin size={16} />
                                    <span>123 Aviation Blvd, Sky City</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} FlightHub Airlines. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
