import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, Package, ChevronDown, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="nav-container">
        <div className="container">
          <div className="nav-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Package className="logo-icon" />
              </motion.div>
              <span className="logo-text">WarkaHub</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="nav-links desktop-nav">
              <Link to="/vendors" className="nav-link">Browse Vendors</Link>
              <Link to="/packages" className="nav-link">Event Packages</Link>
              <Link to="/how-it-works" className="nav-link">How It Works</Link>

              {isAuthenticated ? (
                <>
                  {user?.role === 'vendor' && (
                    <Link to="/vendor/dashboard" className="nav-link">
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin/dashboard" className="nav-link">
                      <LayoutDashboard size={18} />
                      Admin
                    </Link>
                  )}
                  {user?.role === 'customer' && (
                    <>
                      <Link to="/request-service" className="nav-link">Request Service</Link>
                      <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                    </>
                  )}
                  <div className="user-menu">
                    <button className="user-button">
                      <div className="user-avatar-small">
                        <User size={18} />
                      </div>
                      <span className="user-name-text">{user?.name}</span>
                      <ChevronDown size={14} className="dropdown-chevron" />
                    </button>
                    <div className="user-dropdown">
                      <Link to="/profile" className="dropdown-item">
                        <User size={16} />
                        Profile
                      </Link>
                      <Link to="/profile/settings" className="dropdown-item">
                        <Settings size={16} />
                        Settings
                      </Link>
                      <button onClick={logout} className="dropdown-item">
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline">Login</Link>
                  <Link to="/register" className="btn btn-primary">Get Started</Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="mobile-nav"
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Link to="/vendors" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  Browse Vendors
                </Link>
                <Link to="/packages" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  Event Packages
                </Link>
                <Link to="/how-it-works" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  How It Works
                </Link>

                {isAuthenticated ? (
                  <>
                    {user?.role === 'vendor' && (
                      <Link to="/vendor/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                        Dashboard
                      </Link>
                    )}
                    {user?.role === 'customer' && (
                      <>
                        <Link to="/request-service" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                          Request Service
                        </Link>
                        <Link to="/my-bookings" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                          My Bookings
                        </Link>
                      </>
                    )}
                    <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                      Profile
                    </Link>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="mobile-nav-link">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                    <Link to="/register" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                      Get Started
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
};

export default Header;
