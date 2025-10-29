import React from 'react';

export default function AlertItem({ icon, bgColor, title, description, time, warning = false }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px',
      borderRadius: '8px',
      borderLeft: `5px solid ${warning ? "#f59e42" : "#ef4444"}`,
      background: warning ? "#fff7e6" : "#ffe9e6",
      marginBottom: '12px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: bgColor,
        color: 'white',
        fontSize: '20px',
        marginRight: '14px'
      }}>
        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '600', color: '#004D40', marginBottom: '3px' }}>{title}</div>
        <div style={{ color: '#666', fontSize: '15px' }}>{description}</div>
        <div style={{ fontSize: '12px', color: '#aaa' }}>{time}</div>
      </div>
    </div>
  );
}