import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Vendors from './pages/Vendors';
import VendorDetails from './pages/VendorDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EventPackages from './pages/EventPackages';
import HowItWorks from './pages/HowItWorks';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import RequestService from './pages/RequestService';
import CompleteProfile from './pages/CompleteProfile';
import ProfileSettings from './pages/ProfileSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex-column" style={{ minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/vendors/:id" element={<VendorDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/packages" element={<EventPackages />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/settings" element={<ProfileSettings />} />
              <Route path="/request-service" element={<RequestService />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="*" element={<div className="container" style={{ padding: '4rem 1rem' }}><h2>404 - Page Not Found</h2></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
