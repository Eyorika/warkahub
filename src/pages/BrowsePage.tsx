import { useState } from 'react';
import { Search, Filter, Star, MapPin, DollarSign, Shield, Crown } from 'lucide-react';
import type { VendorProfile, ServiceType, SearchFilters } from '../types';

// Mock data - replace with API calls
const mockVendors: VendorProfile[] = [
    {
        id: '1',
        name: 'Abebe Catering',
        email: 'abebe@example.com',
        phone: '+251911234567',
        role: 'vendor',
        businessName: 'Abebe Traditional Catering',
        serviceType: ['catering'],
        description: 'Authentic Ethiopian cuisine for all occasions. Specializing in traditional dishes and modern fusion.',
        priceRange: { min: 5000, max: 15000 },
        location: 'Bole, Addis Ababa',
        images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'],
        rating: 4.8,
        reviewCount: 127,
        subscriptionTier: 'premium',
        isVerified: true,
        createdAt: '2024-01-01',
    },
    {
        id: '2',
        name: 'Selam Events',
        email: 'selam@example.com',
        phone: '+251922345678',
        role: 'vendor',
        businessName: 'Selam Event Decoration',
        serviceType: ['decoration'],
        description: 'Creating magical moments with stunning decorations. Weddings, birthdays, and corporate events.',
        priceRange: { min: 8000, max: 25000 },
        location: 'Megenagna, Addis Ababa',
        images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'],
        rating: 4.9,
        reviewCount: 89,
        subscriptionTier: 'pro',
        isVerified: true,
        createdAt: '2024-01-15',
    },
    {
        id: '3',
        name: 'Dawit Photography',
        email: 'dawit@example.com',
        phone: '+251933456789',
        role: 'vendor',
        businessName: 'Dawit Professional Photography',
        serviceType: ['photography', 'videography'],
        description: 'Capturing your precious moments with artistic excellence. 10+ years of experience.',
        priceRange: { min: 10000, max: 30000 },
        location: 'Piassa, Addis Ababa',
        images: ['https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800'],
        rating: 4.7,
        reviewCount: 156,
        subscriptionTier: 'premium',
        isVerified: true,
        createdAt: '2024-02-01',
    },
];

