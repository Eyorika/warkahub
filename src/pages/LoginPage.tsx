import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card card">
                    <div className="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to continue to WarkaHub</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
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
                            <label className="input-label">Password</label>
                            <div className="input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type="password"
                                    className="input"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="forgot-password">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Sign In
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
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

        .forgot-password {
          text-align: right;
          margin-top: -0.5rem;
        }

        .forgot-password a {
          color: var(--color-primary);
          font-size: 0.875rem;
          text-decoration: none;
        }

        .forgot-password a:hover {
          text-decoration: underline;
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
