import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await login(formData.email, formData.password);

            if (error) {
                alert(error.message || "Login failed");
                return;
            }
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("An unexpected error occurred");
        }
    };

    return (
        <div className="auth-page min-h-screen flex-center py-xl" style={{ minHeight: '80vh', background: 'var(--color-light)' }}>
            <SEO title="Login" description="Login to your WarkaHub account to manage your bookings or your vendor profile." />
            <div className="container" style={{ maxWidth: '450px' }}>
                <div className="card shadow-lg animate-fade-in">
                    <div className="text-center mb-lg">
                        <h1 className="mb-xs">Welcome Back</h1>
                        <p className="text-gray">Login to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-column gap-md">
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

                        <div className="flex-between text-sm">
                            <label className="flex-center gap-xs cursor-pointer">
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="#" className="text-primary hover:underline">Forgot Password?</a>
                        </div>

                        <button type="submit" className="btn btn-primary w-full mt-sm" style={{ width: '100%' }}>
                            Login <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="text-center mt-lg pt-md border-t" style={{ borderTop: '1px solid #eee' }}>
                        <p className="text-gray">
                            Don't have an account? <Link to="/register" className="text-primary font-bold">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
