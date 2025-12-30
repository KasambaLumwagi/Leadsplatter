import { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import { LayoutDashboard, Users, TrendingUp, Filter } from 'lucide-react';

const data = [
    { name: 'Mon', leads: 40, qualified: 24 },
    { name: 'Tue', leads: 30, qualified: 18 },
    { name: 'Wed', leads: 55, qualified: 35 },
    { name: 'Thu', leads: 80, qualified: 50 },
    { name: 'Fri', leads: 65, qualified: 42 },
    { name: 'Sat', leads: 25, qualified: 15 },
    { name: 'Sun', leads: 30, qualified: 20 },
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
    return (
        <div className="fade-in" style={{ padding: 'var(--spacing-xl)', maxWidth: '1400px', margin: '0 auto' }}>
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
                    value="1,284"
                    subtext="12% vs last week"
                    icon={Users}
                    trend="up"
                />
                <StatCard
                    title="Conversion Rate"
                    value="24.8%"
                    subtext="2.1% vs last week"
                    icon={TrendingUp}
                    trend="up"
                />
                <StatCard
                    title="Active Campaigns"
                    value="8"
                    subtext="Same as last week"
                    icon={Filter}
                    trend="neutral"
                />
                <StatCard
                    title="Avg. Quality Score"
                    value="92/100"
                    subtext="Top tier performance"
                    icon={LayoutDashboard}
                    trend="up"
                />
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
                            <AreaChart data={data}>
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
                                <Area
                                    type="monotone"
                                    dataKey="qualified"
                                    stroke="#8b5cf6"
                                    fillOpacity={0}
                                    strokeWidth={2}
                                    name="Qualified Leads"
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
    );
};

export default Dashboard;
