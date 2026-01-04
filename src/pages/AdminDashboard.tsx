import { useNavigate } from 'react-router-dom';
import {
    Users, Store, Calendar, DollarSign, Activity,
    CheckCircle, XCircle, Search, LogOut
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    // Mock data for MVP
    const stats = [
        { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { label: 'Total Vendors', value: '345', change: '+5%', icon: Store, color: 'bg-green-100 text-green-600' },
        { label: 'Active Bookings', value: '89', change: '+24%', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
        { label: 'Total Revenue', value: '450k ETB', change: '+8%', icon: DollarSign, color: 'bg-yellow-100 text-yellow-600' },
    ];

    const pendingVendors = [
        { id: 1, name: 'Royal Events', type: 'Planning', date: '2023-12-25', status: 'Pending' },
        { id: 2, name: 'Addis Catering', type: 'Catering', date: '2023-12-24', status: 'Pending' },
        { id: 3, name: 'Lala Decor', type: 'Decoration', date: '2023-12-23', status: 'Pending' },
    ];

    const recentTransactions = [
        { id: 'TRX-9988', user: 'Abebe Bikila', vendor: 'Habesha Catering', amount: '15,000 ETB', date: '2 mins ago', status: 'success' },
        { id: 'TRX-9987', user: 'Sara Tadesse', vendor: 'Blue Note Band', amount: '8,000 ETB', date: '15 mins ago', status: 'success' },
        { id: 'TRX-9986', user: 'Tech Hub', vendor: 'Skyline Venues', amount: '45,000 ETB', date: '1 hour ago', status: 'pending' },
    ];

    return (
        <div className="admin-dashboard min-h-screen bg-light">
            <div className="flex h-screen" style={{ height: '100vh', overflow: 'hidden' }}>

                {/* Sidebar */}
                <aside className="w-64 bg-white border-r hidden md:flex flex-column" style={{ width: '260px', borderRight: '1px solid #eee', background: 'white' }}>
                    <div className="p-lg border-b flex-center gap-sm" style={{ height: '80px' }}>
                        <div className="w-8 h-8 bg-primary rounded-full flex-center text-white font-bold" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)' }}>W</div>
                        <span className="font-bold text-lg">WarkaAdmin</span>
                    </div>

                    <nav className="flex-1 p-md flex-column gap-xs overflow-y-auto">
                        <button className="flex-center justify-start gap-sm p-sm rounded bg-primary-light text-primary font-bold w-full border-none cursor-pointer text-left" style={{ background: 'var(--color-primary-light)', color: 'white' }}>
                            <Activity size={18} /> Dashboard
                        </button>
                        <button className="flex-center justify-start gap-sm p-sm rounded hover:bg-light text-gray font-medium w-full border-none cursor-pointer text-left bg-transparent transition">
                            <Store size={18} /> Vendors
                        </button>
                        <button className="flex-center justify-start gap-sm p-sm rounded hover:bg-light text-gray font-medium w-full border-none cursor-pointer text-left bg-transparent transition">
                            <Users size={18} /> Users
                        </button>
                        <button className="flex-center justify-start gap-sm p-sm rounded hover:bg-light text-gray font-medium w-full border-none cursor-pointer text-left bg-transparent transition">
                            <Calendar size={18} /> Bookings
                        </button>
                        <button className="flex-center justify-start gap-sm p-sm rounded hover:bg-light text-gray font-medium w-full border-none cursor-pointer text-left bg-transparent transition">
                            <DollarSign size={18} /> Finance
                        </button>
                    </nav>

                    <div className="p-md border-t">
                        <button onClick={() => navigate('/')} className="flex-center justify-start gap-sm p-sm text-accent hover:bg-accent-light hover:text-white rounded w-full border-none cursor-pointer bg-transparent transition">
                            <LogOut size={18} /> Exit Admin
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <header className="h-20 bg-white border-b flex-between px-lg sticky top-0 z-10" style={{ height: '80px' }}>
                        <h2 className="text-xl">Dashboard Overview</h2>
                        <div className="flex-center gap-md">
                            <div className="bg-light rounded-full p-xs">
                                <Search size={20} className="text-gray" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-light flex-center text-white font-bold" style={{ width: '40px', height: '40px', background: '#ccc', borderRadius: '50%' }}>
                                A
                            </div>
                        </div>
                    </header>

                    <div className="p-lg">
                        {/* Stats Row */}
                        <div className="grid grid-4 gap-md mb-lg">
                            {stats.map((stat, i) => (
                                <div key={i} className="card p-md">
                                    <div className="flex-between mb-sm">
                                        <span className="text-gray text-sm font-bold uppercase">{stat.label}</span>
                                        <stat.icon size={20} className="text-gray" />
                                    </div>
                                    <div className="text-3xl font-bold mb-xs">{stat.value}</div>
                                    <span className="text-success text-sm font-bold bg-green-50 px-xs py-1 rounded" style={{ color: 'green' }}>{stat.change} from last month</span>
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-lg" style={{ gridTemplateColumns: '2fr 1fr' }}>
                            {/* Transactions Table */}
                            <div className="card">
                                <div className="flex-between mb-md">
                                    <h3>Recent Transactions</h3>
                                    <button className="text-primary text-sm font-bold bg-transparent border-none cursor-pointer">View All</button>
                                </div>
                                <table className="w-full text-left border-collapse" style={{ width: '100%' }}>
                                    <thead className="bg-light" style={{ background: '#f9fafb' }}>
                                        <tr>
                                            <th className="p-sm text-xs uppercase text-gray">Transaction ID</th>
                                            <th className="p-sm text-xs uppercase text-gray">User & Vendor</th>
                                            <th className="p-sm text-xs uppercase text-gray">Amount</th>
                                            <th className="p-sm text-xs uppercase text-gray">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransactions.map(tx => (
                                            <tr key={tx.id} className="border-b last:border-0" style={{ borderBottom: '1px solid #eee' }}>
                                                <td className="p-sm font-mono text-sm">{tx.id}</td>
                                                <td className="p-sm">
                                                    <div className="font-bold text-sm">{tx.user}</div>
                                                    <div className="text-xs text-gray">to {tx.vendor}</div>
                                                </td>
                                                <td className="p-sm font-bold">{tx.amount}</td>
                                                <td className="p-sm">
                                                    <span className={`badge ${tx.status === 'success' ? 'badge-success' : 'badge-warning'}`}>{tx.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pending Approvals */}
                            <div className="card">
                                <div className="flex-between mb-md">
                                    <h3>Pending Verification</h3>
                                </div>
                                <div className="flex-column gap-sm">
                                    {pendingVendors.map(vendor => (
                                        <div key={vendor.id} className="p-sm border rounded hover:bg-light transition" style={{ border: '1px solid #eee' }}>
                                            <div className="flex-between mb-xs">
                                                <span className="font-bold">{vendor.name}</span>
                                                <span className="badge badge-secondary text-xs">{vendor.type}</span>
                                            </div>
                                            <div className="text-xs text-gray mb-sm">Applied on {vendor.date}</div>
                                            <div className="flex gap-xs">
                                                <button className="flex-1 btn btn-primary py-1 text-sm flex-center gap-1" style={{ padding: '0.25rem' }}>
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button className="flex-1 btn btn-outline py-1 text-sm flex-center gap-1" style={{ padding: '0.25rem', borderColor: 'var(--color-gray-light)', color: 'var(--color-gray)' }}>
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
