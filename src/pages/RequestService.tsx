import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, MapPin, Users, DollarSign,
    MessageSquare, ArrowRight, CheckCircle, Package
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { EventType, ServiceType } from '../types';
import SEO from '../components/SEO';

const RequestService = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        serviceType: 'catering' as ServiceType,
        eventType: 'wedding' as EventType,
        eventDate: '',
        eventTime: '',
        location: '',
        guestCount: '',
        budget: '',
        specialRequirements: '',
        paymentMethod: 'telebirr' as 'telebirr' | 'chapa'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('bookings')
                .insert([{
                    customer_id: user.id,
                    service_type: formData.serviceType,
                    event_type: formData.eventType,
                    event_date: formData.eventDate,
                    event_time: formData.eventTime,
                    location: formData.location,
                    guest_count: parseInt(formData.guestCount),
                    budget: parseFloat(formData.budget),
                    special_requirements: formData.specialRequirements,
                    payment_method: formData.paymentMethod,
                    status: 'pending_match'
                }]);

            if (error) throw error;
            setSuccess(true);
            setTimeout(() => navigate('/my-bookings'), 3000);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                className="container py-2xl flex-center flex-column gap-lg text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <SEO title="Request Submitted" />
                <motion.div
                    className="w-20 h-20 bg-primary-light rounded-circle flex-center text-primary"
                    style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(26, 143, 92, 0.1)' }}
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                    <CheckCircle size={48} />
                </motion.div>
                <div>
                    <h1>Request Submitted!</h1>
                    <p className="text-gray">Our team is now matching you with the best vendors. You'll be notified soon.</p>
                </div>
                <button onClick={() => navigate('/my-bookings')} className="btn btn-primary">
                    View My Bookings <ArrowRight size={20} />
                </button>
            </motion.div>
        );
    }

    const serviceTypes: ServiceType[] = ['catering', 'decoration', 'photography', 'videography', 'music', 'venue', 'planning'];
    const eventTypes: EventType[] = ['wedding', 'birthday', 'corporate', 'conference', 'graduation', 'anniversary', 'other'];

    return (
        <div className="request-service-page py-xl bg-light" style={{ minHeight: '90vh' }}>
            <SEO title="Request Service" description="Submit a service request and let WarkaHub match you with the best event vendors in Ethiopia." />
            <div className="container" style={{ maxWidth: '800px' }}>
                <motion.div
                    className="text-center mb-xl"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="mb-xs">Request a Service</h1>
                    <p className="text-gray">Tell us what you need, and we'll find the perfect match for you.</p>
                </motion.div>

                <motion.div
                    className="card shadow-lg border-none"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                >
                    <form onSubmit={handleSubmit} className="grid grid-2 gap-lg">
                        {/* Service & Event Type */}
                        <div className="input-group">
                            <label className="input-label">I need help with...</label>
                            <div className="relative">
                                <Package size={18} className="absolute left-3 top-3 text-gray" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                                <select
                                    className="select pl-xl"
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={formData.serviceType}
                                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as ServiceType })}
                                    required
                                >
                                    {serviceTypes.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Event Type</label>
                            <select
                                className="select"
                                value={formData.eventType}
                                onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType })}
                                required
                            >
                                {eventTypes.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
                            </select>
                        </div>

                        {/* Date & Time */}
                        <div className="input-group">
                            <label className="input-label">Event Date</label>
                            <div className="relative">
                                <Calendar size={18} className="absolute left-3 top-3 text-gray" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                                <input
                                    type="date"
                                    className="input pl-xl"
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={formData.eventDate}
                                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Preferred Time</label>
                            <input
                                type="time"
                                className="input"
                                value={formData.eventTime}
                                onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                                required
                            />
                        </div>

                        {/* Location & Guest Count */}
                        <div className="input-group">
                            <label className="input-label">Location</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-3 text-gray" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    className="input pl-xl"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Addis Ababa, Bole..."
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Estimated Guest Count</label>
                            <div className="relative">
                                <Users size={18} className="absolute left-3 top-3 text-gray" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                                <input
                                    type="number"
                                    className="input pl-xl"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="e.g. 100"
                                    value={formData.guestCount}
                                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Budget & Payment */}
                        <div className="input-group">
                            <label className="input-label">Budget (ETB)</label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute left-3 top-3 text-gray" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                                <input
                                    type="number"
                                    className="input pl-xl"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="e.g. 15000"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Preferred Payment</label>
                            <select
                                className="select"
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as 'telebirr' | 'chapa' })}
                                required
                            >
                                <option value="telebirr">Telebirr</option>
                                <option value="chapa">Chapa</option>
                            </select>
                        </div>

                        {/* Requirements */}
                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                            <label className="input-label">Special Requirements</label>
                            <div className="relative">
                                <MessageSquare size={18} className="absolute left-3 top-3 text-gray" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                                <textarea
                                    className="textarea pl-xl"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Tell us about your specific needs..."
                                    value={formData.specialRequirements}
                                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex-center" style={{ gridColumn: 'span 2' }}>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-full"
                                style={{ width: '100%' }}
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Find My Perfect Vendor'}
                                {!loading && <ArrowRight size={20} />}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default RequestService;
