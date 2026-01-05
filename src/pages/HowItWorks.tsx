import { Search, Calendar, Shield, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const HowItWorks = () => {
    const steps = [
        {
            icon: Search,
            title: '1. Discover',
            description: 'Browse our curated list of verified vendors across Ethiopia. Filter by service type, location, and budget.'
        },
        {
            icon: Award,
            title: '2. Compare',
            description: 'Read real customer reviews, view portfolios, and compare pricing to find your perfect match.'
        },
        {
            icon: Calendar,
            title: '3. Book',
            description: 'Secure your booking instantly. We handle the process to ensure everything is ready for your event.'
        },
        {
            icon: Shield,
            title: '4. Enjoy',
            description: 'Relax and enjoy your event while our professional vendors provide top-notch service.'
        }
    ];

    return (
        <div className="container py-xl">
            <SEO title="How It Works" description="Learn how WarkaHub makes event planning in Ethiopia simple, transparent, and reliable." />

            <motion.div
                className="text-center mb-xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>How WarkaHub Works</h1>
                <p className="text-gray">Simple, transparent, and reliable event planning</p>
            </motion.div>

            <motion.div
                className="grid grid-2 gap-xl"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
            >
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        className="card-glass p-lg flex-column gap-md"
                        variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: { opacity: 1, scale: 1 }
                        }}
                    >
                        <step.icon size={48} className="text-primary" />
                        <h3>{step.title}</h3>
                        <p className="text-gray">{step.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default HowItWorks;