export const BrowsePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilters>({});
    const [showFilters, setShowFilters] = useState(false);
    const [vendors] = useState<VendorProfile[]>(mockVendors);

    const serviceTypes: ServiceType[] = ['catering', 'decoration', 'photography', 'videography', 'music', 'venue', 'planning'];

    return (
        <div className="browse-page">
            <div className="browse-header">
                <div className="container">
                    <h1>Find Your Perfect Vendor</h1>
                    <p>Browse {vendors.length}+ verified service providers</p>

                    <div className="search-bar">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, service, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button
                            className="filter-toggle btn btn-outline"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={20} />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="browse-content">
                    {/* Filters Sidebar */}
                    {showFilters && (
                        <aside className="filters-sidebar card animate-slide-in">
                            <h3>Filters</h3>

                            <div className="filter-section">
                                <h4>Service Type</h4>
                                <div className="filter-options">
                                    {serviceTypes.map((service) => (
                                        <label key={service} className="checkbox-label">
                                            <input type="checkbox" />
                                            <span>{service.charAt(0).toUpperCase() + service.slice(1)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-section">
                                <h4>Price Range (Birr)</h4>
                                <div className="price-inputs">
                                    <input type="number" placeholder="Min" className="input" />
                                    <span>-</span>
                                    <input type="number" placeholder="Max" className="input" />
                                </div>
                            </div>

                            <div className="filter-section">
                                <h4>Rating</h4>
                                <div className="filter-options">
                                    {[5, 4, 3].map((rating) => (
                                        <label key={rating} className="checkbox-label">
                                            <input type="checkbox" />
                                            <span>
                                                {rating}+ <Star size={16} className="inline-star" />
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-section">
                                <label className="checkbox-label">
                                    <input type="checkbox" />
                                    <span>
                                        <Shield size={16} className="inline-icon" />
                                        Verified Only
                                    </span>
                                </label>
                            </div>

                            <button className="btn btn-primary" style={{ width: '100%' }}>
                                Apply Filters
                            </button>
                        </aside>
                    )}

                    {/* Vendors Grid */}
                    <div className="vendors-grid">
                        {vendors.map((vendor) => (
                            <div key={vendor.id} className="vendor-card card">
                                {vendor.subscriptionTier === 'premium' && (
                                    <div className="premium-badge badge badge-secondary">
                                        <Crown size={14} />
                                        Premium
                                    </div>
                                )}

                                <div className="vendor-image">
                                    <img src={vendor.images[0]} alt={vendor.businessName} />
                                    {vendor.isVerified && (
                                        <div className="verified-badge">
                                            <Shield size={16} />
                                        </div>
                                    )}
                                </div>

                                <div className="vendor-info">
                                    <h3>{vendor.businessName}</h3>

                                    <div className="vendor-meta">
                                        <div className="rating">
                                            <Star size={16} fill="currentColor" />
                                            <span>{vendor.rating}</span>
                                            <span className="review-count">({vendor.reviewCount} reviews)</span>
                                        </div>
                                    </div>

                                    <div className="vendor-services">
                                        {vendor.serviceType.map((service) => (
                                            <span key={service} className="service-tag badge badge-primary">
                                                {service}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="vendor-description">{vendor.description}</p>

                                    <div className="vendor-details">
                                        <div className="detail-item">
                                            <MapPin size={16} />
                                            <span>{vendor.location}</span>
                                        </div>
                                        <div className="detail-item">
                                            <DollarSign size={16} />
                                            <span>{vendor.priceRange.min.toLocaleString()} - {vendor.priceRange.max.toLocaleString()} Birr</span>
                                        </div>
                                    </div>

                                    <button className="btn btn-primary" style={{ width: '100%' }}>
                                        View Profile & Book
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        .browse-page {
          min-height: 100vh;
          padding-bottom: 2rem;
        }

        .browse-header {
          background: var(--gradient-primary);
          color: var(--color-white);
          padding: 3rem 0 2rem;
          margin-bottom: 2rem;
        }

        .browse-header h1 {
          color: var(--color-white);
          margin-bottom: 0.5rem;
        }

        .browse-header p {
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .search-bar {
          display: flex;
          gap: 1rem;
          max-width: 800px;
          background: var(--color-white);
          padding: 0.75rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }

        .search-icon {
          margin-left: 0.5rem;
          color: var(--color-gray);
        }

        .search-input {
          flex: 1;
          border: none;
          font-size: 1rem;
          padding: 0.5rem;
          outline: none;
        }

        .filter-toggle {
          white-space: nowrap;
        }

        .browse-content {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          align-items: start;
        }

        .filters-sidebar {
          position: sticky;
          top: 100px;
          padding: 1.5rem;
        }

        .filters-sidebar h3 {
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
        }

        .filter-section {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--color-light);
        }

        .filter-section:last-of-type {
          border-bottom: none;
        }

        .filter-section h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--color-gray);
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.9375rem;
        }

        .checkbox-label input[type="checkbox"] {
          cursor: pointer;
        }

        .inline-star,
        .inline-icon {
          color: var(--color-secondary);
          vertical-align: middle;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .price-inputs .input {
          flex: 1;
          padding: 0.5rem;
          font-size: 0.875rem;
        }

        .vendors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .vendor-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .premium-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 2;
        }

        .vendor-image {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
        }

        .vendor-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .vendor-card:hover .vendor-image img {
          transform: scale(1.05);
        }

        .verified-badge {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          background: var(--color-primary);
          color: var(--color-white);
          padding: 0.375rem 0.625rem;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .vendor-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .vendor-info h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .vendor-meta {
          margin-bottom: 0.75rem;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: var(--color-secondary);
          font-weight: 600;
        }

        .review-count {
          color: var(--color-gray);
          font-weight: 400;
          font-size: 0.875rem;
        }

        .vendor-services {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .service-tag {
          font-size: 0.75rem;
        }

        .vendor-description {
          color: var(--color-gray);
          font-size: 0.9375rem;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .vendor-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-gray);
          font-size: 0.875rem;
        }

        .detail-item svg {
          color: var(--color-primary);
        }

        @media (max-width: 1024px) {
          .browse-content {
            grid-template-columns: 1fr;
          }

          .filters-sidebar {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .search-bar {
            flex-direction: column;
          }

          .vendors-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};
