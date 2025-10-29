import React, { useState, useRef, useEffect } from "react";
import Layout from "./components/Layout";
import ContentContainer from "./components/ContentContainer";
import ContactList from "./components/ContactList";
import ChatPanel from "./components/ChatPanel";
import MessageComposer from "./components/MessageComposer";
import MessageHistory from "./components/MessageHistory";

// Example contacts for illustration
const contactsList = [
  { id: "manager1", name: "Rajesh Kumar", role: "Manager - Zone A", online: true },
  { id: "manager2", name: "Priya Sharma", role: "Manager - Zone B", online: true },
  { id: "employee1", name: "Amit Kumar", role: "Employee - Silo A1", online: true },
  { id: "employee2", name: "Sunita Das", role: "Employee - Silo B2", online: false },
  { id: "employee3", name: "Vikram Patel", role: "Employee - Silo C3", online: true },
];

// Initial chat messages
const initialMessages = [
  { sender: "received", text: "Good morning, the temperature in Silo A1 is reading higher than normal. Should I activate the ventilation system?", time: "10:24 AM" },
  { sender: "sent", text: "Yes, please activate the ventilation for 2 hours and monitor the temperature. Let me know if it doesn't decrease.", time: "10:26 AM" },
  { sender: "received", text: "Understood. I'll keep you updated. Also, the weekly maintenance report is ready for review.", time: "10:28 AM" },
];

// Message history data
const messageHistory = [
  {
    id: 1,
    date: "24-Oct-2025 10:26 AM",
    recipient: "Rajesh Kumar",
    role: "Manager",
    subject: "Ventilation System",
    message: "Yes, please activate the ventilation for 2 hours...",
    status: "Delivered"
  },
  {
    id: 2,
    date: "23-Oct-2025 03:15 PM",
    recipient: "All Managers",
    role: "Manager",
    subject: "Weekly Meeting",
    message: "Reminder: Weekly managers meeting tomorrow at 10 AM...",
    status: "Delivered"
  },
  {
    id: 3,
    date: "22-Oct-2025 09:30 AM",
    recipient: "All Employees",
    role: "Employee",
    subject: "Safety Protocol Update",
    message: "Please review the updated safety protocols...",
    status: "Delivered"
  }
];

export default function AdminMessages() {
  const [activeContactId, setActiveContactId] = useState("manager1");
  const [chatMessages, setChatMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const chatMessagesRef = useRef(null);

  const [composeData, setComposeData] = useState({
    recipientType: "individual",
    selectedRecipient: "manager1",
    subject: "",
    content: ""
  });

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const activeContact = contactsList.find((c) => c.id === activeContactId);

  const sendChatMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [...prev, { sender: "sent", text: trimmed, time }]);
    setNewMessage("");
  };

  const handleComposeChange = (field, value) => {
    setComposeData(prev => ({ ...prev, [field]: value }));
  };

  const sendNewMessage = () => {
    const { subject, content } = composeData;
    if (!subject.trim() || !content.trim()) {
      alert("Please fill in subject and message content!");
      return;
    }
    alert("Message sent successfully!");
    setComposeData({
      recipientType: "individual",
      selectedRecipient: "manager1",
      subject: "",
      content: ""
    });
  };

  const styles = {
    mainLayout: {
      display: 'flex',
      gap: '30px',
      alignItems: 'stretch',
      marginBottom: '34px'
    },
    sectionTitle: {
      color: '#0f766e',
      fontWeight: 600,
      fontSize: '23px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  };

  return (
    <Layout currentPage="Message Centre" variant="admin">
      <ContentContainer>
        <h2 style={styles.sectionTitle}>
          <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Message Centre
        </h2>

        <div style={styles.mainLayout}>
          {/* Contacts Panel */}
          <ContactList
            contacts={contactsList}
            activeContactId={activeContactId}
            onContactSelect={setActiveContactId}
          />

          {/* Chat Panel */}
          <ChatPanel
            activeContact={activeContact}
            messages={chatMessages}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSendMessage={sendChatMessage}
            messagesRef={chatMessagesRef}
          />
        </div>

        {/* New Message/Compose Panel */}
        <MessageComposer
          composeData={composeData}
          contacts={contactsList}
          onChange={handleComposeChange}
          onSend={sendNewMessage}
        />

        {/* Message History Table */}
        <MessageHistory messages={messageHistory} />
      </ContentContainer>
    </Layout>
  );
}