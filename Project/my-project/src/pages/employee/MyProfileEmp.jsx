import React, { useState, useEffect } from "react";

export default function MyProfile() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "Amit Kumar",
    email: "amit.kumar@grainszillow.com",
    phone: "+91 87654 32109",
    address: "VIT-AP University Campus, Amaravati",
  });
  const [workStats, setWorkStats] = useState({
    tasksCompleted: 47,
    workHours: 128,
    productivity: 94,
    weeklyTasks: 8,
    monthlyTasks: 32,
    completionRate: 96,
    avgRating: 4.7,
  });
  const [modalOpen, setModalOpen] = useState(false);

  // Sidebar toggle handler
  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);

  // Modal Form inputs state for updates
  const [formData, setFormData] = useState(profile);

  // Sync form when modal opens
  useEffect(() => {
    if (modalOpen) {
      setFormData(profile);
    }
  }, [modalOpen, profile]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setProfile(formData);
    alert("[translate:Profile information updated successfully!]");
    setModalOpen(false);
  };

  // Simulated real-time updates for work stats
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkStats((prev) => ({
        ...prev,
        tasksCompleted: prev.tasksCompleted + Math.round(Math.random()),
        workHours: prev.workHours + Math.round(Math.random()),
        weeklyTasks: prev.weeklyTasks + Math.round(Math.random()),
        monthlyTasks: prev.monthlyTasks + Math.round(Math.random()),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[70px] bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-between px-6 shadow-md z-50">
        <button
          className="toggle-sidebar bg-none border-none text-white text-lg cursor-pointer"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <i className="fas fa-ellipsis-v"></i>
        </button>
        <div className="logo flex items-center gap-2.5">
          <i className="fas fa-seedling text-2xl"></i>
          <h1>GrainZillow</h1>
        </div>
        <button className="logout-btn bg-white text-teal-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition-all">
          Logout
        </button>
      </header>

      <nav
        className={`sidebar fixed top-0 left-0 h-screen bg-white pt-[90px] shadow-md overflow-x-hidden transition-width duration-300 z-40 ${
          sidebarExpanded ? "w-[230px]" : "w-[70px]"
        }`}
      >
        <ul className="list-none p-0 m-0">
          {[
            { icon: "fa-home", label: "Dashboard" },
            { icon: "fa-history", label: "Work History" },
            { icon: "fa-tasks", label: "My Tasks" },
            { icon: "fa-envelope", label: "Messages" },
            { icon: "fa-user", label: "My Profile", active: true },
            { icon: "fa-question-circle", label: "Help & Support" },
          ].map(({ icon, label, active }) => (
            <li key={label}>
              <a
                href="#"
                className={`flex items-center px-5 py-3 gap-4 text-gray-800 no-underline border-l-4 ${
                  active
                    ? "bg-[#e0f7f5] border-l-teal-700 text-teal-900 font-semibold"
                    : "border-l-transparent hover:bg-[#e0f7f5] hover:border-l-teal-700 hover:text-teal-900"
                } ${!sidebarExpanded ? "justify-center" : ""}`}
              >
                <i className={`fas ${icon} w-5 text-center text-lg`}></i>
                <span
                  className={`sidebar-span transition-opacity duration-300 ${
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

      <main
        className={`flex-1 transition-margin duration-300 flex flex-col items-center pt-[90px] px-10 pb-10 ${
          sidebarExpanded ? "ml-[230px]" : "ml-[70px]"
        }`}
      >
        <div className="welcome bg-white p-5 rounded-lg shadow-md mb-7 text-center w-full max-w-[1200px]">
          <h1 className="text-teal-700 text-2xl mb-2.5">My Profile</h1>
          <p>Manage your account information and view your work details</p>
        </div>

        <section className="profile-section w-full max-w-[1200px]">
          <div className="profile-container grid gap-7 mb-7 grid-cols-[1fr_2fr] md:grid-cols-1">
            {/* Profile Card */}
            <div className="profile-card bg-white rounded-xl shadow-md p-7 text-center">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                alt="Profile"
                className="profile-image w-[150px] h-[150px] rounded-full object-cover border-4 border-[#E8F5E9] mx-auto mb-5"
              />
              <h2 className="profile-name text-teal-700 text-xl mb-1">{profile.fullName}</h2>
              <div className="profile-role text-gray-600 text-sm mb-5 py-1.5 px-4 rounded-full bg-[#E8F5E9] inline-block">
                [translate:Storage Employee]
              </div>
              <div className="profile-id text-gray-400 text-xs mb-5">ID: GRZ-EMP-7284</div>

              <div className="employee-stats flex flex-col gap-4 mt-4">
                <div className="stat-item flex justify-between p-4 bg-gray-100 rounded">
                  <span className="stat-label text-gray-600 text-sm">Tasks Completed</span>
                  <span className="stat-value text-teal-700 font-semibold">{workStats.tasksCompleted}</span>
                </div>
                <div className="stat-item flex justify-between p-4 bg-gray-100 rounded">
                  <span className="stat-label text-gray-600 text-sm">Work Hours</span>
                  <span className="stat-value text-teal-700 font-semibold">{workStats.workHours}</span>
                </div>
                <div className="stat-item flex justify-between p-4 bg-gray-100 rounded">
                  <span className="stat-label text-gray-600 text-sm">Productivity</span>
                  <span className="stat-value text-teal-700 font-semibold">{workStats.productivity}%</span>
                </div>
              </div>

              <div className="member-since bg-gray-100 p-4 rounded-lg mt-6">
                <h4 className="text-teal-700 mb-1 flex items-center gap-2">
                  <i className="fas fa-calendar-alt"></i> [translate:Member Since]
                </h4>
                <p>March 15, 2024</p>
              </div>
            </div>

            {/* Work Summary Card */}
            <div className="work-summary-card bg-white rounded-xl shadow-md p-7 mb-7">
              <h3 className="text-teal-700 mb-5 flex items-center gap-2 text-lg font-semibold">
                <i className="fas fa-chart-line"></i> [translate:Work Summary]
              </h3>
              <div className="summary-grid grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                <div className="summary-item bg-gray-100 p-5 rounded-lg border-l-4 border-teal-700 text-center">
                  <h4 className="text-gray-600 text-xs mb-1">[translate:This Week]</h4>
                  <p className="text-teal-700 font-semibold text-xl">{workStats.weeklyTasks} [translate:Tasks]</p>
                </div>
                <div className="summary-item bg-gray-100 p-5 rounded-lg border-l-4 border-teal-700 text-center">
                  <h4 className="text-gray-600 text-xs mb-1">[translate:This Month]</h4>
                  <p className="text-teal-700 font-semibold text-xl">{workStats.monthlyTasks} [translate:Tasks]</p>
                </div>
                <div className="summary-item bg-gray-100 p-5 rounded-lg border-l-4 border-teal-700 text-center">
                  <h4 className="text-gray-600 text-xs mb-1">[translate:Completion Rate]</h4>
                  <p className="text-teal-700 font-semibold text-xl">{workStats.completionRate}%</p>
                </div>
                <div className="summary-item bg-gray-100 p-5 rounded-lg border-l-4 border-teal-700 text-center">
                  <h4 className="text-gray-600 text-xs mb-1">[translate:Avg. Rating]</h4>
                  <p className="text-teal-700 font-semibold text-xl">{workStats.avgRating}/5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Silo Information */}
          <div className="silo-card bg-white rounded-xl shadow-md p-7 mb-7">
            <h3 className="text-teal-700 mb-5 flex items-center gap-2 text-lg font-semibold">
              <i className="fas fa-warehouse"></i> [translate:Assigned Storage Information]
            </h3>
            <div className="silo-details grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
              <div className="silo-detail-item bg-gray-100 p-5 rounded-lg border-l-4 border-teal-700">
                <h4 className="text-gray-600 text-xs mb-1">[translate:Silo ID]</h4>
                <p className="text-teal-700 font-semibold">SL-B-12</p>
              </div>
              <div className="silo-detail-item bg-gray-100 p-5 rounded-lg border-l-4 border-teal-700">
                <h4 className="text-gray-600 text-xs mb-1">[translate:Location]</h4>
                <p className="text-teal-700 font-semibold">Northern Facility</p>
              </div>
              <div className="silo-detail-item bg-gray-100 p-5 rounded-lg border-l-4 border-teal-700">
                <h4 className="text-gray-600 text-xs mb-1">[translate:Storage Capacity]</h4>
                <p className="text-teal-700 font-semibold">10,000 kg</p>
              </div>
              <div className="silo-detail-item bg-gray-100 p-5 rounded-lg border-l-4 border-teal-700">
                <h4 className="text-gray-600 text-xs mb-1">[translate:Current Utilization]</h4>
                <p className="text-teal-700 font-semibold">6,500 kg (65%)</p>
              </div>
            </div>
          </div>

          {/* Manager Information */}
          <div className="manager-card bg-white rounded-xl shadow-md p-7 mb-7">
            <h3 className="text-teal-700 mb-5 flex items-center gap-2 text-lg font-semibold">
              <i className="fas fa-user-tie"></i> [translate:My Manager]
            </h3>
            <div className="manager-info flex items-center gap-5 p-5 bg-gray-100 rounded-lg">
              <div className="manager-avatar w-20 h-20 rounded-full bg-teal-700 text-white flex items-center justify-center text-2xl font-bold">
                RK
              </div>
              <div className="manager-details">
                <h4 className="text-teal-800 mb-1">Rajesh Kumar</h4>
                <p className="text-gray-600 mb-2">[translate:Zone Manager - Northern Facility]</p>
                <p className="text-gray-800 flex items-center gap-2">
                  <i className="fas fa-phone text-teal-700"></i> +91 98765 43210
                </p>
                <button className="contact-manager bg-teal-700 text-white px-4 py-2 rounded mt-4 flex items-center gap-2 hover:bg-teal-800">
                  <i className="fas fa-envelope"></i> [translate:Send Message]
                </button>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="contact-card bg-white rounded-xl shadow-md p-7 mb-7">
            <h3 className="text-teal-700 mb-5 flex items-center gap-2 text-lg font-semibold">
              <i className="fas fa-address-card"></i> [translate:Contact Information]
            </h3>
            <div className="contact-info grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
              <div className="contact-item flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                <i className="fas fa-envelope text-teal-700 text-xl w-6"></i>
                <div className="contact-details">
                  <h4 className="text-gray-600 mb-1 text-sm">[translate:Email Address]</h4>
                  <p id="userEmail" className="text-gray-800 font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="contact-item flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                <i className="fas fa-phone text-teal-700 text-xl w-6"></i>
                <div className="contact-details">
                  <h4 className="text-gray-600 mb-1 text-sm">[translate:Phone Number]</h4>
                  <p id="userPhone" className="text-gray-800 font-medium">{profile.phone}</p>
                </div>
              </div>
              <div className="contact-item flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                <i className="fas fa-map-marker-alt text-teal-700 text-xl w-6"></i>
                <div className="contact-details">
                  <h4 className="text-gray-600 mb-1 text-sm">[translate:Address]</h4>
                  <p className="text-gray-800 font-medium">{profile.address}</p>
                </div>
              </div>
            </div>
            <button
              className="update-btn bg-teal-700 text-white px-6 py-3 rounded-md font-semibold flex items-center gap-2 mt-4 hover:bg-teal-900 transition"
              onClick={() => setModalOpen(true)}
            >
              <i className="fas fa-edit"></i> [translate:Update Profile Information]
            </button>
          </div>
        </section>
      </main>

      {/* Update Profile Modal */}
      {modalOpen && (
        <div
          className="modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={(e) => e.target.classList.contains("modal") && setModalOpen(false)}
        >
          <div className="modal-content bg-white rounded-xl p-8 shadow-lg max-w-md w-full">
            <div className="modal-header flex justify-between items-center mb-5">
              <h3 className="text-teal-700 text-xl font-semibold flex items-center gap-2">
                <i className="fas fa-edit"></i> [translate:Update Profile Information]
              </h3>
              <button
                className="close-modal text-gray-600 text-3xl font-bold cursor-pointer hover:text-gray-900"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="form-group">
                <label htmlFor="fullName" className="block mb-2 font-semibold text-gray-700">
                  [translate:Full Name]
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName || formData.fullName === undefined ? formData.fullName : formData.fullName || profile.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
                  [translate:Email Address]
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="block mb-2 font-semibold text-gray-700">
                  [translate:Phone Number]
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div className="form-group">
                <label htmlFor="address" className="block mb-2 font-semibold text-gray-700">
                  [translate:Address]
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div className="modal-actions flex gap-4 justify-end">
                <button
                  type="submit"
                  className="btn-primary bg-teal-700 hover:bg-teal-900 text-white px-6 py-3 rounded-md font-semibold flex items-center gap-3"
                >
                  <i className="fas fa-save"></i> [translate:Save Changes]
                </button>
                <button
                  type="button"
                  className="btn-secondary bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-md font-semibold"
                  onClick={() => setModalOpen(false)}
                >
                  [translate:Cancel]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-teal-900 text-white text-center p-3 text-sm mt-auto w-full">
        &copy; 2025 GrainZillow — [translate:Smart Grain Storage Monitoring System]
      </footer>
    </>
  );
}
