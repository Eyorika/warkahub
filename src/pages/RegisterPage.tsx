import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'customer' as 'customer' | 'vendor',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            await register(formData, formData.password);
            navigate(formData.role === 'vendor' ? '/vendor/onboarding' : '/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card card">
                    <div className="auth-header">
                        <h1>Create Account</h1>
                        <p>Join WarkaHub and start planning amazing events</p>
                    </div>

                    <div className="role-selector">
                        <button
                            className={`role-option ${formData.role === 'customer' ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, role: 'customer' })}
                        >
                            <User size={24} />
                            <span>I'm a Customer</span>
                        </button>
                        <button
                            className={`role-option ${formData.role === 'vendor' ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, role: 'vendor' })}
                        >
                            <Briefcase size={24} />
                            <span>I'm a Vendor</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <div className="input-wrapper">
                                <User size={20} className="input-icon" />
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={20} className="input-icon" />
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Phone Number</label>
                            <div className="input-wrapper">
                                <Phone size={20} className="input-icon" />
                                <input
                                    type="tel"
                                    className="input"
                                    placeholder="+251 911 234 567"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div className="input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type="password"
                                    className="input"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Confirm Password</label>
                            <div className="input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type="password"
                                    className="input"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Create Account
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </div>
            </div>

            <style>{`
        .auth-page {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        }

        .auth-container {
          width: 100%;
          max-width: 500px;
          padding: 0 var(--spacing-md);
        }

        .auth-card {
          padding: 2.5rem;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h1 {
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: var(--color-gray);
          margin-bottom: 0;
        }

        .role-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .role-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.25rem;
          background: var(--color-light);
          border: 2px solid transparent;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-normal);
          font-family: var(--font-primary);
          font-weight: 600;
        }

        .role-option:hover {
          background: var(--color-white);
          border-color: var(--color-primary-light);
        }

        .role-option.active {
          background: var(--gradient-primary);
          color: var(--color-white);
          border-color: var(--color-primary);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-gray);
          pointer-events: none;
        }

        .input-wrapper .input {
          padding-left: 3rem;
        }

        .auth-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--color-light);
        }

        .auth-footer p {
          color: var(--color-gray);
          margin-bottom: 0;
        }

        .auth-footer a {
          color: var(--color-primary);
          font-weight: 600;
          text-decoration: none;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
        </div>
    );
};
