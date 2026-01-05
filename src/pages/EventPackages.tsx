import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const EventPackages = () => {
    return (
        <div className="container py-xl text-center">
            <SEO title="Event Packages" description="Curated event packages for weddings, birthdays, and corporate events in Ethiopia." />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Package size={64} className="text-primary mb-md" />
                <h1>Event Packages</h1>
                <p className="text-gray mb-lg">Coming soon! We are curating the best value packages for your special events.</p>
                <Link to="/vendors" className="btn btn-primary">
                    Browse All Vendors
                    <ArrowRight size={20} />
                </Link>
            </motion.div>
        </div>
    );
};

export default EventPackages;
