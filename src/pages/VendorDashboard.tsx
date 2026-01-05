import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar, DollarSign, Settings, Clock,
    CheckCircle, XCircle, ArrowRight, User, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Booking } from '../types';
import SEO from '../components/SEO';

type VendorBooking = Booking & { customerName: string; customerEmail: string };

const VendorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<VendorBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        confirmed: 0,
        pending: 0,
        matched: 0,
        revenue: 0
    });

    const fetchDashboardData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*, profiles:customer_id(full_name, email)')
                .eq('vendor_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const transformed: VendorBooking[] = data.map(b => ({
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
                    customerName: b.profiles?.full_name || 'Guest',
                    customerEmail: b.profiles?.email || ''
                }));

                setBookings(transformed);

                // Calculate stats
                const results = {
                    total: transformed.length,
                    confirmed: transformed.filter(b => b.status === 'confirmed' || b.status === 'completed').length,
                    pending: transformed.filter(b => b.status === 'pending_match').length, // Should ideally be 0 if vendor_id is set but keeping for consistency
                    matched: transformed.filter(b => b.status === 'matched').length,
                    revenue: transformed
                        .filter(b => b.status === 'confirmed' || b.status === 'completed')
                        .reduce((sum, b) => sum + (b.budget || 0), 0)
                };
                setStats(results);
            }
        } catch (error) {
            console.error('Error fetching vendor data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const handleAction = async (bookingId: string, newStatus: 'confirmed' | 'pending_match' | 'cancelled') => {
        try {
            const updateData: any = { status: newStatus };

            // If declining a match, remove the vendor assignment so admins can re-match
            if (newStatus === 'pending_match') {
                updateData.vendor_id = null;
            }

            const { error } = await supabase
                .from('bookings')
                .update(updateData)
                .eq('id', bookingId);

            if (error) throw error;

            fetchDashboardData();
            alert(newStatus === 'confirmed' ? 'Booking confirmed!' : 'Match declined.');
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Action failed');
        }
    };

    if (!user || user.role !== 'vendor') {
        return (
            <div className="container py-xl text-center">
                <h2>Access Denied</h2>
                <p>Please login as a vendor to view this page.</p>
                <Link to="/login" className="btn btn-primary mt-md">Login</Link>
            </div>
        );
    }

    if (loading) return <div className="p-xl text-center">Loading dashboard...</div>;

    const statsConfig = [
        { label: 'Total Jobs', value: stats.total, icon: Calendar, color: 'text-primary' },
        { label: 'Total Revenue', value: `${stats.revenue.toLocaleString()} ETB`, icon: DollarSign, color: 'text-secondary-dark' },
        { label: 'New Matches', value: stats.matched, icon: Clock, color: 'text-accent' },
        { label: 'Active Events', value: stats.confirmed, icon: CheckCircle, color: 'text-primary' },
    ];

    const isProfileIncomplete = user && user.role === 'vendor' && (!(user as any).description || !user.phone);

    return (
        <div className="dashboard-page bg-light min-h-screen pb-xl">
            <SEO title="Vendor Dashboard" />
            <div className="bg-white border-b py-md mb-lg">
                <div className="container">
                    <div className="flex-between">
                        <div>
                            <h1>Vendor Dashboard</h1>
                            <p className="text-gray">Welcome, {user.name} {user.role === 'vendor' ? '(Vendor)' : ''}</p>
                        </div>
                        <div className="flex gap-sm">
                            <button onClick={() => navigate('/profile')} className="btn btn-outline btn-sm">
                                <User size={16} /> Profile
                            </button>
                            <button onClick={() => navigate('/profile/settings')} className="btn btn-primary btn-sm">
                                <Settings size={16} /> settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {isProfileIncomplete && (
                    <div className="card border-primary p-md flex-between mb-lg bg-primary-light animate-fade-in" style={{ borderColor: 'var(--color-primary)', background: 'rgba(26, 143, 92, 0.05)' }}>
                        <div className="flex-center gap-md">
                            <div className="text-primary">
                                <AlertCircle size={32} />
                            </div>
                            <div>
                                <h3 className="mb-xs text-primary">Your profile is incomplete</h3>
                                <p className="text-gray text-sm">Fill in your business description and pricing to start matching with more clients.</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/complete-profile')} className="btn btn-primary">
                            Complete Profile <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                <div className="grid grid-4 gap-md mb-lg">
                    {statsConfig.map((stat, i) => (
                        <div key={i} className="card p-md flex items-center gap-md">
                            <div className={`p-sm rounded-circle bg-light ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-gray text-xs font-bold uppercase">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-lg" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="card p-0 overflow-hidden">
                        <div className="p-md border-b flex-between">
                            <h3 className="m-0">Bookings & Matches</h3>
                            <button onClick={fetchDashboardData} className="btn btn-ghost btn-sm">Refresh</button>
                        </div>

                        <div className="table-wrapper overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="p-md text-xs uppercase text-gray">Customer</th>
                                        <th className="p-md text-xs uppercase text-gray">Event Info</th>
                                        <th className="p-md text-xs uppercase text-gray">Status</th>
                                        <th className="p-md text-xs uppercase text-gray">Earnings</th>
                                        <th className="p-md text-xs uppercase text-gray text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="border-b last:border-0 hover:bg-light transition">
                                            <td className="p-md">
                                                <div className="font-bold">{booking.customerName}</div>
                                                <div className="text-xs text-gray">{booking.customerEmail}</div>
                                            </td>
                                            <td className="p-md">
                                                <div className="text-sm font-bold capitalize">{booking.eventType}</div>
                                                <div className="text-xs text-gray">{booking.eventDate} @ {booking.eventTime}</div>
                                                <div className="text-xs text-gray">{booking.location}</div>
                                            </td>
                                            <td className="p-md">
                                                <span className={`badge ${booking.status === 'confirmed' ? 'badge-primary' :
                                                    booking.status === 'matched' ? 'badge-secondary' :
                                                        'badge-gray'
                                                    }`}>
                                                    {booking.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-md font-bold text-primary">
                                                {booking.budget.toLocaleString()} ETB
                                            </td>
                                            <td className="p-md text-right">
                                                {booking.status === 'matched' && (
                                                    <div className="flex-center justify-end gap-xs">
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => handleAction(booking.id, 'confirmed')}
                                                        >
                                                            <CheckCircle size={14} /> Accept
                                                        </button>
                                                        <button
                                                            className="btn btn-outline btn-sm border-accent text-accent"
                                                            onClick={() => handleAction(booking.id, 'pending_match')}
                                                            style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
                                                        >
                                                            <XCircle size={14} /> Decline
                                                        </button>
                                                    </div>
                                                )}
                                                {(booking.status === 'confirmed' || booking.status === 'completed') && (
                                                    <button className="btn btn-ghost btn-sm">
                                                        View Details <ArrowRight size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-xl text-center text-gray">
                                                <Calendar size={48} className="mx-auto mb-sm opacity-20" />
                                                <p>No bookings or matches yet.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
