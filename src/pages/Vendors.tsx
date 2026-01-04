import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, Star, Check } from 'lucide-react';
import type { ServiceType, VendorProfile } from '../types';
import { supabase } from '../lib/supabase';

const Vendors = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedService, setSelectedService] = useState<ServiceType | 'all'>((searchParams.get('type') as ServiceType) || 'all');

    // State for data
    const [vendors, setVendors] = useState<Partial<VendorProfile>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                let query = supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'vendor');

                // Add more filters here if needed (e.g. verified status)

                const { data, error } = await query;

                if (error) throw error;

                if (data) {
                    const mappedVendors = data.map(v => ({
                        id: v.id,
                        name: v.business_name || v.full_name, // Using name for UI consistency
                        businessName: v.business_name || v.full_name,
                        serviceType: v.service_types || [], // Should be an array in DB
                        rating: v.rating || 0,
                        reviewCount: v.review_count || 0,
                        location: v.location || 'Addis Ababa',
                        priceRange: { min: v.price_min || 0, max: v.price_max || 0 },
                        images: v.avatar_url ? [v.avatar_url] : ['https://images.unsplash.com/photo-1555244162-803834f70033?w=800'],
                        isVerified: v.is_verified,
                        description: v.description
                    }));
                    setVendors(mappedVendors);
                }
            } catch (error) {
                console.error('Error fetching vendors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    // Update URL function
    const updateFilters = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value && value !== 'all') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const handleTypeChange = (type: ServiceType | 'all') => {
        setSelectedService(type);
        updateFilters('type', type);
    };

    // Filter Logic (Client-side for now, can move to DB)
    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = (vendor.businessName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (vendor.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesService = selectedService === 'all' || (vendor.serviceType as string[])?.includes(selectedService);

        return matchesSearch && matchesService;
    });

    const categories: { id: ServiceType | 'all', label: string }[] = [
        { id: 'all', label: 'All Services' },
        { id: 'catering', label: 'Catering' },
        { id: 'venue', label: 'Venues' },
        { id: 'decoration', label: 'Decoration' },
        { id: 'music', label: 'Music & Bands' },
        { id: 'photography', label: 'Photography' },
        { id: 'planning', label: 'Event Planning' },
    ];

    return (
        <div className="vendors-page animate-fade-in py-lg">
            <div className="container">
                {/* Header & Search */}
                <div className="flex-between mb-lg flex-wrap gap-md">
                    <div>
                        <h1 className="mb-xs">Find Best Vendors</h1>
                        <p className="text-gray">Discover top-rated professionals for your event</p>
                    </div>

                    <div className="flex gap-sm flex-wrap">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray" size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                            <input
                                type="text"
                                className="input pl-xl"
                                style={{ paddingLeft: '2.5rem', width: '300px' }}
                                placeholder="Search vendors..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    updateFilters('search', e.target.value);
                                }}
                            />
                        </div>
                        <button className="btn btn-outline flex-center gap-xs">
                            <Filter size={18} /> Filters
                        </button>
                    </div>
                </div>

                <div className="grid gap-lg" style={{ gridTemplateColumns: '250px 1fr' }}>
                    {/* Sidebar Filters */}
                    <aside className="filters-sidebar">
                        <div className="card sticky top-4" style={{ position: 'sticky', top: '2rem' }}>
                            <div className="flex-between mb-md">
                                <h3 className="mb-0">Categories</h3>
                                <Filter size={16} className="text-gray" />
                            </div>

                            <div className="flex-column gap-xs">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`p-sm text-left rounded transition ${selectedService === cat.id ? 'bg-primary-light text-primary font-bold' : 'hover:bg-light text-gray'}`}
                                        style={{
                                            border: 'none',
                                            background: selectedService === cat.id ? 'rgba(26, 143, 92, 0.1)' : 'transparent',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleTypeChange(cat.id)}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-lg pt-lg border-t" style={{ borderTop: '1px solid #eee' }}>
                                <h3 className="mb-md">Price Range</h3>
                                <div className="flex-center gap-xs">
                                    <input type="number" className="input p-xs" placeholder="Min" />
                                    <span>-</span>
                                    <input type="number" className="input p-xs" placeholder="Max" />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Vendors Grid */}
                    <main>
                        {loading ? (
                            <div className="text-center py-2xl">
                                <p>Loading vendors...</p>
                            </div>
                        ) : filteredVendors.length > 0 ? (
                            <div className="grid grid-2 gap-md">
                                {filteredVendors.map(vendor => (
                                    <Link to={`/vendors/${vendor.id}`} key={vendor.id} className="card vendor-card hover:shadow-lg transition">
                                        <div className="vendor-image-container">
                                            <img src={vendor.images?.[0]} alt={vendor.businessName} className="vendor-image" />
                                            {vendor.isVerified && (
                                                <div className="vendor-badge">
                                                    <Check size={12} /> Verified
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-sm">
                                            <div className="flex-between mb-xs">
                                                <span className="text-xs font-bold text-primary uppercase">{vendor.serviceType?.[0]}</span>
                                                <div className="flex-center gap-xs">
                                                    <Star size={14} fill="#f4a623" color="#f4a623" />
                                                    <span className="text-sm font-bold">{vendor.rating}</span>
                                                    <span className="text-xs text-gray">({vendor.reviewCount})</span>
                                                </div>
                                            </div>
                                            <h3 className="text-lg mb-xs">{vendor.businessName}</h3>
                                            <div className="flex-center gap-xs text-gray text-sm mb-sm">
                                                <MapPin size={14} /> {vendor.location}
                                            </div>
                                            <p className="text-gray text-xs line-clamp-2 mb-sm" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {vendor.description}
                                            </p>
                                            <div className="flex-between border-t pt-sm" style={{ borderTop: '1px solid #eee' }}>
                                                <span className="text-sm text-gray">Starting from</span>
                                                <span className="font-bold text-primary">{vendor.priceRange?.min.toLocaleString()} ETB</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-2xl bg-white rounded">
                                <h3 className="text-gray">No vendors found</h3>
                                <p className="text-gray-light">Try adjusting your filters or search terms</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Vendors;
