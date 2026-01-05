import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar, Package, MapPin, Clock,
    Shield, ArrowRight, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Booking } from '../types';
import SEO from '../components/SEO';

type ClientBooking = Booking & {
    vendorName?: string;
    vendorLocation?: string;
    vendorRating?: number;
};

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<ClientBooking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch bookings and join with vendor profiles if they exist
            const { data, error } = await supabase
                .from('bookings')
                .select('*, profiles:vendor_id(business_name, full_name, location, rating)')
                .eq('customer_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const transformed: ClientBooking[] = data.map(b => ({
                    id: b.id,
                    customerId: b.customer_id,
                    vendorId: b.vendor_id,
                    eventType: b.event_type,
                    eventDate: b.event_date,
                    eventTime: b.event_time,
                    location: b.location,
                    guestCount: b.guest_count,
                    budget: b.budget,
                    specialRequirements: b.special_requirements,
                    status: b.status,
                    paymentStatus: b.payment_status,
                    paymentMethod: b.payment_method,
                    createdAt: b.created_at,
                    updatedAt: b.updated_at,
                    vendorName: b.profiles?.business_name || b.profiles?.full_name,
                    vendorLocation: b.profiles?.location,
                    vendorRating: b.profiles?.rating
                }));
                setBookings(transformed);
            }
        } catch (error) {
            console.error('Error fetching client bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [user]);

    if (loading) return <div className="p-xl text-center">Loading your bookings...</div>;

    return (
        <div className="my-bookings-page bg-light min-h-screen py-xl">
            <SEO title="My Bookings" description="Manage your event bookings and track vendor matching status." />
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="flex-between mb-xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1>My Bookings</h1>
                        <p className="text-gray">Track your event requests and matched vendors.</p>
                    </motion.div>
                    <Link to="/request-service" className="btn btn-primary">
                        Find a Vendor <Package size={18} />
                    </Link>
                </div>

                {bookings.length > 0 ? (
                    <motion.div
                        className="flex-column gap-lg"
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
                        {bookings.map((booking) => (
                            <motion.div
                                key={booking.id}
                                className="card p-0 overflow-hidden shadow-sm"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                <div className="flex-between p-md border-b bg-white">
                                    <div className="flex items-center gap-md">
                                        <div className="p-sm rounded bg-primary-light text-primary">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold capitalize">{booking.eventType} Request</div>
                                            <div className="text-xs text-gray">Ref: {booking.id.slice(0, 8)}</div>
                                        </div>
                                    </div>
                                    <div className="flex-column items-end">
                                        <span className={`badge ${booking.status === 'confirmed' ? 'badge-primary' :
                                            booking.status === 'matched' ? 'badge-secondary' :
                                                'badge-gray'
                                            }`}>
                                            {booking.status === 'pending_match' ? 'Searching for Vendor' : booking.status.replace('_', ' ')}
                                        </span>
                                        <div className="text-xs text-gray mt-xs">{booking.eventDate}</div>
                                    </div>
                                </div>

                                <div className="p-md grid grid-2 gap-md bg-white">
                                    <div className="flex-column gap-sm">
                                        <div className="flex items-center gap-xs text-sm text-gray">
                                            <MapPin size={16} /> {booking.location}
                                        </div>
                                        <div className="flex items-center gap-xs text-sm text-gray">
                                            <Clock size={16} /> {booking.eventTime}
                                        </div>
                                        <div className="font-bold text-primary">
                                            Budget: {booking.budget.toLocaleString()} ETB
                                        </div>
                                    </div>

                                    {booking.vendorId ? (
                                        <div className="p-md bg-light rounded flex items-center gap-md border" style={{ borderColor: 'var(--color-primary-light)' }}>
                                            <div className="w-12 h-12 bg-white rounded-circle flex-center border" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
                                                <User size={24} className="text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs text-gray uppercase font-bold">Matched Vendor</div>
                                                <div className="font-bold text-lg">{booking.vendorName}</div>
                                                {booking.status === 'matched' ? (
                                                    <div className="text-xs text-accent font-bold">Waiting for Acceptance...</div>
                                                ) : (
                                                    <div className="text-xs text-primary font-bold flex items-center gap-xs">
                                                        <Shield size={12} /> Confirmed Vendor
                                                    </div>
                                                )}
                                            </div>
                                            <Link to={`/vendors/${booking.vendorId}`} className="btn btn-ghost btn-sm">
                                                View <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="p-md bg-light rounded flex-center flex-column gap-xs border border-dashed">
                                            <Clock size={24} className="text-gray opacity-50" />
                                            <div className="text-sm text-gray font-bold">Matching in progress...</div>
                                            <p className="text-xs text-gray text-center px-lg">Our team is finding the best {booking.eventType} providers for you.</p>
                                        </div>
                                    )}
                                </div>

                                {booking.specialRequirements && (
                                    <div className="p-md bg-light-gray border-t text-sm italic text-gray">
                                        " {booking.specialRequirements} "
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="card text-center py-2xl">
                        <Package size={64} className="text-gray opacity-20 mx-auto mb-md" />
                        <h2>No bookings yet</h2>
                        <p className="text-gray mb-lg">Start planning your event by requesting a service.</p>
                        <Link to="/request-service" className="btn btn-primary">
                            Make a Request
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
