import React, { useState } from "react";

const initialContacts = {
  email: "grainszillow.support@gmail.com",
  landline: "+91 866 242 3456",
  mobile: "+91 82590 73296",
  whatsapp: "+91 75433 66557",
  institution: "VIT-AP University",
  address: "VIT-AP University, Amaravati, AP-522237",
};

export default function ContactManagement() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState(
    "Silo maintenance scheduled for this Saturday from 9 AM to 12 PM. All silos will be offline during this period. Please plan your activities accordingly."
  );
  const [recipient, setRecipient] = useState("all");
  const [expiry, setExpiry] = useState("3days");
  const [priority, setPriority] = useState("normal");
  const [showSuccess, setShowSuccess] = useState(false);
  const [contacts, setContacts] = useState(initialContacts);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  const priorityOptions = [
    { id: "normal", label: "Normal", icon: "fa-info-circle", style: "bg-green-600" },
    { id: "important", label: "Important", icon: "fa-exclamation-triangle", style: "bg-yellow-600" },
    { id: "critical", label: "Critical", icon: "fa-exclamation-circle", style: "bg-red-600" },
  ];

  const handleSendBroadcast = () => {
    // Here you would send data to backend
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleResetContacts = () => {
    setContacts(initialContacts);
  };

  const handleContactChange = (field, value) => {
    setContacts((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveContacts = () => {
    alert("Contact information updated successfully!");
    // Implement backend save logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4f1] to-[#f2fdfb] font-poppins flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-between px-6 shadow z-30">
        <button className="text-2xl" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <i className="fas fa-ellipsis-v"></i>
        </button>
        <div className="flex items-center gap-4 text-lg font-semibold">
          <i className="fas fa-seedling text-yellow-300"></i> GrainZillow - Contact Management
        </div>
        <button
          className="bg-white text-teal-700 rounded px-4 py-1 font-semibold hover:bg-gray-100 transition"
          onClick={() => alert("Logout clicked")}
        >
          Logout
        </button>
      </header>

      {/* Sidebar */}
      <nav
        className={`fixed top-16 left-0 bottom-0 bg-white shadow-md transition-width duration-300 overflow-hidden z-20 ${
          sidebarExpanded ? "w-56" : "w-16"
        }`}
      >
        <ul className="flex flex-col pt-6">
          {[
            { to: "/", icon: "fa-home", label: "Dashboard" },
            { to: "/silo-list", icon: "fa-list", label: "Silo List" },
            { to: "/silo-management", icon: "fa-warehouse", label: "Silo Management" },
            { to: "/grains-inventory", icon: "fa-seedling", label: "Grains Inventory" },
            { to: "/managers-management", icon: "fa-user-tie", label: "Managers Management" },
            { to: "/employees-management", icon: "fa-users", label: "Employee Management" },
            { to: "/contact-management", icon: "fa-address-book", label: "Contact Management", active: true },
            { to: "/message-centre", icon: "fa-envelope", label: "Message Centre" },
            { to: "/my-profile", icon: "fa-user", label: "My Profile" },
          ].map(({ icon, label, active }, i) => (
            <li key={i}>
              <a
                href="#"
                className={`flex items-center gap-4 px-4 py-3 border-l-4 border-transparent hover:bg-[#e0f7f5] transition ${
                  active ? "bg-[#e0f7f5] border-teal-700 text-teal-900" : "text-gray-700"
                }`}
              >
                <i className={`fas ${icon} w-6 text-center text-lg`}></i>
                <span className={`whitespace-nowrap transition-opacity ${sidebarExpanded ? "opacity-100" : "opacity-0"}`}>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main
        className={`flex-1 p-6 pt-28 ml-16 transition-margin duration-300 ${
          sidebarExpanded ? "ml-56" : "ml-16"
        }`}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Left Column - Broadcast Announcement */}
          <section className="flex-1 bg-white rounded-lg p-6 shadow space-y-4">
            <h2 className="text-teal-700 font-semibold text-xl flex items-center gap-2">
              <i className="fas fa-bullhorn"></i> Broadcast Announcement
            </h2>

            {showSuccess && (
              <div className="bg-green-100 text-green-700 flex items-center gap-2 p-3 rounded">
                <i className="fas fa-check-circle"></i> Announcement sent successfully!
              </div>
            )}

            <textarea
              className="w-full p-3 border border-gray-300 rounded resize-y focus:outline-none focus:ring-2 focus:ring-teal-600"
              rows="6"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
            ></textarea>

            <div className="flex gap-4 flex-wrap">
              <select
                className="flex-grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              >
                <option value="all">Send to All Users</option>
                <option value="managers">Managers Only</option>
                <option value="employees">Employees Only</option>
              </select>
              <select
                className="flex-grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              >
                <option value="1day">Expire in 1 day</option>
                <option value="3days">Expire in 3 days</option>
                <option value="1week">Expire in 1 week</option>
                <option value="2weeks">Expire in 2 weeks</option>
              </select>
            </div>

            <div className="flex gap-4">
              {priorityOptions.map(({ id, label, icon, style }) => (
                <div
                  key={id}
                  onClick={() => setPriority(id)}
                  className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded text-white font-semibold ${
                    priority === id ? style : "bg-gray-400 opacity-60"
                  }`}
                  title={label}
                >
                  <i className={`fas ${icon}`}></i> {priority === id && label}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded font-semibold flex items-center gap-2"
                onClick={handleSendBroadcast}
                type="button"
              >
                <i className="fas fa-paper-plane"></i> Send Now
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-semibold flex items-center gap-2">
                <i className="fas fa-clock"></i> Schedule
              </button>
            </div>
          </section>

          {/* Right Column - Contact Information Management */}
          <section className="w-full md:w-96 bg-white rounded-lg p-6 shadow space-y-6">
            <h2 className="text-teal-700 font-semibold text-xl flex items-center gap-2">
              <i className="fas fa-edit"></i> Manage Contact Information
            </h2>

            <ContactInfoItem label="Email Address" icon="fa-envelope" value={contacts.email} onChange={(val) => handleContactChange("email", val)} />
            <ContactInfoItem label="Landline" icon="fa-phone" value={contacts.landline} onChange={(val) => handleContactChange("landline", val)} />
            <ContactInfoItem label="Mobile" icon="fa-mobile-alt" value={contacts.mobile} onChange={(val) => handleContactChange("mobile", val)} />
            <ContactInfoItem label="WhatsApp" icon="fa-whatsapp" value={contacts.whatsapp} onChange={(val) => handleContactChange("whatsapp", val)} />
            <ContactInfoItem label="Institution" icon="fa-university" value={contacts.institution} onChange={(val) => handleContactChange("institution", val)} />
            <ContactInfoItem label="Address" icon="fa-map-marker-alt" value={contacts.address} onChange={(val) => handleContactChange("address", val)} />

            <div className="flex gap-3">
              <button
                className="submit-btn flex-grow"
                onClick={handleSaveContacts}
                type="button"
              >
                <i className="fas fa-save"></i> Save Changes
              </button>
              <button
                className="cancel-btn flex-grow"
                onClick={handleResetContacts}
                type="button"
              >
                <i className="fas fa-undo"></i> Reset
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const priorityOptions = [
  { id: "normal", label: "Normal", icon: "fa-info-circle", style: "bg-green-600" },
  { id: "important", label: "Important", icon: "fa-exclamation-triangle", style: "bg-yellow-600" },
  { id: "critical", label: "Critical", icon: "fa-exclamation-circle", style: "bg-red-600" },
];

function ContactInfoItem({ label, icon, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <i className={`fas ${icon} text-teal-700 w-5 text-center text-lg`}></i>
      <div className="flex flex-col flex-grow">
        <label className="font-semibold text-gray-700">{label}</label>
        <input
          type="text"
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
