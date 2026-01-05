import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, ArrowLeft, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

const ProfileSettings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        businessName: '',
        description: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                businessName: (user as any).businessName || '',
                description: (user as any).description || '',
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.name,
                    phone: formData.phone,
                    business_name: formData.businessName,
                    description: formData.description,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user?.id);

            if (error) throw error;
            alert('Settings updated successfully!');
            navigate('/profile');
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="container py-xl">
            <SEO title="Profile Settings" />
            <div className="max-w-2xl mx-auto">
                <div className="flex-center gap-sm mb-lg">
                    <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline px-sm">
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="mb-0">Account Settings</h1>
                </div>

                <div className="card p-xl">
                    <form onSubmit={handleSubmit} className="flex-column gap-lg">
                        {/* Avatar section placeholder */}
                        <div className="flex-center gap-xl pb-lg border-b">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-primary-light flex-center text-primary" style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(26, 143, 92, 0.1)' }}>
                                    <User size={48} />
                                </div>
                                <button type="button" className="absolute bottom-0 right-0 p-xs bg-white shadow-md rounded-full text-gray hover:text-primary transition" style={{ position: 'absolute', bottom: 0, right: 0, border: 'none', cursor: 'pointer' }}>
                                    <Camera size={16} />
                                </button>
                            </div>
                            <div>
                                <h3 className="mb-xs">Profile Photo</h3>
                                <p className="text-gray text-sm">Upload a professional photo to build trust.</p>
                            </div>
                        </div>

                        <div className="grid grid-2 gap-md">
                            <div className="input-group">
                                <label className="input-label">Full Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <input
                                    type="email"
                                    className="input bg-light"
                                    value={user.email}
                                    disabled
                                    title="Email cannot be changed"
                                />
                                <span className="text-xs text-gray mt-xs">Email cannot be changed.</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Phone Number</label>
                            <input
                                type="tel"
                                className="input"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+251 900 000 000"
                            />
                        </div>

                        {user.role === 'vendor' && (
                            <>
                                <div className="input-group">
                                    <label className="input-label">Business Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.businessName}
                                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Business Description</label>
                                    <textarea
                                        className="input h-32"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex justify-end mt-md pt-lg border-t">
                            <button type="submit" className="btn btn-primary px-xl" disabled={loading}>
                                {loading ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
