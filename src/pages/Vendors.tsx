import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, Star, Check, Shield } from 'lucide-react';
import type { ServiceType, VendorProfile } from '../types';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Vendors = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedService, setSelectedService] = useState<ServiceType | 'all'>((searchParams.get('type') as ServiceType) || 'all');
    const [showFilters, setShowFilters] = useState(false);

    // State for data
    const [vendors, setVendors] = useState<Partial<VendorProfile>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendors = async () => {
            setLoading(true);
            try {
                let query = supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'vendor');

                const { data, error } = await query;

                if (error) throw error;

                if (data) {
                    const mappedVendors = data.map(v => ({
                        id: v.id,
                        businessName: v.business_name || v.full_name,
                        serviceType: v.service_types || [],
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

    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = (vendor.businessName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (vendor.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesService = selectedService === 'all' || (vendor.serviceType as string[]).includes(selectedService);

        return matchesSearch && matchesService;
    });

    const categories: { id: ServiceType | 'all', label: string, icon: string }[] = [
        { id: 'all', label: 'All Services', icon: '✨' },
        { id: 'catering', label: 'Catering', icon: '🍽️' },
        { id: 'venue', label: 'Venues', icon: '🏛️' },
        { id: 'decoration', label: 'Decoration', icon: '🎨' },
        { id: 'music', label: 'Music & Bands', icon: '🎵' },
        { id: 'photography', label: 'Photography', icon: '📸' },
        { id: 'planning', label: 'Event Planning', icon: '📋' },
    ];

    return (
        <div className="vendors-page min-h-screen">
            <SEO title="Browse Vendors" description="Discover and compare the best event vendors in Ethiopia. Verified caterers, decorators, and more." />
            {/* Header Section */}
            <section className="bg-primary text-white py-xl mb-lg" style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                <div className="container">
                    <h1 className="text-white mb-sm">Find Your Perfect Vendor</h1>
                    <p className="opacity-90 mb-lg">Browse Ethiopia's most trusted event service providers</p>

                    <div className="card-glass p-sm flex gap-md flex-wrap">
                        <div className="relative flex-1" style={{ minWidth: '300px' }}>
                            <Search className="absolute left-3 top-3 text-gray" size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-gray)' }} />
                            <input
                                type="text"
                                className="input w-full pl-xl"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="Search by name, service, or location..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    updateFilters('search', e.target.value);
                                }}
                            />
                        </div>
                        <button
                            className="btn btn-ghost flex-center gap-xs"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={18} /> Filters
                        </button>
                    </div>
                </div>
            </section>

            <div className="container pb-2xl">
                <div className="flex gap-xl flex-wrap">
                    {/* Sidebar Filters */}
                    {(showFilters || window.innerWidth > 1024) && (
                        <aside className="w-full lg:w-1/4" style={{ flex: '0 0 280px' }}>
                            <div className="card sticky top-24">
                                <h3 className="mb-md">Categories</h3>
                                <div className="flex-column gap-xs">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            className={`p-sm text-left rounded transition flex-between ${selectedService === cat.id ? 'bg-primary text-white font-bold' : 'hover:bg-light text-gray'}`}
                                            style={{
                                                border: 'none',
                                                background: selectedService === cat.id ? 'var(--color-primary)' : 'transparent',
                                                color: selectedService === cat.id ? 'white' : 'inherit',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handleTypeChange(cat.id)}
                                        >
                                            <span>{cat.icon} {cat.label}</span>
                                            {selectedService === cat.id && <Check size={16} />}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-lg pt-lg border-t" style={{ borderTop: '1px solid #eee' }}>
                                    <h3 className="mb-md">Price Range</h3>
                                    <div className="flex-column gap-sm">
                                        <div className="flex-center gap-xs">
                                            <input type="number" className="input p-xs" placeholder="Min" />
                                            <span>-</span>
                                            <input type="number" className="input p-xs" placeholder="Max" />
                                        </div>
                                        <button className="btn btn-primary btn-sm w-full">Apply Price</button>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    )}

                    {/* Vendors Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="flex-center py-2xl flex-column gap-md">
                                <div className="animate-pulse bg-gray-light rounded" style={{ width: '48px', height: '48px' }}></div>
                                <p className="text-gray">Loading amazing vendors...</p>
                            </div>
                        ) : filteredVendors.length > 0 ? (
                            <motion.div
                                className="grid grid-2 gap-lg"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                            >
                                {filteredVendors.map(vendor => (
                                    <motion.div
                                        key={vendor.id}
                                        className="card vendor-card animate-fade-in p-0 overflow-hidden flex-column"
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                    >
                                        <div className="relative h-48 overflow-hidden" style={{ height: '200px' }}>
                                            <img
                                                src={vendor.images?.[0]}
                                                alt={vendor.businessName}
                                                className="w-full h-full object-cover transition transform hover:scale-105"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            {vendor.isVerified && (
                                                <div className="absolute bottom-3 left-3 bg-primary text-white px-2 py-1 rounded flex items-center gap-xs text-xs font-bold" style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'var(--color-primary)', color: 'white', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Shield size={14} /> Verified
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-md flex-1 flex-column">
                                            <div className="flex-between mb-xs">
                                                <span className="text-xs font-bold text-primary uppercase">{vendor.serviceType?.[0]}</span>
                                                <div className="flex-center gap-xs">
                                                    <Star size={14} fill="var(--color-secondary)" color="var(--color-secondary)" />
                                                    <span className="text-sm font-bold">{vendor.rating}</span>
                                                    <span className="text-xs text-gray">({vendor.reviewCount})</span>
                                                </div>
                                            </div>

                                            <h3 className="text-lg mb-xs">{vendor.businessName}</h3>

                                            <div className="flex items-center gap-xs text-gray text-sm mb-md">
                                                <MapPin size={14} /> {vendor.location}
                                            </div>

                                            <p className="text-gray text-sm line-clamp-2 mb-lg flex-1">
                                                {vendor.description}
                                            </p>

                                            <div className="flex-between border-t pt-md mt-auto" style={{ borderTop: '1px solid #eee' }}>
                                                <div>
                                                    <span className="text-xs text-gray block">Starting from</span>
                                                    <span className="font-bold text-primary">{vendor.priceRange?.min.toLocaleString()} ETB</span>
                                                </div>
                                                <Link to={`/vendors/${vendor.id}`} className="btn btn-outline btn-sm">
                                                    Details
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="card text-center py-2xl">
                                <Search size={48} className="text-gray-light mb-md mx-auto" style={{ margin: '0 auto 1rem' }} />
                                <h3>No vendors found</h3>
                                <p className="text-gray">Try adjusting your filters or search terms</p>
                                <button
                                    className="btn btn-primary mt-lg"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedService('all');
                                        setSearchParams({});
                                    }}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Vendors;
