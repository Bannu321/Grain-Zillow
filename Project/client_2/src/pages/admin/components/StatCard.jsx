import React from 'react';

export default function StatCard({ icon, value, label, trend, trendColor, compact = false }) {
  if (compact) {
    return <StatCardCompact icon={icon} value={value} label={label} trend={trend} trendColor={trendColor} />;
  }

  // ... your existing StatCard implementation
  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '18px',
      boxShadow: '0 2px 7px 0 rgba(15,118,110,0.07)',
      transition: 'transform 0.16s',
      cursor: 'pointer'
    }}
    // ... rest of existing implementation
    >
      {/* ... existing content */}
    </div>
  );
}

export function StatCardCompact({ icon, value, label, trend, trendColor }) {
  return (
    <div style={{
      background: '#f4f6f7',
      padding: '15px 0',
      borderRadius: '7px',
      borderLeft: '5px solid #0f766e',
      textAlign: 'center',
      boxShadow: '0 1px 4px 0 rgba(90,190,170,0.05)'
    }}>
      <h4 style={{
        color: '#545454',
        marginBottom: '4px',
        fontWeight: '400',
        fontSize: '14px'
      }}>{label}</h4>
      <div style={{
        fontSize: '22px',
        color: '#0f766e',
        fontWeight: '600'
      }}>{value}</div>
      <div style={{
        fontSize: '12px',
        marginTop: '2px',
        color: trendColor || '#888'
      }}>{trend}</div>
    </div>
  );
}