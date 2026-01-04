import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Settings, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Booking {
    id: string;
    event_date: string;
    event_type: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    amount: number;
    profiles: { full_name: string; email: string; } | null;
}

const VendorDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        confirmed: 0,
        pending: 0,
        revenue: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;

            try {
                // Fetch bookings for this vendor
                const { data, error } = await supabase
                    .from('bookings')
                    .select('*, profiles:customer_id(full_name, email)')
                    .eq('vendor_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const typedData = data as any[];
                    setBookings(typedData);

                    // Calculate stats
                    const total = typedData.length;
                    const confirmed = typedData.filter(b => b.status === 'confirmed').length;
                    const pending = typedData.filter(b => b.status === 'pending').length;
                    const revenue = typedData
                        .filter(b => b.status === 'confirmed' || b.status === 'completed')
                        .reduce((sum, b) => sum + (b.amount || 0), 0);

                    setStats({ total, confirmed, pending, revenue });
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const updateStatus = async (bookingId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', bookingId);

            if (error) throw error;

            // Optimistic update
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: newStatus as any } : b
            ));

            // Recalc stats locally for better UX
            setStats(_prev => {
                // Simple recalculation - accurate enough for optimistic update
                const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status: newStatus as any } : b);
                return {
                    total: updatedBookings.length,
                    confirmed: updatedBookings.filter(b => b.status === 'confirmed').length,
                    pending: updatedBookings.filter(b => b.status === 'pending').length,
                    revenue: updatedBookings
                        .filter(b => b.status === 'confirmed' || b.status === 'completed')
                        .reduce((sum, b) => sum + (b.amount || 0), 0)
                };
            });

        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Failed to update status');
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
        { label: 'Total Bookings', value: stats.total, icon: Calendar, color: 'bg-primary-light text-primary' },
        { label: 'Total Revenue', value: `${stats.revenue.toLocaleString()} ETB`, icon: DollarSign, color: 'bg-secondary-light text-secondary-dark' },
        { label: 'Pending Requests', value: stats.pending, icon: Clock, color: 'bg-accent-light text-accent-dark' }, // Switched from Profile Views
        { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'bg-light text-gray' },
    ];

    return (
        <div className="dashboard-page bg-light min-h-screen pb-xl" style={{ background: '#f9fafb' }}>
            {/* Dashboard Header */}
            <div className="bg-white border-b py-md mb-lg">
                <div className="container">
                    <div className="flex-between">
                        <div>
                            <h1 className="text-2xl mb-xs">Vendor Dashboard</h1>
                            <p className="text-gray">Welcome back, {user.name}</p>
                        </div>
                        <button className="btn btn-primary">
                            <Settings size={18} /> Settings
                        </button>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Stats Grid */}
                <div className="grid grid-4 gap-md mb-lg">
                    {statsConfig.map((stat, i) => (
                        <div key={i} className="card flex-center gap-md p-md">
                            <div className={`p-sm rounded-full ${stat.color}`} style={{ borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-gray text-sm">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-lg" style={{ gridTemplateColumns: '2fr 1fr' }}>
                    {/* Recent Bookings */}
                    <div className="card">
                        <div className="flex-between mb-md">
                            <h3>Recent Bookings</h3>
                            <button className="text-primary hover:underline">View All</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse" style={{ width: '100%' }}>
                                <thead>
                                    <tr className="border-b" style={{ borderBottom: '1px solid #eee' }}>
                                        <th className="p-sm text-gray font-medium">Customer</th>
                                        <th className="p-sm text-gray font-medium">Date</th>
                                        <th className="p-sm text-gray font-medium">Type</th>
                                        <th className="p-sm text-gray font-medium">Status</th>
                                        <th className="p-sm text-gray font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="border-b last:border-0 hover:bg-light transition" style={{ borderBottom: '1px solid #eee' }}>
                                            <td className="p-sm">
                                                <div className="font-bold">{booking.profiles?.full_name || 'Guest'}</div>
                                                <div className="text-xs text-gray">{booking.profiles?.email}</div>
                                            </td>
                                            <td className="p-sm text-sm">{booking.event_date}</td>
                                            <td className="p-sm">
                                                <span className="badge badge-secondary text-xs capitalize">{booking.event_type}</span>
                                            </td>
                                            <td className="p-sm">
                                                <span className={`badge ${booking.status === 'confirmed' ? 'badge-success bg-green-100 text-green-800' :
                                                    booking.status === 'pending' ? 'badge-warning bg-yellow-100 text-yellow-800' :
                                                        'badge-gray'
                                                    }`}
                                                    style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '99px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        background: booking.status === 'confirmed' ? '#d1fae5' : booking.status === 'pending' ? '#fef3c7' : '#f3f4f6',
                                                        color: booking.status === 'confirmed' ? '#065f46' : booking.status === 'pending' ? '#92400e' : '#374151'
                                                    }}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="p-sm text-right">
                                                {booking.status === 'pending' && (
                                                    <div className="flex-center justify-end gap-xs">
                                                        <button
                                                            className="p-xs rounded hover:bg-green-100 text-success"
                                                            onClick={() => updateStatus(booking.id, 'confirmed')}
                                                            title="Confirm"
                                                        >
                                                            <CheckCircle size={18} color="#10b981" />
                                                        </button>
                                                        <button
                                                            className="p-xs rounded hover:bg-red-100 text-danger"
                                                            onClick={() => updateStatus(booking.id, 'cancelled')}
                                                            title="Decline"
                                                        >
                                                            <XCircle size={18} color="#ef4444" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-xl text-center text-gray">No bookings yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex-column gap-md">
                        <div className="card bg-primary text-white" style={{ background: 'var(--gradient-primary)' }}>
                            <h3 className="text-white mb-sm">Pro Plan</h3>
                            <p className="mb-md opacity-90">Manage your subscription.</p>
                            <button className="btn btn-light" style={{ background: 'white', color: 'var(--color-primary)' }}>
                                Manage Subscription
                            </button>
                        </div>

                        <div className="card">
                            <h3 className="mb-sm">Pending Actions</h3>
                            <div className="flex-column gap-sm">
                                {stats.pending > 0 ? (
                                    <div className="flex-between p-sm bg-light rounded" style={{ background: '#fff3cd', color: '#856404' }}>
                                        <div className="flex-center gap-xs">
                                            <Clock size={16} />
                                            <span>{stats.pending} new requests</span>
                                        </div>
                                        <button className="text-sm font-bold underline">View</button>
                                    </div>
                                ) : (
                                    <p className="text-gray text-sm">No pending actions.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
