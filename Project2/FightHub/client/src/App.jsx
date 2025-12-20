import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Bookings from './pages/Bookings';
import Admin from './pages/Admin';
import About from './pages/About';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import { ToastProvider } from './context/ToastContext';

// Layout component that conditionally shows navbar/footer
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if user is admin and on admin page
  const isAdmin = user?.userType === 'admin';
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Hide navbar and footer for admin on admin pages
  const hideNavAndFooter = isAdmin && isAdminPage;
  
  return (
    <div className="app">
      {!hideNavAndFooter && <Navbar />}
      <main className={hideNavAndFooter ? 'admin-layout' : ''}>
        {children}
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

// Protected route for admin
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!user || user.userType !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Route that redirects admins to admin panel
const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  // If admin tries to access user pages, redirect to admin panel
  if (user?.userType === 'admin' && location.pathname !== '/admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

function AppContent() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<UserRoute><Home /></UserRoute>} />
        <Route path="/flights" element={<UserRoute><Flights /></UserRoute>} />
        <Route path="/bookings" element={<UserRoute><Bookings /></UserRoute>} />
        <Route path="/about" element={<UserRoute><About /></UserRoute>} />
        <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
