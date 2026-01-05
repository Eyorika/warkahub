import { User, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO';

const Profile = () => {
    const { user, logout } = useAuth();

    return (
        <div className="container py-xl">
            <SEO title="My Profile" />

            <motion.div
                className="card max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex-center flex-column gap-md mb-lg">
                    <motion.div
                        className="bg-primary-light p-lg rounded-circle"
                        style={{ borderRadius: '50%', background: 'rgba(26, 143, 92, 0.1)', padding: '2rem' }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <User size={64} className="text-primary" />
                    </motion.div>
                    <div className="text-center">
                        <h2>{user?.name}</h2>
                        <p className="text-gray">{user?.email}</p>
                        <span className="badge badge-primary">{user?.role}</span>
                    </div>
                </div>

                <div className="flex-column gap-sm">
                    <Link to="/profile/settings" className="btn btn-outline flex-between w-full">
                        <span className="flex items-center gap-sm"><Settings size={18} /> Account Settings</span>
                    </Link>
                    <button onClick={logout} className="btn btn-outline border-accent text-accent flex-between w-full" style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}>
                        <span className="flex items-center gap-sm"><LogOut size={18} /> Logout</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
