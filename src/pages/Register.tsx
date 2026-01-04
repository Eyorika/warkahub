import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Store } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [role, setRole] = useState<'customer' | 'vendor'>('customer');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        businessName: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            const { error } = await register({
                name: formData.name,
                email: formData.email,
                role: role,
                ...(role === 'vendor' ? { businessName: formData.businessName } : {})
            }, formData.password);

            if (error) {
                alert(error.message || "Registration failed");
                return;
            }

            // Redirect based on role
            if (role === 'vendor') {
                navigate('/vendor/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            alert("An unexpected error occurred");
        }
    };

    return (
        <div className="auth-page min-h-screen flex-center py-xl" style={{ minHeight: '80vh', background: 'var(--color-light)' }}>
            <div className="container" style={{ maxWidth: '500px' }}>
                <div className="card shadow-lg animate-fade-in">
                    <div className="text-center mb-lg">
                        <h1 className="mb-xs">Create Account</h1>
                        <p className="text-gray">Join WarkaHub today</p>
                    </div>

                    {/* Role Selection */}
                    <div className="grid grid-2 gap-md mb-lg">
                        <button
                            type="button"
                            className={`p-md rounded border-2 flex-column flex-center gap-sm transition ${role === 'customer' ? 'border-primary bg-primary-light text-primary' : 'border-light hover:border-gray'}`}
                            style={{
                                border: `2px solid ${role === 'customer' ? 'var(--color-primary)' : '#eee'}`,
                                background: role === 'customer' ? 'rgba(26, 143, 92, 0.05)' : 'white',
                                cursor: 'pointer'
                            }}
                            onClick={() => setRole('customer')}
                        >
                            <User size={32} />
                            <span className="font-bold">I'm a Customer</span>
                        </button>
                        <button
                            type="button"
                            className={`p-md rounded border-2 flex-column flex-center gap-sm transition ${role === 'vendor' ? 'border-primary bg-primary-light text-primary' : 'border-light hover:border-gray'}`}
                            style={{
                                border: `2px solid ${role === 'vendor' ? 'var(--color-primary)' : '#eee'}`,
                                background: role === 'vendor' ? 'rgba(26, 143, 92, 0.05)' : 'white',
                                cursor: 'pointer'
                            }}
                            onClick={() => setRole('vendor')}
                        >
                            <Store size={32} />
                            <span className="font-bold">I'm a Vendor</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-column gap-md">
                        <div className="input-group mb-0">
                            <label className="input-label">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-3 text-gray" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    className="input pl-xl"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="John Doe"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {role === 'vendor' && (
                            <div className="input-group mb-0 animate-fade-in">
                                <label className="input-label">Business Name</label>
                                <div className="relative">
                                    <Store size={18} className="absolute left-3 top-3 text-gray" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                                    <input
                                        type="text"
                                        className="input pl-xl"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="Grand Events PLC"
                                        required
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="input-group mb-0">
                            <label className="input-label">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-3 text-gray" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                                <input
                                    type="email"
                                    className="input pl-xl"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="you@example.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="input-group mb-0">
                            <label className="input-label">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-3 text-gray" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                                <input
                                    type="password"
                                    className="input pl-xl"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="input-group mb-0">
                            <label className="input-label">Confirm Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-3 text-gray" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                                <input
                                    type="password"
                                    className="input pl-xl"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="••••••••"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full mt-sm" style={{ width: '100%' }}>
                            Create Account <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="text-center mt-lg pt-md border-t" style={{ borderTop: '1px solid #eee' }}>
                        <p className="text-gray">
                            Already have an account? <Link to="/login" className="text-primary font-bold">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
