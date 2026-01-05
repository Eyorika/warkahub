import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Store, Calendar, DollarSign,
    CheckCircle, XCircle, LogOut, ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Booking, VendorProfile } from '../types';
import SEO from '../components/SEO';

type BookingWithProfile = Booking & { customerName: string };

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<BookingWithProfile[]>([]);
    const [vendors, setVendors] = useState<Partial<VendorProfile>[]>([]);
    const [loading, setLoading] = useState(true);
    const [matchingRequest, setMatchingRequest] = useState<BookingWithProfile | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch pending requests
            const { data: requestData, error: requestError } = await supabase
                .from('bookings')
                .select('*, profiles(full_name)')
                .eq('status', 'pending_match');

            if (requestError) throw requestError;

            const transformedRequests: BookingWithProfile[] = (requestData || []).map(r => ({
                id: r.id,
                customerId: r.customer_id,
                vendorId: r.vendor_id,
                eventType: r.event_type,
                eventDate: r.event_date,
                eventTime: r.event_time,
                location: r.location,
                guestCount: r.guest_count,
                budget: r.budget,
                specialRequirements: r.special_requirements,
                status: r.status,
                paymentStatus: r.payment_status,
                paymentMethod: r.payment_method,
                createdAt: r.created_at,
                updatedAt: r.updated_at,
                customerName: r.profiles?.full_name || 'Unknown'
            }));

            setRequests(transformedRequests);

            // Fetch all vendors for matching
            const { data: vendorData, error: vendorError } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'vendor');

            if (vendorError) throw vendorError;

            const transformedVendors: Partial<VendorProfile>[] = (vendorData || []).map(v => ({
                id: v.id,
                businessName: v.business_name || v.full_name,
                serviceType: v.service_types || [],
                location: v.location || 'Addis Ababa',
                rating: v.rating || 0,
                priceRange: { min: v.price_min || 0, max: v.price_max || 0 }
            }));

            setVendors(transformedVendors);

        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMatch = async (vendorId: string) => {
        if (!matchingRequest) return;

        try {
            const { error } = await supabase
                .from('bookings')
                .update({
                    vendor_id: vendorId,
                    status: 'matched'
                })
                .eq('id', matchingRequest.id);

            if (error) throw error;

            setMatchingRequest(null);
            fetchDashboardData();
            alert('Vendor matched successfully!');
        } catch (error) {
            console.error('Error matching vendor:', error);
            alert('Failed to match vendor.');
        }
    };

    const stats = [
        { label: 'Pending Match', value: requests.length.toString(), change: 'Action Required', icon: Activity, color: 'text-orange-600' },
        { label: 'Total Vendors', value: vendors.length.toString(), change: 'Verified Providers', icon: Store, color: 'text-green-600' },
        { label: 'Active Bookings', value: '12', change: 'Confirmed', icon: Calendar, color: 'text-purple-600' },
        { label: 'Revenue', value: '150k ETB', change: 'Monthly', icon: DollarSign, color: 'text-blue-600' },
    ];

    return (
        <div className="admin-dashboard min-h-screen bg-light">
            <SEO title="Admin Dashboard" />
            <div className="flex h-screen" style={{ height: '100vh', overflow: 'hidden' }}>
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r hidden md:flex flex-column" style={{ width: '260px', borderRight: '1px solid #eee', background: 'white' }}>
                    <div className="p-lg border-b flex-center gap-sm" style={{ height: '80px' }}>
                        <div className="w-8 h-8 bg-primary rounded-full flex-center text-white font-bold" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)' }}>W</div>
                        <span className="font-bold text-lg">WarkaAdmin</span>
                    </div>

                    <nav className="flex-1 p-md flex-column gap-xs overflow-y-auto">
                        <button className="flex-center justify-start gap-sm p-sm rounded bg-primary text-white font-bold w-full border-none cursor-pointer text-left" style={{ background: 'var(--color-primary)', color: 'white' }}>
                            <Activity size={18} /> Dashboard
                        </button>
                        <button className="flex-center justify-start gap-sm p-sm rounded hover:bg-light text-gray font-medium w-full border-none cursor-pointer text-left bg-transparent transition">
                            <Store size={18} /> Vendors
                        </button>
                    </nav>

                    <div className="p-md border-t">
                        <button onClick={() => navigate('/')} className="flex-center justify-start gap-sm p-sm text-accent hover:bg-accent-light rounded w-full border-none cursor-pointer bg-transparent transition">
                            <LogOut size={18} /> Exit Admin
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <header className="h-20 bg-white border-b flex-between px-lg sticky top-0 z-10" style={{ height: '80px' }}>
                        <h2 className="text-xl">Admin Control Center</h2>
                        <div className="flex-center gap-md">
                            <span className="badge badge-primary">Admin Access</span>
                        </div>
                    </header>

                    <div className="p-lg">
                        {/* Stats Row */}
                        <div className="grid grid-4 gap-md mb-lg">
                            {stats.map((stat, i) => (
                                <div key={i} className="card p-md">
                                    <div className="flex-between mb-sm">
                                        <span className="text-gray text-xs font-bold uppercase">{stat.label}</span>
                                        <stat.icon size={18} className={stat.color} />
                                    </div>
                                    <div className="text-2xl font-bold mb-xs">{stat.value}</div>
                                    <span className="text-gray text-xs">{stat.change}</span>
                                </div>
                            ))}
                        </div>

                        {/* Matching Workspace */}
                        {matchingRequest && (
                            <div className="card border-primary mb-lg animate-fade-in" style={{ border: '2px solid var(--color-primary)' }}>
                                <div className="flex-between mb-lg">
                                    <h3>Matching for: {matchingRequest.customerName}'s {matchingRequest.eventType} Request</h3>
                                    <button onClick={() => setMatchingRequest(null)} className="btn btn-ghost p-xs"><XCircle size={20} /></button>
                                </div>

                                <div className="grid grid-3 gap-md">
                                    {vendors
                                        .filter(v => (v.serviceType as string[] || []).includes(matchingRequest.eventType)) // Corrected to use serviceType
                                        .map(vendor => (
                                            <div key={vendor.id} className="p-md border rounded flex-column gap-sm">
                                                <div className="font-bold">{vendor.businessName}</div>
                                                <div className="text-sm text-gray">{vendor.location}</div>
                                                <div className="flex-between text-xs font-bold text-primary">
                                                    <span>Rating: {vendor.rating}</span>
                                                    <span>{vendor.priceRange?.min} ETB+</span>
                                                </div>
                                                <button
                                                    onClick={() => vendor.id && handleMatch(vendor.id)}
                                                    className="btn btn-primary btn-sm w-full"
                                                >
                                                    Select Vendor
                                                </button>
                                            </div>
                                        ))
                                    }
                                    {vendors.filter(v => (v.serviceType as string[] || []).includes(matchingRequest.eventType)).length === 0 && (
                                        <p className="text-gray py-lg" style={{ gridColumn: 'span 3' }}>No vendors found for this service type.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Pending Service Requests */}
                        <div className="card">
                            <div className="flex-between mb-md">
                                <h3>Pending Service Requests</h3>
                                <button onClick={fetchDashboardData} className="btn btn-ghost btn-sm">Refresh</button>
                            </div>

                            {loading ? (
                                <p className="text-center py-xl text-gray">Loading requests...</p>
                            ) : requests.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="p-md text-xs uppercase text-gray">Client</th>
                                                <th className="p-md text-xs uppercase text-gray">Service</th>
                                                <th className="p-md text-xs uppercase text-gray">Date/Time</th>
                                                <th className="p-md text-xs uppercase text-gray">Budget</th>
                                                <th className="p-md text-xs uppercase text-gray">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.map(req => (
                                                <tr key={req.id} className="border-b hover:bg-light transition">
                                                    <td className="p-md">
                                                        <div className="font-bold">{req.customerName}</div>
                                                        <div className="text-xs text-gray">{req.location}</div>
                                                    </td>
                                                    <td className="p-md">
                                                        <span className="badge badge-secondary">{req.eventType}</span>
                                                    </td>
                                                    <td className="p-md">
                                                        <div className="text-sm">{req.eventDate}</div>
                                                        <div className="text-xs text-gray">{req.eventTime}</div>
                                                    </td>
                                                    <td className="p-md font-bold">{req.budget.toLocaleString()} ETB</td>
                                                    <td className="p-md">
                                                        <button
                                                            onClick={() => setMatchingRequest(req)}
                                                            className="btn btn-primary btn-sm flex-center gap-xs"
                                                        >
                                                            Match <ArrowRight size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-xl text-gray">
                                    <CheckCircle size={48} className="mx-auto mb-sm opacity-20" />
                                    <p>All clear! No pending requests.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
