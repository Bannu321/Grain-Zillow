import React from 'react';

export default function ChatPanel({ activeContact, messages, newMessage, onNewMessageChange, onSendMessage, messagesRef }) {
  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      borderRadius: "11px",
      boxShadow: '0 3px 16px 0 rgba(15,100,80,0.06)',
      minWidth: 0,
      overflow: 'hidden'
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      background: '#0f766e',
      color: '#fff',
      padding: '17px 18px'
    },
    headerAvatar: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      fontWeight: 800,
      fontSize: "18px",
      background: '#115e59',
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    },
    headerInfo: {
      flex: 1
    },
    headerName: {
      fontSize: "18px",
      fontWeight: 600
    },
    headerRole: {
      fontSize: "13px",
      opacity: 0.8
    },
    messagesContainer: {
      flex: 1,
      padding: "18px",
      background: '#f5fffd',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: "10px"
    },
    messageBubble: {
      maxWidth: '70%',
      padding: '11px 14px',
      borderRadius: "14px",
      boxShadow: "0 2px 7px 0 rgba(15,118,110,0.03)",
      color: "#293152"
    },
    sentMessage: {
      alignSelf: "flex-end",
      background: "#dbeafe",
      boxShadow: "0 2px 9px 0 rgba(13,80,180,0.10)"
    },
    receivedMessage: {
      alignSelf: "flex-start",
      background: "#fff"
    },
    messageTime: {
      fontSize: "11px",
      color: '#8e99aa',
      marginTop: "2px",
      textAlign: 'right'
    },
    inputContainer: {
      display: 'flex',
      padding: '15px 15px',
      background: 'white',
      borderTop: '1px solid #e5e7eb'
    },
    input: {
      flex: 1,
      padding: '13px 18px',
      border: '1.5px solid #e0e7ef',
      outline: 'none',
      borderRadius: "26px",
      fontSize: "15px",
      background: "#fafafa",
      marginRight: "10px",
      transition: "border-color 0.2s"
    },
    sendButton: {
      minWidth: "46px",
      height: "46px",
      borderRadius: '50%',
      background: '#0f766e',
      color: '#fff',
      border: 'none',
      fontSize: "20px",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: "background 0.2s"
    }
  };

  return (
    <section style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerAvatar}>
          {activeContact?.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div style={styles.headerInfo}>
          <div style={styles.headerName}>{activeContact?.name}</div>
          <div style={styles.headerRole}>{activeContact?.role}</div>
        </div>
      </header>

      <div
        ref={messagesRef}
        style={styles.messagesContainer}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.messageBubble,
              ...(msg.sender === "sent" ? styles.sentMessage : styles.receivedMessage)
            }}
          >
            <div>{msg.text}</div>
            <div style={styles.messageTime}>{msg.time}</div>
          </div>
        ))}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type your message..."
          style={styles.input}
          value={newMessage}
          onChange={(e) => onNewMessageChange(e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = '#0f766e';
            e.target.style.boxShadow = '0 0 0 2px rgba(15, 118, 110, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e0e7ef';
            e.target.style.boxShadow = 'none';
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSendMessage();
            }
          }}
        />
        <button
          style={styles.sendButton}
          onClick={onSendMessage}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#115e59';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0f766e';
          }}
        >
          <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </section>
  );
}