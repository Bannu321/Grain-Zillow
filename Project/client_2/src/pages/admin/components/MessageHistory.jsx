import React from 'react';

export default function MessageHistory({ messages }) {
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: '0 2px 8px 0 rgba(15,118,110,0.06)',
      padding: "22px"
    },
    title: {
      color: '#0f766e',
      fontWeight: 700,
      fontSize: "19px",
      marginBottom: "14px",
      display: 'flex',
      alignItems: 'center',
      gap: "8px"
    },
    tableContainer: {
      overflowX: 'auto'
    },
    table: {
      minWidth: "880px",
      borderCollapse: "collapse",
      fontSize: "15px",
      width: '100%'
    },
    tableHead: {
      background: '#d1fae5',
      color: '#065f46',
      fontWeight: 700
    },
    headCell: {
      padding: "10px 18px",
      borderBottom: "2px solid #a7f3d0",
      textAlign: "left"
    },
    cell: {
      padding: "9px 15px",
      borderBottom: "1px solid #e5e7eb",
      textAlign: "left",
      color: "#374151"
    },
    statusCell: {
      color: '#059669',
      fontWeight: 600
    },
    row: (index) => ({
      background: index % 2 === 0 ? '#fff' : '#f9fafb'
    })
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>
        <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Message History
      </h2>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHead}>
              <th style={styles.headCell}>Date & Time</th>
              <th style={styles.headCell}>Recipient</th>
              <th style={styles.headCell}>Role</th>
              <th style={styles.headCell}>Subject</th>
              <th style={styles.headCell}>Message</th>
              <th style={styles.headCell}>Status</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message, index) => (
              <tr key={message.id} style={styles.row(index)}>
                <td style={styles.cell}>{message.date}</td>
                <td style={styles.cell}>{message.recipient}</td>
                <td style={styles.cell}>{message.role}</td>
                <td style={styles.cell}>{message.subject}</td>
                <td style={styles.cell}>{message.message}</td>
                <td style={{ ...styles.cell, ...styles.statusCell }}>{message.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}