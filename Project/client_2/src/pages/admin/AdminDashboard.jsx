import React from 'react';
import Layout from './components/Layout';
import WelcomeSection from './components/WelcomeSection';
import ContentContainer from './components/ContentContainer';
import StatCard from './components/StatCard';
import AlertItem from './components/AlertItem';

export default function AdminDashboard() {
  return (
    <Layout currentPage="Dashboard" variant="admin">
      <ContentContainer>
        {/* Welcome Card */}
        <div style={{
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 8px 0 rgba(15,118,110,0.10)',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#0f766e', margin: '0 0 6px' }}>Welcome, Admin</h1>
          <p style={{ color: '#666', margin: '0' }}>Overview of GrainZillow system performance and metrics</p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '26px'
        }}>
          <StatCard 
            icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
            value="24" 
            label="Total Silos" 
            trend="+2 this month" 
            trendColor="#059669" 
          />
          <StatCard 
            icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            value="8" 
            label="Total Managers" 
            trend="+1 this month" 
            trendColor="#059669" 
          />
          <StatCard 
            icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" 
            value="42" 
            label="Total Employees" 
            trend="+3 this month" 
            trendColor="#059669" 
          />
          <StatCard 
            icon="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" 
            value="96" 
            label="Active Devices" 
            trend="2 offline" 
            trendColor="#dc2626" 
          />
          <StatCard 
            icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" 
            value="3" 
            label="Current Alerts" 
            trend="From 5 yesterday" 
            trendColor="#dc2626" 
          />
          <StatCard 
            icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            value="28.5°C" 
            label="Avg Temperature" 
            trend="Across all silos" 
            trendColor="#64748b" 
          />
          <StatCard 
            icon="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" 
            value="65%" 
            label="Avg Humidity" 
            trend="Within safe range" 
            trendColor="#64748b" 
          />
        </div>

        {/* Recent Alerts Section */}
        <div style={{
          background: 'white',
          borderRadius: '10px',
          padding: '18px',
          boxShadow: '0 2px 8px 0 rgba(15,118,110,0.07)',
          marginBottom: '28px'
        }}>
          <h3 style={{
            color: '#004D40',
            marginBottom: '10px',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '7px'
          }}>
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Alerts
          </h3>
          <AlertItem
            icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            bgColor="#ef4444"
            title="High Temperature Alert - Silo B3"
            description="Temperature reached 42°C, exceeding safety threshold"
            time="10:30 AM • Today"
          />
          <AlertItem
            icon="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            bgColor="#f59e42"
            title="Device Offline - MQ135 Sensor"
            description="Gas sensor in Silo C2 not responding"
            time="Yesterday • 3:15 PM"
            warning
          />
          <AlertItem
            icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            bgColor="#ef4444"
            title="Humidity Spike - Silo A1"
            description="Humidity levels increased to 85% in last hour"
            time="Oct 25 • 2:45 PM"
          />
        </div>
      </ContentContainer>
    </Layout>
  );
}