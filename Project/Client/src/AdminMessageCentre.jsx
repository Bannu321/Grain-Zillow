import React, { useState, useRef, useEffect } from "react";

const contactsList = [
  { id: "manager1", name: "Rajesh Kumar", role: "Manager - Zone A", online: true },
  { id: "manager2", name: "Priya Sharma", role: "Manager - Zone B", online: true },
  { id: "employee1", name: "Amit Kumar", role: "Employee - Silo A1", online: true },
  { id: "employee2", name: "Sunita Das", role: "Employee - Silo B2", online: false },
  { id: "employee3", name: "Vikram Patel", role: "Employee - Silo C3", online: true },
];

export default function AdminMessages() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeContactId, setActiveContactId] = useState("manager1");
  const [chatMessages, setChatMessages] = useState([
    { sender: "received", text: "Good morning, the temperature in Silo A1 is reading higher than normal. Should I activate the ventilation system?", time: "10:24 AM" },
    { sender: "sent", text: "Yes, please activate the ventilation for 2 hours and monitor the temperature. Let me know if it doesn't decrease.", time: "10:26 AM" },
    { sender: "received", text: "Understood. I'll keep you updated. Also, the weekly maintenance report is ready for review.", time: "10:28 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const chatMessagesRef = useRef(null);

  const [recipientType, setRecipientType] = useState("individual");
  const [selectedRecipient, setSelectedRecipient] = useState("manager1");
  const [newSubject, setNewSubject] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const toggleSidebar = () => setSidebarExpanded((v) => !v);

  const activeContact = contactsList.find((c) => c.id === activeContactId);

  const sendChatMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [...prev, { sender: "sent", text: trimmed, time }]);
    setNewMessage("");
  };

  const sendNewMessageHandler = () => {
    if (!newSubject.trim() || !newContent.trim()) {
      alert("Please fill in subject and message content!");
      return;
    }
    alert("Message sent successfully!");
    setNewSubject("");
    setNewContent("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f2fdfb] to-[#e6f4f1] font-poppins text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-br from-teal-700 to-teal-900 text-white flex justify-between items-center px-6 shadow z-30">
        <button
          className="text-2xl"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-ellipsis-v"></i>
        </button>
        <div className="flex items-center gap-4 text-lg font-semibold">
          <i className="fas fa-seedling text-yellow-300"></i> GrainZillow Admin
        </div>
        <button
          className="bg-white text-teal-700 px-4 py-1 rounded font-semibold hover:bg-gray-100"
          onClick={() => alert("Logout clicked")}
        >
          Logout
        </button>
      </header>

      {/* Sidebar */}
      <nav
        className={`fixed top-16 left-0 bottom-0 bg-white shadow-md overflow-hidden z-20 transition-width duration-300 ${
          sidebarExpanded ? "w-56" : "w-16"
        }`}
      >
        <ul className="flex flex-col pt-6">
          {[
            { icon: "fa-home", label: "Dashboard" },
            { icon: "fa-list", label: "Silo List" },
            { icon: "fa-warehouse", label: "Silo Management" },
            { icon: "fa-seedling", label: "Grains Inventory" },
            { icon: "fa-user-tie", label: "Managers Management" },
            { icon: "fa-users", label: "Employee Management" },
            { icon: "fa-address-book", label: "Contact Management" },
            { icon: "fa-envelope", label: "Message Centre", active: true, badge: 3 },
            { icon: "fa-user", label: "My Profile" },
          ].map(({ icon, label, active, badge }, i) => (
            <li key={i}>
              <a
                href="#"
                className={`flex items-center justify-between py-3 px-4 border-l-4 border-transparent hover:bg-[#e0f7f5] transition ${
                  active ? "bg-[#e0f7f5] border-teal-700 text-teal-900" : "text-gray-700"
                }`}
              >
                <div className="flex items-center gap-4">
                  <i className={`fas ${icon} w-6 text-center text-lg`}></i>
                  <span className={`whitespace-nowrap transition-opacity duration-300 ${sidebarExpanded ? "opacity-100" : "opacity-0"}`}>{label}</span>
                </div>
                {badge && sidebarExpanded && (
                  <span className="badge active">{badge}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main
        className={`flex-1 transition-margin duration-300 pt-28 px-6 ml-16 ${
          sidebarExpanded ? "ml-56" : "ml-16"
        } flex flex-col`}
      >
        <h2 className="section mb-6 text-teal-700 font-semibold flex items-center gap-2">
          <i className="fas fa-envelope"></i> Message Centre
        </h2>

        <div className="messages-container flex gap-6">
          {/* Contacts Panel */}
          <aside className="contacts-panel w-72 max-h-[600px] overflow-y-auto bg-[#f9f9f9] rounded-lg p-4">
            <h3 className="text-teal-700 font-semibold mb-4">Contacts</h3>
            {contactsList.map(({ id, name, role, online }) => (
              <div
                key={id}
                className={`contact flex items-center p-3 rounded cursor-pointer mb-2 transition ${
                  id === activeContactId ? "bg-[#e0f7f5] border-l-4 border-teal-700" : ""
                }`}
                onClick={() => setActiveContactId(id)}
              >
                <div className="contact-avatar bg-teal-700 text-white font-bold text-center w-10 h-10 rounded-full flex items-center justify-center">
                  {name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="contact-info ml-3 flex flex-col">
                  <span className="contact-name font-semibold">{name}</span>
                  <span className="contact-role text-sm text-gray-600">{role}</span>
                </div>
                <div className={`contact-status ml-auto text-xs px-2 py-0.5 rounded-full ${online ? "bg-green-600 text-white" : "bg-gray-400 text-white"}`}>
                  {online ? "Online" : "Offline"}
                </div>
              </div>
            ))}
          </aside>

          {/* Chat Panel */}
          <section className="chat-panel flex flex-col flex-1 rounded-lg overflow-hidden shadow">
            <header className="chat-header flex items-center gap-4 bg-teal-700 text-white p-4">
              <div className="contact-avatar bg-teal-900 font-bold text-lg w-12 h-12 rounded-full flex items-center justify-center">
                {activeContact?.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="contact-name text-xl font-semibold">
                  {activeContact?.name}
                </div>
                <div className="contact-role text-sm opacity-80">
                  {activeContact?.role}
                </div>
              </div>
            </header>

            <div ref={chatMessagesRef} className="chat-messages flex-1 p-4 bg-[#f5fffd] overflow-y-auto flex flex-col gap-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`message max-w-2/3 p-3 rounded-xl ${
                    msg.sender === "sent"
                      ? "self-end bg-blue-100 rounded-tr-lg"
                      : "self-start bg-white rounded-tl-lg"
                  }`}
                >
                  <div>{msg.text}</div>
                  <div className="message-time text-xs text-gray-500 mt-1 text-right">{msg.time}</div>
                </div>
              ))}
            </div>

            <div className="chat-input flex p-4 bg-white border-t border-gray-300">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow p-3 rounded-full border border-gray-300 outline-none focus:ring-2 focus:ring-teal-600"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendChatMessage();
                  }
                }}
              />
              <button
                onClick={sendChatMessage}
                className="ml-3 w-12 h-12 rounded-full bg-teal-700 text-white flex items-center justify-center hover:bg-teal-800"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </section>
        </div>

        {/* New Message Panel */}
        <section className="new-message-panel bg-white rounded-lg shadow p-6 mt-8 max-w-4xl w-full">
          <h3 className="text-teal-700 font-semibold mb-5 flex items-center gap-2">
            <i className="fas fa-edit"></i> Compose New Message
          </h3>
          <div className="flex flex-col gap-5">
            <div className="flex gap-4 flex-wrap">
              <div className="form-group flex-grow min-w-[200px]">
                <label htmlFor="recipientType" className="block mb-2 font-semibold text-gray-700">
                  Recipient Type
                </label>
                <select
                  id="recipientType"
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-teal-600 outline-none"
                >
                  <option value="individual">Individual</option>
                  <option value="managers">All Managers</option>
                  <option value="employees">All Employees</option>
                  <option value="all">All Users</option>
                </select>
              </div>
              {recipientType === "individual" && (
                <div className="form-group flex-grow min-w-[200px]">
                  <label htmlFor="recipientSelect" className="block mb-2 font-semibold text-gray-700">
                    Select Recipient
                  </label>
                  <select
                    id="recipientSelect"
                    value={selectedRecipient}
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                    className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-teal-600 outline-none"
                  >
                    {contactsList.map(({ id, name, role }) => (
                      <option key={id} value={id}>
                        {name} ({role})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="messageSubject" className="block mb-2 font-semibold text-gray-700">
                Subject
              </label>
              <input
                id="messageSubject"
                type="text"
                placeholder="Enter message subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>
            <div className="form-group">
              <label htmlFor="messageContent" className="block mb-2 font-semibold text-gray-700">
                Message
              </label>
              <textarea
                id="messageContent"
                placeholder="Type your message here..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full p-3 rounded border border-gray-300 resize-y min-h-[120px] focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>
            <button
              className="send-btn px-6 py-3 bg-teal-700 rounded text-white font-semibold hover:bg-teal-800 flex items-center gap-2 w-max"
              onClick={() => {
                if (!newSubject.trim() || !newContent.trim()) {
                  alert("Please fill in subject and message content!");
                  return;
                }
                alert("Message sent successfully!");
                setNewSubject("");
                setNewContent("");
              }}
            >
              <i className="fas fa-paper-plane"></i> Send Message
            </button>
          </div>
        </section>

        {/* Message History */}
        <section className="mt-10 max-w-6xl w-full">
          <h2 className="text-teal-700 font-semibold flex items-center gap-2 mb-4">
            <i className="fas fa-history"></i> Message History
          </h2>
          <table className="min-w-full border border-gray-300 border-collapse text-sm">
            <thead>
              <tr className="bg-teal-100 text-teal-900 font-semibold">
                <th className="border border-gray-300 px-4 py-2">Date & Time</th>
                <th className="border border-gray-300 px-4 py-2">Recipient</th>
                <th className="border border-gray-300 px-4 py-2">Role</th>
                <th className="border border-gray-300 px-4 py-2">Subject</th>
                <th className="border border-gray-300 px-4 py-2">Message</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">24-Oct-2025 10:26 AM</td>
                <td className="border border-gray-300 px-4 py-2">Rajesh Kumar</td>
                <td className="border border-gray-300 px-4 py-2">Manager</td>
                <td className="border border-gray-300 px-4 py-2">Ventilation System</td>
                <td className="border border-gray-300 px-4 py-2">Yes, please activate the ventilation for 2 hours...</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600 font-semibold">Delivered</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">23-Oct-2025 03:15 PM</td>
                <td className="border border-gray-300 px-4 py-2">All Managers</td>
                <td className="border border-gray-300 px-4 py-2">Manager</td>
                <td className="border border-gray-300 px-4 py-2">Weekly Meeting</td>
                <td className="border border-gray-300 px-4 py-2">Reminder: Weekly managers meeting tomorrow at 10 AM...</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600 font-semibold">Delivered</td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">22-Oct-2025 09:30 AM</td>
                <td className="border border-gray-300 px-4 py-2">All Employees</td>
                <td className="border border-gray-300 px-4 py-2">Employee</td>
                <td className="border border-gray-300 px-4 py-2">Safety Protocol Update</td>
                <td className="border border-gray-300 px-4 py-2">Please review the updated safety protocols...</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600 font-semibold">Delivered</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
