import { Link } from 'react-router-dom';
import { Search, Star, Shield, Zap, Users, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const services = [
    { icon: '🍽️', name: 'Catering', count: '150+ Vendors', color: '#1a8f5c' },
    { icon: '🎨', name: 'Decoration', count: '120+ Vendors', color: '#f4a623' },
    { icon: '📸', name: 'Photography', count: '200+ Vendors', color: '#e63946' },
    { icon: '🎥', name: 'Videography', count: '80+ Vendors', color: '#457b9d' },
    { icon: '🎵', name: 'Music & DJ', count: '90+ Vendors', color: '#9b59b6' },
    { icon: '🏛️', name: 'Venue', count: '60+ Venues', color: '#2ecc71' },
  ];

  const features = [
    {
      icon: <Shield size={32} />,
      title: 'Verified Vendors',
      description: 'All service providers are verified and licensed for your peace of mind',
    },
    {
      icon: <Star size={32} />,
      title: 'Trusted Reviews',
      description: 'Real reviews from real customers help you make informed decisions',
    },
    {
      icon: <Zap size={32} />,
      title: 'Instant Booking',
      description: 'Book services in minutes with our streamlined booking process',
    },
    {
      icon: <Users size={32} />,
      title: 'Expert Support',
      description: '24/7 customer support to help you plan the perfect event',
    },
  ];

  const stats = [
    { value: '500+', label: 'Verified Vendors' },
    { value: '2,000+', label: 'Events Completed' },
    { value: '4.8/5', label: 'Average Rating' },
    { value: '95%', label: 'Customer Satisfaction' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content animate-fade-in">
            <h1 className="hero-title">
              Plan Your Perfect Event with <span className="gradient-text">WarkaHub</span>
            </h1>
            <p className="hero-subtitle">
              Ethiopia's #1 marketplace for catering, decoration, photography, and all your event needs.
              Book trusted vendors in minutes.
            </p>
            <div className="hero-actions">
              <Link to="/browse" className="btn btn-primary btn-lg">
                <Search size={20} />
                Browse Services
              </Link>
              <Link to="/become-vendor" className="btn btn-outline btn-lg">
                Become a Vendor
              </Link>
            </div>

            {/* Quick Search */}
            <div className="quick-search card-glass">
              <input
                type="text"
                placeholder="Search for caterers, decorators, photographers..."
                className="search-input"
              />
              <button className="btn btn-primary">
                <Search size={20} />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card animate-fade-in">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Services</h2>
            <p>Find the perfect vendors for every aspect of your event</p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <Link
                key={index}
                to={`/browse?service=${service.name.toLowerCase()}`}
                className="service-card card"
                style={{ '--service-color': service.color } as React.CSSProperties}
              >
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-name">{service.name}</h3>
                <p className="service-count">{service.count}</p>
                <div className="service-arrow">
                  <ArrowRight size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose WarkaHub?</h2>
            <p>We make event planning simple, secure, and stress-free</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started in three simple steps</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon"><Search size={40} /></div>
              <h3>Search & Compare</h3>
              <p>Browse verified vendors, compare prices, and read reviews</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon"><Calendar size={40} /></div>
              <h3>Book & Pay</h3>
              <p>Select your date, confirm details, and pay securely</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon"><CheckCircle size={40} /></div>
              <h3>Enjoy Your Event</h3>
              <p>Relax while professionals handle everything</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content card-glass">
            <div className="cta-text">
              <h2>Ready to Plan Your Event?</h2>
              <p>Join thousands of satisfied customers who trust WarkaHub</p>
            </div>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          min-height: 100vh;
        }

        /* Hero Section */
        .hero {
          position: relative;
          padding: 6rem 0 4rem;
          overflow: hidden;
          background: var(--gradient-hero);
          color: var(--color-white);
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(34, 181, 116, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(244, 166, 35, 0.2) 0%, transparent 50%);
          animation: pulse 8s ease-in-out infinite;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffb84d 0%, #f4a623 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.375rem);
          margin-bottom: 2.5rem;
          opacity: 0.95;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        .quick-search {
          display: flex;
          gap: 1rem;
          max-width: 600px;
          margin: 0 auto;
          padding: 1rem;
        }

        .search-input {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: var(--radius-md);
          font-size: 1rem;
          background: var(--color-white);
        }

        /* Stats Section */
        .stats-section {
          padding: 3rem 0;
          background: var(--color-white);
          margin-top: -2rem;
          position: relative;
          z-index: 2;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .stat-card {
          text-align: center;
          padding: 1.5rem;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-primary);
          font-family: var(--font-heading);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: var(--color-gray);
          font-weight: 500;
        }

        /* Services Section */
        .services-section {
          padding: 4rem 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          margin-bottom: 0.75rem;
        }

        .section-header p {
          color: var(--color-gray);
          font-size: 1.125rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .service-card {
          text-align: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--service-color);
          transform: scaleX(0);
          transition: transform var(--transition-normal);
        }

        .service-card:hover::before {
          transform: scaleX(1);
        }

        .service-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }

        .service-name {
          font-size: 1.375rem;
          margin-bottom: 0.5rem;
        }

        .service-count {
          color: var(--color-gray);
          margin-bottom: 0;
        }

        .service-arrow {
          margin-top: 1rem;
          color: var(--color-primary);
          opacity: 0;
          transform: translateX(-10px);
          transition: all var(--transition-normal);
        }

        .service-card:hover .service-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Features Section */
        .features-section {
          padding: 4rem 0;
          background: var(--color-light);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          text-align: center;
          padding: 2.5rem 2rem;
        }

        .feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: var(--gradient-primary);
          color: var(--color-white);
          border-radius: 50%;
          margin-bottom: 1.5rem;
        }

        .feature-card h3 {
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: var(--color-gray);
          margin-bottom: 0;
        }

        /* How It Works */
        .how-it-works {
          padding: 4rem 0;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          position: relative;
        }

        .step-card {
          text-align: center;
          padding: 2rem;
          position: relative;
        }

        .step-number {
          position: absolute;
          top: -1rem;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          background: var(--gradient-secondary);
          color: var(--color-dark);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 800;
          font-family: var(--font-heading);
        }

        .step-icon {
          margin: 2rem 0 1.5rem;
          color: var(--color-primary);
        }

        .step-card h3 {
          margin-bottom: 1rem;
        }

        .step-card p {
          color: var(--color-gray);
          margin-bottom: 0;
        }

        /* CTA Section */
        .cta-section {
          padding: 4rem 0;
        }

        .cta-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 3rem;
          gap: 2rem;
        }

        .cta-text h2 {
          margin-bottom: 0.5rem;
        }

        .cta-text p {
          color: var(--color-gray);
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 4rem 0 3rem;
          }

          .quick-search {
            flex-direction: column;
          }

          .cta-content {
            flex-direction: column;
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};
