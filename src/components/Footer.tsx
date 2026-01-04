import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-brand">
              <Package className="footer-logo-icon" />
              <span className="footer-logo-text">WarkaHub</span>
            </div>
            <p className="footer-description">
              Ethiopia's premier event services marketplace. Connecting you with verified caterers, decorators, photographers, and more.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/vendors">Browse Vendors</Link></li>
              <li><Link to="/packages">Event Packages</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          {/* For Vendors */}
          <div className="footer-section">
            <h4 className="footer-title">For Vendors</h4>
            <ul className="footer-links">
              <li><Link to="/vendor/register">Become a Vendor</Link></li>
              <li><Link to="/vendor/pricing">Subscription Plans</Link></li>
              <li><Link to="/vendor/resources">Resources</Link></li>
              <li><Link to="/vendor/support">Support</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-title">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <Mail size={18} />
                <span>info@warkahub.et</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+251 911 234 567</span>
              </li>
              <li>
                <MapPin size={18} />
                <span>Addis Ababa, Ethiopia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} WarkaHub. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
