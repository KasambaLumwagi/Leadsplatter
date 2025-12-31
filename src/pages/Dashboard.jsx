import { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import { LayoutDashboard, Users, TrendingUp, Filter } from 'lucide-react';

// Mock historical data for graph (since we only have total count in real DB for now)
const trendData = [
    { name: 'Mon', leads: 40 },
    { name: 'Tue', leads: 30 },
    { name: 'Wed', leads: 55 },
    { name: 'Thu', leads: 80 },
    { name: 'Fri', leads: 65 },
    { name: 'Today', leads: 0 }, // Will be updated with real count
];

const sourceData = [
    { name: 'Organic', value: 45 },
    { name: 'Paid Ads', value: 30 },
    { name: 'Referral', value: 15 },
    { name: 'Social', value: 10 },
];

const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
    <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        padding: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{title}</span>
            <div style={{
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '0.5rem',
                color: 'var(--accent-primary)'
            }}>
                <Icon size={20} />
            </div>
        </div>
        <div style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 700 }}>
            {value}
        </div>
        <div style={{
            fontSize: '0.875rem',
            color: trend === 'up' ? '#4ade80' : '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
        }}>
            {trend === 'up' ? '↑' : '↓'} {subtext}
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ totalLeads: 0, recentLeads: [] });
    const [loading, setLoading] = useState(true);
    const [unauthorized, setUnauthorized] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/analytics');
                if (res.status === 401) {
                    setUnauthorized(true);
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                setStats(data);

                // Update graph with real today count
                if (trendData[trendData.length - 1]) {
                    trendData[trendData.length - 1].leads = data.totalLeads;
                }
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (unauthorized) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <h2>Access Restricted</h2>
                <p style={{ margin: '1rem 0', color: '#9ca3af' }}>You must log in to view sensitive lead data.</p>
                <button
                    onClick={() => window.location.reload()}
                    style={{ padding: '0.75rem 1.5rem', background: 'var(--brand-gold)', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Log In
                </button>
            </div>
        );
    }

    if (loading) return <div style={{ padding: '4rem', color: 'white' }}>Loading real-time data...</div>;

    return (
        <div className="fade-in dashboard-container" style={{ padding: 'var(--spacing-xl)', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h2 style={{ fontSize: '2rem' }}>Analytics Dashboard</h2>
                <p>Monitor your performance metrics and lead flow in real-time.</p>
            </header>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <StatCard
                    title="Total Leads Generated"
                    value={stats.totalLeads}
                    subtext="Verified Real Data"
                    icon={Users}
                    trend="up"
                />
                <StatCard
                    title="Conversion Rate"
                    value="24.8%"
                    subtext="Based on industry avg"
                    icon={TrendingUp}
                    trend="up"
                />
                <StatCard
                    title="Active Campaigns"
                    value="1"
                    subtext="Live on Website"
                    icon={Filter}
                    trend="neutral"
                />
                <StatCard
                    title="Recent Activity"
                    value={stats.recentLeads.length}
                    subtext="New leads this session"
                    icon={LayoutDashboard}
                    trend="up"
                />
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Recent Leads Table (Real Data) */}
                <div style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius)',
                    padding: 'var(--spacing-lg)'
                }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Latest Leads (Live DB)</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '1rem 0' }}>Email</th>
                                    <th style={{ padding: '1rem 0' }}>Company</th>
                                    <th style={{ padding: '1rem 0' }}>Phone</th>
                                    <th style={{ padding: '1rem 0' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentLeads.map((lead) => (
                                    <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem 0' }}>{lead.email}</td>
                                        <td style={{ padding: '1rem 0' }}>{lead.company}</td>
                                        <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{lead.phone || '-'}</td>
                                        <td style={{ padding: '1rem 0', fontSize: '0.85rem' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {stats.recentLeads.length === 0 && (
                                    <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No leads found yet. Go sign up!</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Charts Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                    gap: 'var(--spacing-xl)'
                }}>
                    {/* Lead Trends */}
                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius)',
                        padding: 'var(--spacing-lg)'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-lg)' }}>Lead Acquisition Trend</h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="name" stroke="#666" />
                                    <YAxis stroke="#666" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="leads"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorLeads)"
                                        name="Total Leads"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Lead Sources */}
                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius)',
                        padding: 'var(--spacing-lg)'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-lg)' }}>Lead Sources</h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sourceData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                    <XAxis type="number" stroke="#666" />
                                    <YAxis dataKey="name" type="category" stroke="#666" width={100} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
