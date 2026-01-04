import { Link } from 'react-router-dom';
import { Search, Calendar, Users, Award, TrendingUp, Shield, ArrowRight, Star, MapPin, Phone } from 'lucide-react';

const Home = () => {
    const featuredVendors = [
        {
            id: '1',
            name: 'Habesha Catering',
            type: 'Catering',
            rating: 4.9,
            reviews: 127,
            image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400',
            location: 'Bole, Addis Ababa',
            priceRange: '5,000 - 15,000 ETB',
            verified: true,
        },
        {
            id: '2',
            name: 'Elegant Events Decor',
            type: 'Decoration',
            rating: 4.8,
            reviews: 89,
            image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
            location: 'Kazanchis, Addis Ababa',
            priceRange: '8,000 - 25,000 ETB',
            verified: true,
        },
        {
            id: '3',
            name: 'Moments Photography',
            type: 'Photography',
            rating: 5.0,
            reviews: 156,
            image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
            location: 'Piazza, Addis Ababa',
            priceRange: '10,000 - 30,000 ETB',
            verified: true,
        },
    ];

    const stats = [
        { icon: Users, label: 'Active Vendors', value: '500+' },
        { icon: Calendar, label: 'Events Completed', value: '2,000+' },
        { icon: Star, label: 'Average Rating', value: '4.8' },
        { icon: TrendingUp, label: 'Customer Satisfaction', value: '98%' },
    ];

    const howItWorks = [
        {
            step: '1',
            title: 'Search & Filter',
            description: 'Browse verified vendors by service type, location, and budget',
            icon: Search,
        },
        {
            step: '2',
            title: 'Compare & Choose',
            description: 'Read reviews, compare prices, and select the perfect vendor',
            icon: Award,
        },
        {
            step: '3',
            title: 'Book & Pay',
            description: 'Secure your booking with Telebirr or Chapa payment',
            icon: Calendar,
        },
        {
            step: '4',
            title: 'Enjoy Your Event',
            description: 'Relax while professionals handle your special day',
            icon: Shield,
        },
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background"></div>
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title animate-fade-in">
                            Your Perfect Event
                            <span className="hero-title-accent"> Starts Here</span>
                        </h1>
                        <p className="hero-subtitle animate-fade-in">
                            Connect with Ethiopia's best caterers, decorators, photographers, and event professionals.
                            All verified, all in one place.
                        </p>

                        {/* Search Bar */}
                        <div className="hero-search animate-fade-in">
                            <div className="search-input-group">
                                <Search className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search for caterers, decorators, photographers..."
                                    className="search-input"
                                />
                            </div>
                            <Link to="/vendors" className="btn btn-primary">
                                Find Vendors
                                <ArrowRight size={20} />
                            </Link>
                        </div>

                        {/* Quick Service Buttons */}
                        <div className="hero-services">
                            <Link to="/vendors?type=catering" className="service-chip">🍽️ Catering</Link>
                            <Link to="/vendors?type=decoration" className="service-chip">🎨 Decoration</Link>
                            <Link to="/vendors?type=photography" className="service-chip">📸 Photography</Link>
                            <Link to="/vendors?type=venue" className="service-chip">🏛️ Venues</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card card-glass">
                                <stat.icon className="stat-icon" size={32} />
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Vendors */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Featured Vendors</h2>
                        <p>Top-rated professionals ready to make your event unforgettable</p>
                    </div>

                    <div className="vendors-grid">
                        {featuredVendors.map((vendor) => (
                            <Link to={`/vendors/${vendor.id}`} key={vendor.id} className="vendor-card card">
                                <div className="vendor-image-container">
                                    <img src={vendor.image} alt={vendor.name} className="vendor-image" />
                                    {vendor.verified && (
                                        <div className="vendor-badge badge-primary">
                                            <Shield size={14} />
                                            Verified
                                        </div>
                                    )}
                                </div>
                                <div className="vendor-info">
                                    <div className="vendor-header">
                                        <h3 className="vendor-name">{vendor.name}</h3>
                                        <div className="vendor-rating">
                                            <Star size={16} fill="currentColor" />
                                            <span>{vendor.rating}</span>
                                            <span className="vendor-reviews">({vendor.reviews})</span>
                                        </div>
                                    </div>
                                    <div className="vendor-type badge badge-secondary">{vendor.type}</div>
                                    <div className="vendor-details">
                                        <div className="vendor-detail">
                                            <MapPin size={16} />
                                            <span>{vendor.location}</span>
                                        </div>
                                        <div className="vendor-price">{vendor.priceRange}</div>
                                    </div>
                                    <button className="btn btn-outline btn-full">
                                        View Profile
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="section-cta">
                        <Link to="/vendors" className="btn btn-primary">
                            Browse All Vendors
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header">
                        <h2>How WarkaHub Works</h2>
                        <p>Four simple steps to your perfect event</p>
                    </div>

                    <div className="steps-grid">
                        {howItWorks.map((step, index) => (
                            <div key={index} className="step-card">
                                <div className="step-number">{step.step}</div>
                                <div className="step-icon-container">
                                    <step.icon className="step-icon" size={40} />
                                </div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Plan Your Event?</h2>
                        <p>Join thousands of satisfied customers who found their perfect vendors on WarkaHub</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Get Started Free
                                <ArrowRight size={20} />
                            </Link>
                            <Link to="/vendors" className="btn btn-outline btn-lg">
                                Browse Vendors
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vendor CTA */}
            <section className="vendor-cta-section">
                <div className="container">
                    <div className="vendor-cta-card card-glass">
                        <div className="vendor-cta-content">
                            <h2>Are You a Service Provider?</h2>
                            <p>Join WarkaHub and connect with customers looking for your services</p>
                            <ul className="vendor-benefits">
                                <li>✓ Reach thousands of potential customers</li>
                                <li>✓ Manage bookings easily</li>
                                <li>✓ Secure payments through Telebirr & Chapa</li>
                                <li>✓ Build your reputation with reviews</li>
                            </ul>
                            <Link to="/vendor/register" className="btn btn-secondary btn-lg">
                                Become a Vendor
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                        <div className="vendor-cta-image">
                            <Phone size={120} className="cta-icon" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
