import React from 'react';

export default function ContentContainer({ children }) {
  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 24px'
    }}>
      {children}
    </div>
  );
}