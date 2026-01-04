import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <span className="logo-icon">🎉</span>
                        <span className="logo-text">WarkaHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="nav-links desktop-only">
                        <Link to="/browse" className="nav-link">Browse Services</Link>
                        <Link to="/packages" className="nav-link">Event Packages</Link>
                        <Link to="/how-it-works" className="nav-link">How It Works</Link>
                    </div>

                    {/* Desktop Auth */}
                    <div className="nav-auth desktop-only">
                        {isAuthenticated ? (
                            <div className="user-menu">
                                <button className="user-button">
                                    <User size={20} />
                                    <span>{user?.name}</span>
                                </button>
                                <div className="user-dropdown">
                                    <Link to="/dashboard" className="dropdown-item">
                                        <LayoutDashboard size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                    <button onClick={logout} className="dropdown-item">
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost">Login</Link>
                                <Link to="/register" className="btn btn-primary">Get Started</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-toggle mobile-only"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="mobile-menu animate-slide-in">
                        <Link to="/browse" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                            Browse Services
                        </Link>
                        <Link to="/packages" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                            Event Packages
                        </Link>
                        <Link to="/how-it-works" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                            How It Works
                        </Link>

                        <div className="mobile-auth">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>
                                        Dashboard
                                    </Link>
                                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="btn btn-ghost">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .navbar {
          background: var(--color-white);
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 1rem 0;
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-primary);
          transition: transform var(--transition-fast);
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .logo-icon {
          font-size: 2rem;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          text-decoration: none;
          color: var(--color-dark);
          font-weight: 500;
          transition: color var(--transition-fast);
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-primary);
          transition: width var(--transition-normal);
        }

        .nav-link:hover {
          color: var(--color-primary);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-auth {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-menu {
          position: relative;
        }

        .user-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--color-light);
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-family: var(--font-primary);
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .user-button:hover {
          background: var(--color-primary-light);
          color: var(--color-white);
        }

        .user-dropdown {
          display: none;
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: var(--color-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          min-width: 200px;
          overflow: hidden;
        }

        .user-menu:hover .user-dropdown {
          display: block;
          animation: fadeIn 0.3s ease;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.25rem;
          width: 100%;
          border: none;
          background: none;
          text-decoration: none;
          color: var(--color-dark);
          font-family: var(--font-primary);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .dropdown-item:hover {
          background: var(--color-light);
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-dark);
        }

        .mobile-menu {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem 0;
          border-top: 1px solid var(--color-light);
          margin-top: 1rem;
        }

        .mobile-nav-link {
          text-decoration: none;
          color: var(--color-dark);
          font-weight: 500;
          padding: 0.75rem 0;
          transition: color var(--transition-fast);
        }

        .mobile-nav-link:hover {
          color: var(--color-primary);
        }

        .mobile-auth {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-light);
        }

        .desktop-only {
          display: flex;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: block;
          }

          .mobile-menu-toggle {
            display: block;
          }
        }
      `}</style>
        </nav>
    );
};
