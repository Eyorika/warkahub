import { useAuth } from '../contexts/AuthContext';
import { Calendar, Package, Star, TrendingUp, Settings } from 'lucide-react';

export const DashboardPage = () => {
    const { user } = useAuth();

    const stats = [
        { icon: <Calendar size={24} />, label: 'Active Bookings', value: '3', color: '#1a8f5c' },
        { icon: <Package size={24} />, label: 'Completed Events', value: '12', color: '#f4a623' },
        { icon: <Star size={24} />, label: 'Reviews Given', value: '8', color: '#e63946' },
        { icon: <TrendingUp size={24} />, label: 'Total Spent', value: '₦45,000', color: '#457b9d' },
    ];

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome back, {user?.name}!</h1>
                        <p>Manage your bookings and explore new services</p>
                    </div>
                    <button className="btn btn-outline">
                        <Settings size={20} />
                        Settings
                    </button>
                </div>

                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card card">
                            <div className="stat-icon" style={{ background: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-content">
                    <div className="section card">
                        <h2>Recent Bookings</h2>
                        <div className="empty-state">
                            <Calendar size={48} />
                            <p>No active bookings yet</p>
                            <button className="btn btn-primary">Browse Services</button>
                        </div>
                    </div>

                    <div className="section card">
                        <h2>Recommended for You</h2>
                        <div className="empty-state">
                            <Star size={48} />
                            <p>Discover amazing vendors</p>
                            <button className="btn btn-secondary">Explore Now</button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .dashboard-page {
          min-height: calc(100vh - 80px);
          padding: 2rem 0;
          background: var(--color-light);
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          color: var(--color-gray);
          margin-bottom: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-white);
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--color-dark);
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: var(--color-gray);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .dashboard-content {
          display: grid;
          gap: 2rem;
        }

        .section {
          padding: 2rem;
        }

        .section h2 {
          margin-bottom: 1.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: var(--color-gray);
        }

        .empty-state svg {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state p {
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};
