import React from 'react';

export default function WelcomeSection({ 
  title = "GrainZillow", 
  subtitle = "Monitor real-time data of your silo — stay informed and take control of your grain storage conditions." 
}) {
  return (
    <section style={{ marginBottom: '40px' }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '36px 32px',
        textAlign: 'center',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h1 style={{
          fontSize: '38px',
          fontWeight: 'bold',
          color: '#0f766e',
          margin: '0 0 18px 0',
          lineHeight: 1.2
        }}>
          {title}
        </h1>
        <p style={{
          fontSize: '17px',
          color: '#6b7280',
          margin: 0,
          lineHeight: 1.6,
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}