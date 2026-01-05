import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Check, Phone, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { VendorProfile } from '../types';
import SEO from '../components/SEO';

const VendorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [vendor, setVendor] = useState<Partial<VendorProfile> | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'portfolio'>('about');
    const [submitting, setSubmitting] = useState(false);
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    const [bookingForm, setBookingForm] = useState({
        date: '',
        time: '',
        guests: '',
        eventType: 'wedding'
    });

    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        const fetchVendorAndReviews = async () => {
            if (!id) return;
            try {
                // Fetch Vendor Info
                const { data: vendorData, error: vendorError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (vendorError) throw vendorError;

                if (vendorData) {
                    setVendor({
                        id: vendorData.id,
                        name: vendorData.full_name,
                        businessName: vendorData.business_name || vendorData.full_name,
                        serviceType: vendorData.service_types || ['catering'],
                        rating: vendorData.rating || 0,
                        reviewCount: vendorData.review_count || 0,
                        images: vendorData.avatar_url ? [vendorData.avatar_url] : ['https://images.unsplash.com/photo-1555244162-803834f70033?w=800'],
                        location: vendorData.location || 'Addis Ababa',
                        priceRange: { min: vendorData.price_min || 0, max: vendorData.price_max || 0 },
                        description: vendorData.description || 'No description available.',
                        isVerified: vendorData.is_verified,
                        features: ['Verified Vendor', 'Professional Service', 'Responsive'],
                        phone: vendorData.phone || '+251 900 000 000',
                        email: vendorData.email
                    });
                }

                // Fetch Reviews
                const { data: reviewsData, error: reviewsError } = await supabase
                    .from('reviews')
                    .select('*, profiles:customer_id(full_name, avatar_url)')
                    .eq('vendor_id', id)
                    .order('created_at', { ascending: false });

                if (reviewsError) throw reviewsError;
                setReviews(reviewsData || []);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVendorAndReviews();
    }, [id]);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert("Please login to book a vendor");
            navigate('/login');
            return;
        }

        if (user.role === 'vendor') {
            alert("Vendors cannot make bookings. Please login as a customer.");
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('bookings')
                .insert([{
                    customer_id: user.id,
                    vendor_id: vendor?.id,
                    event_date: bookingForm.date,
                    event_time: bookingForm.time,
                    event_type: bookingForm.eventType,
                    guest_count: parseInt(bookingForm.guests) || 0,
                    status: 'pending',
                    amount: vendor?.priceRange?.min || 0
                }]);

            if (error) throw error;

            alert("Booking request sent successfully!");
            setBookingForm({ date: '', time: '', guests: '', eventType: 'wedding' });

        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to submit booking");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert("Please login to leave a review");
            navigate('/login');
            return;
        }

        setReviewSubmitting(true);
        try {
            const { data: bookingData } = await supabase
                .from('bookings')
                .select('id')
                .eq('customer_id', user.id)
                .eq('vendor_id', id)
                .limit(1)
                .single();

            if (!bookingData) {
                throw new Error("You must have a booking with this vendor to leave a review.");
            }

            const { error } = await supabase
                .from('reviews')
                .insert([{
                    booking_id: bookingData.id,
                    customer_id: user.id,
                    vendor_id: id,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment
                }]);

            if (error) throw error;

            alert("Review submitted successfully!");
            setReviewForm({ rating: 5, comment: '' });

            // Refresh reviews
            const { data: newReviews } = await supabase
                .from('reviews')
                .select('*, profiles:customer_id(full_name, avatar_url)')
                .eq('vendor_id', id)
                .order('created_at', { ascending: false });

            setReviews(newReviews || []);

        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to submit review");
        } finally {
            setReviewSubmitting(false);
        }
    };


    if (loading) return <div className="text-center py-2xl">Loading...</div>;
    if (!vendor) return <div className="text-center py-2xl">Vendor not found</div>;

    return (
        <div className="vendor-details-page">
            <SEO
                title={`${vendor.businessName} | ${vendor.serviceType?.[0] || 'Vendor'} in ${vendor.location}`}
                description={vendor.description?.substring(0, 160)}
            />
            {/* Breadcrumb */}
            <div className="bg-white border-b py-sm">
                <div className="container">
                    <Link to="/vendors" className="flex-center gap-xs text-gray hover:text-primary" style={{ textDecoration: 'none' }}>
                        <ChevronLeft size={16} /> Back to Vendors
                    </Link>
                </div>
            </div>

            <div className="container mt-md">
                <div className="grid gap-lg vendor-details-grid">
                    {/* Main Content */}
                    <motion.div
                        className="details-content"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Hero Image */}
                        <div className="hero-image mb-md" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '400px' }}>
                            <img src={vendor.images?.[0]} alt={vendor.businessName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        {/* Header Info */}
                        <div className="mb-lg">
                            <div className="flex-between mb-sm flex-wrap gap-md">
                                <h1 className="mb-0">{vendor.businessName}</h1>
                                <div className="flex-center gap-xs">
                                    <Star size={24} fill="#f4a623" color="#f4a623" />
                                    <span className="text-xl font-bold">{vendor.rating}</span>
                                    <span className="text-gray">({vendor.reviewCount} reviews)</span>
                                </div>
                            </div>

                            <div className="flex gap-md text-gray mb-md flex-wrap">
                                <div className="flex-center gap-xs"><MapPin size={18} /> {vendor.location}</div>
                                <div className="flex-center gap-xs text-primary font-bold">
                                    {vendor.priceRange?.min.toLocaleString()} - {vendor.priceRange?.max.toLocaleString()} ETB
                                </div>
                                {vendor.isVerified && (
                                    <div className="flex-center gap-xs text-success"><Check size={18} /> Verified Vendor</div>
                                )}
                            </div>

                            {/* Tabs */}
                            <div className="tabs flex border-b mb-md overflow-x-auto">
                                {['about', 'portfolio', 'reviews'].map(tab => (
                                    <button
                                        key={tab}
                                        className={`tab-btn px-lg py-sm ${activeTab === tab ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray'}`}
                                        style={{ background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : 'none', cursor: 'pointer', textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                                        onClick={() => setActiveTab(tab as any)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="tab-content">
                                {activeTab === 'about' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <h3 className="mb-sm">About Us</h3>
                                        <p className="mb-lg text-gray leading-relaxed">{vendor.description}</p>

                                        {vendor.features && (
                                            <>
                                                <h3 className="mb-sm">Services & Features</h3>
                                                <div className="grid grid-2 gap-sm">
                                                    {vendor.features.map(feature => (
                                                        <div key={feature} className="flex-center gap-sm p-sm bg-light rounded" style={{ background: 'var(--color-light)', borderRadius: 'var(--radius-sm)' }}>
                                                            <Check size={16} className="text-primary" />
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'portfolio' && (
                                    <motion.div
                                        className="grid grid-2 gap-md"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        {vendor.images?.map((img, idx) => (
                                            <img key={idx} src={img} alt={`Portfolio ${idx}`} className="rounded hover:opacity-90 transition" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                                        ))}
                                        <p className="text-gray col-span-full text-center py-md">More images coming soon...</p>
                                    </motion.div>
                                )}

                                {activeTab === 'reviews' && (
                                    <motion.div
                                        className="reviews-section"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div className="flex-between mb-lg">
                                            <h3>Customer Reviews</h3>
                                            {user && user.role === 'customer' && (
                                                <button className="btn btn-outline btn-sm" onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}>
                                                    Write a Review
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex-column gap-lg mb-xl">
                                            {reviews.map((review) => (
                                                <div key={review.id} className="review-card p-md border rounded shadow-sm" style={{ border: '1px solid #eee' }}>
                                                    <div className="flex-between mb-sm">
                                                        <div className="flex-center gap-sm">
                                                            <div className="avatar rounded-full bg-light flex-center" style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '50%' }}>
                                                                {review.profiles?.avatar_url ? (
                                                                    <img src={review.profiles.avatar_url} alt={review.profiles.full_name} style={{ borderRadius: '50%', width: '100%', height: '100%' }} />
                                                                ) : (
                                                                    <span className="font-bold text-gray">{review.profiles?.full_name?.charAt(0) || 'U'}</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-sm">{review.profiles?.full_name || 'Anonymous User'}</div>
                                                                <div className="text-xs text-gray">{new Date(review.created_at).toLocaleDateString()}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex-center gap-xs">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={14} fill={i < review.rating ? "#f4a623" : "#eee"} color={i < review.rating ? "#f4a623" : "#eee"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray leading-relaxed">{review.comment}</p>
                                                </div>
                                            ))}
                                            {reviews.length === 0 && (
                                                <div className="text-center py-lg bg-light rounded" style={{ background: '#f9fafb' }}>
                                                    <p className="text-gray">No reviews yet. Be the first to share your experience!</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Review Form */}
                                        {user && user.role === 'customer' && (
                                            <div id="review-form" className="card p-lg bg-light" style={{ background: '#f9fafb' }}>
                                                <h4 className="mb-md">Share Your Experience</h4>
                                                <form onSubmit={handleReviewSubmit} className="flex-column gap-md">
                                                    <div className="form-group">
                                                        <label className="input-label">Rating</label>
                                                        <div className="flex gap-sm">
                                                            {[1, 2, 3, 4, 5].map((num) => (
                                                                <button
                                                                    key={num}
                                                                    type="button"
                                                                    className={`p-xs rounded transition ${reviewForm.rating >= num ? 'text-primary' : 'text-gray-light'}`}
                                                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                                                    onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                                                                >
                                                                    <Star size={24} fill={reviewForm.rating >= num ? "var(--color-primary)" : "none"} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="input-label">Comment</label>
                                                        <textarea
                                                            className="input"
                                                            rows={4}
                                                            placeholder="What was your experience with this vendor?"
                                                            required
                                                            value={reviewForm.comment}
                                                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        disabled={reviewSubmitting}
                                                    >
                                                        {reviewSubmitting ? 'Posting...' : 'Post Review'}
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Booking Sidebar */}
                    <motion.div
                        className="booking-sidebar"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="card sticky-sidebar shadow-lg">
                            <h3 className="mb-md">Book This Vendor</h3>

                            <form className="booking-form flex-column gap-md" onSubmit={handleBooking}>
                                <div className="form-group">
                                    <label className="input-label">Event Type</label>
                                    <select
                                        className="select"
                                        value={bookingForm.eventType}
                                        onChange={(e) => setBookingForm({ ...bookingForm, eventType: e.target.value })}
                                    >
                                        <option value="wedding">Wedding</option>
                                        <option value="birthday">Birthday</option>
                                        <option value="corporate">Corporate</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="grid grid-2 gap-sm">
                                    <div className="form-group">
                                        <label className="input-label">Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                className="input"
                                                required
                                                value={bookingForm.date}
                                                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Time</label>
                                        <input
                                            type="time"
                                            className="input"
                                            required
                                            value={bookingForm.time}
                                            onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="input-label">Estimated Guests</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="e.g. 200"
                                        required
                                        value={bookingForm.guests}
                                        onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                                    />
                                </div>

                                <div className="price-summary p-md bg-light rounded mb-sm" style={{ background: 'var(--color-light)', borderRadius: 'var(--radius-md)' }}>
                                    <div className="flex-between mb-xs">
                                        <span className="text-gray">Estimated Cost</span>
                                        <span>{vendor.priceRange?.min.toLocaleString()} ETB</span>
                                    </div>
                                    <p className="text-xs text-gray mt-xs">Final price may vary based on requirements.</p>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    style={{ width: '100%' }}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Sending Request...' : 'Request Booking'}
                                </button>
                                <p className="text-center text-xs text-gray mt-xs">You won't be charged yet</p>
                            </form>

                            <div className="mt-md pt-md border-t text-center" style={{ borderTop: '1px solid #eee' }}>
                                <a href={`tel:${vendor.phone}`} className="flex-center justify-center gap-xs text-primary font-bold no-underline">
                                    <Phone size={18} /> {vendor.phone}
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default VendorDetails;
