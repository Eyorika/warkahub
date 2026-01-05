import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Info, DollarSign, MapPin,
    Check, ArrowRight, ArrowLeft, Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

const CompleteProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        phone: '',
        priceMin: '',
        priceMax: '',
        location: 'Addis Ababa',
        features: [] as string[]
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'vendor') {
            navigate('/');
            return;
        }

        // Pre-fill if some data already exists
        setFormData(prev => ({
            ...prev,
            description: (user as any).description || '',
            phone: user.phone || '',
            priceMin: (user as any).price_min?.toString() || '',
            priceMax: (user as any).price_max?.toString() || '',
            location: (user as any).location || 'Addis Ababa',
            features: (user as any).features || []
        }));
    }, [user, navigate]);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    description: formData.description,
                    phone: formData.phone,
                    price_min: parseInt(formData.priceMin) || 0,
                    price_max: parseInt(formData.priceMax) || 0,
                    location: formData.location,
                    features: formData.features,
                    is_profile_complete: true // We'll add this flag if needed or just use logic
                })
                .eq('id', user?.id);

            if (error) throw error;

            alert('Profile updated successfully!');
            navigate('/vendor/dashboard');
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Failed to update profile');
        } finally {
            setLoading(true);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-column gap-md"
                    >
                        <div className="flex-center gap-sm mb-sm text-primary">
                            <Info size={24} />
                            <h3 className="mb-0">Tell us about your business</h3>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Phone Number</label>
                            <input
                                type="tel"
                                className="input"
                                placeholder="+251 900 000 000"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Business Description</label>
                            <textarea
                                className="input h-32"
                                placeholder="Describe your services, experience, and what makes you unique..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <button className="btn btn-primary w-full" onClick={handleNext} disabled={!formData.description || !formData.phone}>
                            Next Step <ArrowRight size={18} />
                        </button>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-column gap-md"
                    >
                        <div className="flex-center gap-sm mb-sm text-primary">
                            <DollarSign size={24} />
                            <h3 className="mb-0">Pricing & Packages</h3>
                        </div>
                        <p className="text-gray text-sm">Provide a general price range for your services in ETB.</p>
                        <div className="grid grid-2 gap-md">
                            <div className="input-group">
                                <label className="input-label">Minimum Price</label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="5000"
                                    value={formData.priceMin}
                                    onChange={e => setFormData({ ...formData, priceMin: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Maximum Price</label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="50000"
                                    value={formData.priceMax}
                                    onChange={e => setFormData({ ...formData, priceMax: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-md mt-md">
                            <button className="btn btn-outline flex-1" onClick={handleBack}>
                                <ArrowLeft size={18} /> Back
                            </button>
                            <button className="btn btn-primary flex-1" onClick={handleNext} disabled={!formData.priceMin || !formData.priceMax}>
                                Next Step <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-column gap-md"
                    >
                        <div className="flex-center gap-sm mb-sm text-primary">
                            <MapPin size={24} />
                            <h3 className="mb-0">Final Details</h3>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Base Location</label>
                            <select
                                className="select"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            >
                                <option value="Addis Ababa">Addis Ababa</option>
                                <option value="Nazret (Adama)">Nazret (Adama)</option>
                                <option value="Bahar Dar">Bahar Dar</option>
                                <option value="Hawassa">Hawassa</option>
                                <option value="Dire Dawa">Dire Dawa</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Business Features (Comma separated)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Transport included, Premium equipment, etc."
                                value={formData.features.join(', ')}
                                onChange={e => setFormData({ ...formData, features: e.target.value.split(',').map(s => s.trim()) })}
                            />
                        </div>
                        <div className="flex gap-md mt-md">
                            <button className="btn btn-outline flex-1" onClick={handleBack}>
                                <ArrowLeft size={18} /> Back
                            </button>
                            <button className="btn btn-primary flex-1" onClick={handleSubmit} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : <>Complete Profile <Check size={18} /></>}
                            </button>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-light py-2xl">
            <SEO title="Complete Your Profile" />
            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="card shadow-xl p-xl">
                    <div className="text-center mb-xl">
                        <div className="flex-center justify-center gap-md mb-md">
                            {[1, 2, 3].map(s => (
                                <div
                                    key={s}
                                    className={`w-10 h-10 rounded-full flex-center font-bold transition-all ${step >= s ? 'bg-primary text-white scale-110' : 'bg-gray-light text-gray'}`}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                >
                                    {step > s ? <Check size={20} /> : s}
                                </div>
                            ))}
                        </div>
                        <h1>Finish setting up</h1>
                        <p className="text-gray">Complete these steps to start receiving bookings</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfile;
