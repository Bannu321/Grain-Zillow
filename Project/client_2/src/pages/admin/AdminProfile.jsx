import React, { useState } from 'react';
import Layout from './components/Layout';
import ContentContainer from './components/ContentContainer';
import StatCard from './components/StatCard';
import ProfileModal from './components/ProfileModal';

export default function AdminProfile() {
  const [modalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@grainszillow.com',
    phone: '+91 98765 43210',
    department: 'System Administration',
  });

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  
  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile information updated successfully!');
    closeModal();
  };

  const styles = {
    welcomeCard: {
      background: '#fff',
      borderRadius: '14px',
      boxShadow: '0 2px 8px 0 rgba(15,118,110,0.08)',
      padding: '28px',
      textAlign: 'center',
      marginBottom: '25px',
      maxWidth: '900px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    profileGrid: {
      maxWidth: '1200px',
      margin: '0 auto 40px',
      display: 'grid',
      gap: '25px',
      gridTemplateColumns: '1fr 2fr'
    },
    profileCard: {
      background: '#fff',
      borderRadius: '14px',
      boxShadow: '0 2px 8px 0 rgba(15,118,110,0.08)',
      padding: '32px',
      textAlign: 'center'
    },
    profileImage: {
      width: '130px',
      height: '130px',
      objectFit: 'cover',
      borderRadius: '50%',
      border: '4px solid #E8F5E9',
      marginBottom: '20px'
    },
    profileName: {
      fontSize: '22px',
      color: '#0f766e',
      marginBottom: '6px',
      fontWeight: '600'
    },
    profileRole: {
      color: '#575757',
      background: '#E8F5E9',
      borderRadius: '999px',
      padding: '7px 16px',
      fontSize: '14px',
      marginBottom: '10px',
      display: 'inline-block'
    },
    profileId: {
      color: '#aaa',
      fontSize: '13px',
      marginBottom: '16px'
    },
    infoBox: {
      background: '#f3f4f6',
      borderRadius: '9px',
      padding: '13px 0',
      marginTop: '18px',
      marginBottom: '14px'
    },
    infoTitle: {
      color: '#0f766e',
      margin: '0',
      fontWeight: '600',
      marginBottom: '5px',
      fontSize: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    infoValue: {
      margin: '0',
      color: '#374151'
    },
    systemOverview: {
      background: '#fff',
      borderRadius: '14px',
      boxShadow: '0 2px 8px 0 rgba(15,118,110,0.08)',
      padding: '28px',
      marginBottom: '0'
    },
    sectionTitle: {
      color: '#0f766e',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      fontSize: '21px',
      fontWeight: '600'
    },
    statsGrid: {
      display: 'grid',
      gap: '15px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'
    },
    infoGrid: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gap: '30px',
      gridTemplateColumns: '1fr 1fr'
    },
    infoCard: {
      background: '#fff',
      borderRadius: '14px',
      boxShadow: '0 2px 8px 0 rgba(15,118,110,0.08)',
      padding: '28px'
    },
    infoList: {
      display: 'grid',
      gap: '12px',
      gridTemplateColumns: '1fr'
    },
    updateButton: {
      background: '#0f766e',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      padding: '12px 23px',
      fontSize: '16px',
      marginTop: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background 0.2s'
    }
  };

  const systemStats = [
    {
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
      label: "Total Users",
      value: "47",
      trend: "+5 this month",
      trendColor: "#16A34A"
    },
    {
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      label: "Active Silos",
      value: "18",
      trend: "100% operational",
      trendColor: "#0f766e"
    },
    {
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z",
      label: "Alerts Today",
      value: "3",
      trend: "+2 from yesterday",
      trendColor: "#DC2626"
    },
    {
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      label: "System Uptime",
      value: "99.8%",
      trend: "Last 30 days",
      trendColor: "#115e59"
    }
  ];

  const systemInfo = [
    {
      icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
      title: "Database Status",
      value: "Online",
      color: "#16A34A"
    },
    {
      icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
      title: "IoT Devices",
      value: "54 Connected"
    },
    {
      icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
      title: "Server Load",
      value: "24%"
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Security Level",
      value: "High"
    }
  ];

  const contactInfo = [
    {
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      title: "Email Address",
      value: profile.email
    },
    {
      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
      title: "Phone Number",
      value: profile.phone
    },
    {
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
      title: "Office Location",
      value: "Headquarters, VIT-AP University"
    },
    {
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Office Hours",
      value: "Mon-Fri, 8:00 AM - 6:00 PM"
    }
  ];

  return (
    <Layout currentPage="My Profile" variant="admin">
      <ContentContainer>
        {/* Welcome Card */}
        <div style={styles.welcomeCard}>
          <h1 style={{ color: '#0f766e', fontSize: '26px', fontWeight: '600', marginBottom: '8px' }}>Admin Profile</h1>
          <p style={{ color: '#7a7a7a' }}>Manage your account and view system overview</p>
        </div>

        {/* Profile + Stats Grid */}
        <div style={styles.profileGrid}>
          {/* Profile Card */}
          <div style={styles.profileCard}>
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
              alt="Profile"
              style={styles.profileImage}
            />
            <h2 style={styles.profileName}>{profile.fullName}</h2>
            <div style={styles.profileRole}>System Administrator</div>
            <div style={styles.profileId}>ID: GRZ-ADMIN-001</div>
            
            <div style={styles.infoBox}>
              <h4 style={styles.infoTitle}>
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Member Since
              </h4>
              <p style={styles.infoValue}>March 10, 2023</p>
            </div>
            
            <div style={{ ...styles.infoBox, marginTop: '10px', marginBottom: '0' }}>
              <h4 style={styles.infoTitle}>
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin Level
              </h4>
              <p style={styles.infoValue}>Super Administrator</p>
            </div>
          </div>

          {/* System Overview Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={styles.systemOverview}>
              <h3 style={styles.sectionTitle}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                System Overview
              </h3>
              <div style={styles.statsGrid}>
                {systemStats.map((stat, index) => (
                  <StatCard
                    key={index}
                    icon={stat.icon}
                    value={stat.value}
                    label={stat.label}
                    trend={stat.trend}
                    trendColor={stat.trendColor}
                    compact
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Information & Contact Information */}
        <div style={styles.infoGrid}>
          {/* System Info */}
          <div style={styles.infoCard}>
            <h3 style={styles.sectionTitle}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              System Information
            </h3>
            <div style={styles.infoList}>
              {systemInfo.map((info, index) => (
                <InfoItem
                  key={index}
                  icon={info.icon}
                  title={info.title}
                  value={info.value}
                  color={info.color}
                />
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div style={styles.infoCard}>
            <h3 style={styles.sectionTitle}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Contact Information
            </h3>
            <div style={styles.infoList}>
              {contactInfo.map((contact, index) => (
                <InfoItem
                  key={index}
                  icon={contact.icon}
                  title={contact.title}
                  value={contact.value}
                />
              ))}
            </div>
            <button
              style={styles.updateButton}
              onClick={openModal}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#115e59';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0f766e';
              }}
            >
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Update Profile Information
            </button>
          </div>
        </div>

        {/* Profile Modal */}
        <ProfileModal
          isOpen={modalOpen}
          onClose={closeModal}
          profile={profile}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
        />
      </ContentContainer>
    </Layout>
  );
}

// InfoItem Component
function InfoItem({ icon, title, value, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '13px',
      padding: '8px 0'
    }}>
      <svg style={{ 
        width: '20px', 
        height: '20px', 
        color: '#0f766e',
        flexShrink: 0
      }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{
          color: '#7a7a7a',
          marginBottom: '2px',
          fontSize: '14px',
          fontWeight: '500'
        }}>{title}</div>
        <div style={{
          fontWeight: '600',
          color: color || '#444',
          fontSize: '15px'
        }}>{value}</div>
      </div>
    </div>
  );
}