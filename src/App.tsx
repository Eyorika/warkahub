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
