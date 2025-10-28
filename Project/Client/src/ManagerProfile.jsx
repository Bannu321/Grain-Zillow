import React, { useState, useEffect } from "react";

const initialProfile = {
  name: "John Anderson",
  role: "Storage Manager",
  id: "GRZ-2024-7284",
  memberSince: "January 15, 2024",
  profileImg:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  siloInfo: {
    siloId: "SL-2024-N-001",
    location: "Northern Storage Facility",
    capacity: "10,000 kg",
    utilization: "4,050 kg (40.5%)",
  },
};

export default function MyProfile() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({ email: "", phone: "" });
  const [formInputs, setFormInputs] = useState({ email: "", phone: "" });

  useEffect(() => {
    // Load from localStorage if available
    const savedEmail = localStorage.getItem("userEmail") || "";
    const savedPhone = localStorage.getItem("userPhone") || "";
    setContactInfo({ email: savedEmail, phone: savedPhone });
    setFormInputs({ email: savedEmail, phone: savedPhone });

    // Auto open modal if contact info not set
    if (!savedEmail && !savedPhone) {
      setTimeout(() => {
        setContactModalOpen(true);
      }, 1000);
    }
  }, []);

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);

  const openModal = () => setContactModalOpen(true);
  const closeModal = () => setContactModalOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { email, phone } = formInputs;
    if (!email || !phone) {
      alert("Please fill in both email and phone.");
      return;
    }
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPhone", phone);
    setContactInfo({ email, phone });
    alert("Contact information updated successfully!");
    closeModal();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f2fdfb] to-[#e6f4f1] text-gray-800">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between h-[70px] bg-gradient-to-r from-teal-700 to-teal-900 text-white px-6 shadow-md z-50">
        <button onClick={toggleSidebar} className="text-2xl focus:outline-none">
          <i className="fas fa-ellipsis-v"></i>
        </button>
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <i className="fas fa-seedling text-2xl"></i>
          <h1>GrainZillow</h1>
        </div>
        <button className="bg-white text-teal-700 font-semibold rounded-md px-4 py-2 hover:bg-gray-100 transition">
          Logout
        </button>
      </header>

      {/* SIDEBAR */}
      <nav
        className={`fixed top-0 left-0 h-full bg-white shadow-lg pt-[70px] transition-all duration-300 overflow-hidden z-40 ${
          sidebarExpanded ? "w-56" : "w-16"
        }`}
      >
        <ul className="flex flex-col text-gray-700">
          {[
            { icon: "fas fa-home", label: "Dashboard" },
            { icon: "fas fa-users", label: "Employee Management" },
            { icon: "fas fa-tasks", label: "Task Assignment" },
            { icon: "fas fa-comments", label: "Message Centre" },
            { icon: "fas fa-history", label: "History Logs" },
            { icon: "fas fa-pen", label: "Manual Grain Entry" },
            { icon: "fas fa-user", label: "My Profile", active: true },
            { icon: "fas fa-info-circle", label: "About Us" },
            { icon: "fas fa-question-circle", label: "FAQs" },
            { icon: "fas fa-phone", label: "Contact Us" },
          ].map(({ icon, label, active }) => (
            <li key={label}>
              <a
                href="#"
                className={`flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:bg-teal-100 hover:text-teal-900 transition ${
                  active ? "bg-teal-100 border-teal-700 text-teal-900 font-semibold" : ""
                }`}
              >
                <i className={`${icon} w-6 text-center`}></i>
                <span
                  className={`whitespace-nowrap transition-opacity ${
                    sidebarExpanded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main
        className={`flex-1 pt-[70px] px-10 pb-8 transition-all duration-300 ${
          sidebarExpanded ? "ml-56" : "ml-16"
        } flex flex-col items-center`}
      >
        {/* Welcome */}
        <div className="max-w-7xl w-full bg-white rounded-lg shadow-md p-6 mb-10 text-center">
          <h1 className="text-teal-700 text-3xl font-bold mb-2">My Profile</h1>
          <p>Manage your account information and view your assigned storage details</p>
        </div>

        {/* Profile & Contact Section */}
        <div className="max-w-7xl w-full grid gap-8 grid-cols-1 md:grid-cols-3">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <img
              src={initialProfile.profileImg}
              alt="Profile"
              className="w-36 h-36 rounded-full mx-auto border-4 border-green-100 mb-6 object-cover"
            />
            <h2 className="text-teal-700 text-2xl font-semibold mb-1">{initialProfile.name}</h2>
            <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm inline-block mb-3">{initialProfile.role}</div>
            <div className="text-gray-500 text-sm mb-6">ID: {initialProfile.id}</div>
            <div className="bg-gray-100 rounded-md p-4">
              <h4 className="text-teal-700 font-semibold flex items-center gap-2 mb-2">
                <i className="fas fa-calendar-alt"></i> Member Since
              </h4>
              <p>{initialProfile.memberSince}</p>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:col-span-2">
            <h3 className="flex items-center gap-3 text-teal-700 text-xl font-semibold mb-6">
              <i className="fas fa-address-card"></i> Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-4 bg-gray-100 rounded p-4">
                <i className="fas fa-envelope text-teal-700 text-lg w-6 text-center"></i>
                <div>
                  <h4 className="text-gray-600 text-sm">Email Address</h4>
                  <p className={`font-semibold${contactInfo.email ? "" : " italic text-gray-400"}`}>
                    {contactInfo.email || "Not set yet"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-100 rounded p-4">
                <i className="fas fa-phone text-teal-700 text-lg w-6 text-center"></i>
                <div>
                  <h4 className="text-gray-600 text-sm">Phone Number</h4>
                  <p className={`font-semibold${contactInfo.phone ? "" : " italic text-gray-400"}`}>
                    {contactInfo.phone || "Not set yet"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setContactModalOpen(true)}
              className="bg-teal-700 hover:bg-teal-900 text-white font-semibold rounded-md px-6 py-3 flex items-center gap-3"
            >
              <i className="fas fa-edit"></i> Update Contact Information
            </button>
          </div>
        </div>

        {/* Assigned Storage Info */}
        <div className="max-w-7xl w-full bg-white rounded-xl shadow-lg p-8 mt-10">
          <h3 className="flex items-center gap-3 text-teal-700 text-xl font-semibold mb-6">
            <i className="fas fa-warehouse"></i> Assigned Storage Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-100 rounded p-4 border-l-4 border-teal-700">
              <h4 className="text-gray-600 text-sm mb-2">Silo ID</h4>
              <p className="font-semibold text-teal-700">{initialProfile.siloInfo.siloId}</p>
            </div>
            <div className="bg-gray-100 rounded p-4 border-l-4 border-teal-700">
              <h4 className="text-gray-600 text-sm mb-2">Location</h4>
              <p className="font-semibold text-teal-700">{initialProfile.siloInfo.location}</p>
            </div>
            <div className="bg-gray-100 rounded p-4 border-l-4 border-teal-700">
              <h4 className="text-gray-600 text-sm mb-2">Storage Capacity</h4>
              <p className="font-semibold text-teal-700">{initialProfile.siloInfo.capacity}</p>
            </div>
            <div className="bg-gray-100 rounded p-4 border-l-4 border-teal-700">
              <h4 className="text-gray-600 text-sm mb-2">Current Utilization</h4>
              <p className="font-semibold text-teal-700">{initialProfile.siloInfo.utilization}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-teal-900 text-white text-center py-3 mt-auto w-full">
        © 2025 GrainZillow — Smart Grain Storage Monitoring System
      </footer>

      {/* Contact Modal */}
      {contactModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
          onClick={() => setContactModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-teal-700 text-xl font-semibold flex items-center gap-2">
                <i className="fas fa-edit"></i> Update Contact Information
              </h3>
              <button
                onClick={() => setContactModalOpen(false)}
                className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!formInputs.email || !formInputs.phone) {
                  alert("Both email and phone are required.");
                  return;
                }
                setContactInfo(formInputs);
                localStorage.setItem("userEmail", formInputs.email);
                localStorage.setItem("userPhone", formInputs.phone);
                alert("Contact information updated successfully!");
                setContactModalOpen(false);
              }}
            >
              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formInputs.email}
                  onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-700"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="phone" className="block mb-2 font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formInputs.phone}
                  onChange={(e) => setFormInputs({ ...formInputs, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-700"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-5 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-700 text-white px-5 py-2 rounded hover:bg-teal-900 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
