import { useState } from 'react';

export default function AdminProfile() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@grainszillow.com',
    phone: '+91 98765 43210',
    department: 'System Administration',
  });

  // Handlers
  const toggleSidebar = () => setSidebarExpanded((prev) => !prev);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile information updated successfully!');
    closeModal();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[70px] bg-gradient-to-br from-teal-600 to-teal-900 text-white flex items-center justify-between px-6 shadow-md z-[1000]">
        <button className="toggle-sidebar bg-none border-none text-white text-lg cursor-pointer" onClick={toggleSidebar} aria-label="Toggle Sidebar">
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
        id="sidebar"
        className={`sidebar fixed top-0 left-0 bg-white h-screen pt-[90px] shadow-md overflow-x-hidden transition-width duration-300 z-[999] ${
          sidebarExpanded ? 'expanded w-[230px]' : 'w-[70px]'
        }`}
      >
        <ul className="list-none p-0 m-0">
          {[
            { icon: 'fa-home', label: 'Dashboard' },
            { icon: 'fa-list', label: 'Silo List' },
            { icon: 'fa-warehouse', label: 'Silo Management' },
            { icon: 'fa-seedling', label: 'Grains Inventory' },
            { icon: 'fa-user-tie', label: 'Managers Management' },
            { icon: 'fa-users', label: 'Employee Management' },
            { icon: 'fa-address-book', label: 'Contact Management' },
            { icon: 'fa-envelope', label: 'Message Centre' },
            { icon: 'fa-user', label: 'My Profile', active: true },
          ].map(({ icon, label, active }) => (
            <li key={label}>
              <a
                href="#"
                className={`flex items-center px-5 py-3 gap-4 text-gray-800 no-underline border-l-4 border-transparent transition-all ${
                  active ? 'bg-[#e0f7f5] border-l-teal-700 text-teal-900' : 'hover:bg-[#e0f7f5] hover:border-l-teal-700 hover:text-teal-900'
                }`}
              >
                <i className={`fas ${icon} w-5 text-center text-lg`}></i>
                <span
                  className={`sidebar-span transition-opacity duration-300 ${
                    sidebarExpanded ? 'opacity-100' : 'opacity-0'
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
        id="content"
        className={`flex-1 transition-margin duration-300 flex flex-col items-center pt-[90px] px-10 pb-5 ${
          sidebarExpanded ? 'ml-[230px]' : 'ml-[70px]'
        }`}
      >
        <div className="welcome bg-white p-5 rounded-lg shadow-md mb-7 text-center w-full max-w-[1200px]">
          <h1 className="text-teal-700 text-2xl mb-2.5">Admin Profile</h1>
          <p>Manage your account and view system overview</p>
        </div>

        <div className="profile-section w-full max-w-[1200px]">
          <div className="profile-container grid gap-7 mb-7 grid-cols-[1fr_2fr] md:grid-cols-1">
            {/* Profile Card */}
            <div className="profile-card bg-white rounded-xl shadow-md p-7 text-center">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
                alt="Profile Picture"
                className="profile-image w-[150px] h-[150px] rounded-full object-cover border-4 border-[#E8F5E9] mx-auto mb-5"
              />
              <h2 className="profile-name text-teal-700 text-xl mb-1">{profile.fullName}</h2>
              <div className="profile-role text-gray-600 text-sm mb-5 py-1.5 px-4 rounded-full bg-[#E8F5E9] inline-block">
                System Administrator
              </div>
              <div className="profile-id text-gray-400 text-xs mb-5">ID: GRZ-ADMIN-001</div>

              <div className="member-since bg-gray-100 p-4 rounded-lg mt-5">
                <h4 className="text-teal-700 mb-1 flex items-center gap-2">
                  <i className="fas fa-calendar-alt"></i> Member Since
                </h4>
                <p>March 10, 2023</p>
              </div>

              <div className="member-since bg-gray-100 p-4 rounded-lg mt-4">
                <h4 className="text-teal-700 mb-1 flex items-center gap-2">
                  <i className="fas fa-shield-alt"></i> Admin Level
                </h4>
                <p>Super Administrator</p>
              </div>
            </div>

            {/* Admin Stats Card */}
            <div className="stats-card bg-white rounded-xl shadow-md p-7 mb-7">
              <h3 className="text-teal-700 mb-5 flex items-center gap-2">
                <i className="fas fa-chart-line"></i> System Overview
              </h3>
              <div className="stats-grid grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                <div className="stat-item bg-gray-100 p-5 rounded-lg border-l-4 border-teal-700 text-center">
                  <h4 className="text-gray-600 mb-2 text-xs">Total Users</h4>
                  <div className="stat-value text-teal-700 font-semibold text-2xl mb-1">47</div>
                  <div className="stat-change text-green-600 text-xs">+5 this month</div>
                </div>
                <div className="stat-item bg-gray-100 p-5 rounded-lg border-l-4 border-teal-700 text-center">
                  <h4 className="text-gray-600 mb-2 text-xs">Active Silos</h4>
                  <div className="stat-value text-teal-700 font-semibold text-2xl mb-1">18</div>
                  <div className="stat-change text-teal-700 text-xs">100% operational</div>
                </div>
                <div className="stat-item bg-gray-100 p-5 rounded-lg border-l-4 border-teal-700 text-center">
                  <h4 className="text-gray-600 mb-2 text-xs">Alerts Today</h4>
                  <div className="stat-value text-teal-700 font-semibold text-2xl mb-1">3</div>
                  <div className="stat-change text-red-600 text-xs">+2 from yesterday</div>
                </div>
                <div className="stat-item bg-gray-100 p-5 rounded-lg border-l-4 border-teal-700 text-center">
                  <h4 className="text-gray-600 mb-2 text-xs">System Uptime</h4>
                  <div className="stat-value text-teal-700 font-semibold text-2xl mb-1">99.8%</div>
                  <div className="stat-change text-teal-700 text-xs">Last 30 days</div>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="system-card bg-white rounded-xl shadow-md p-7 mb-7">
            <h3 className="text-teal-700 mb-5 flex items-center gap-2">
              <i className="fas fa-info-circle"></i> System Information
            </h3>
            <div className="system-details grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
              {[
                { icon: 'fa-database', title: 'Database Status', value: 'Online', statusClass: 'text-green-600 font-semibold' },
                { icon: 'fa-microchip', title: 'IoT Devices', value: '54 Connected' },
                { icon: 'fa-server', title: 'Server Load', value: '24%' },
                { icon: 'fa-shield-alt', title: 'Security Level', value: 'High' },
              ].map(({ icon, title, value, statusClass }) => (
                <div key={title} className="system-item flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                  <i className={`fas ${icon} text-teal-700 text-xl w-6`}></i>
                  <div className="system-details">
                    <h4 className="text-gray-600 mb-1 text-xs">{title}</h4>
                    <p className={`${statusClass ? statusClass : 'text-gray-800 font-medium'}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="contact-card bg-white rounded-xl shadow-md p-7">
            <h3 className="text-teal-700 mb-5 flex items-center gap-2">
              <i className="fas fa-address-card"></i> Contact Information
            </h3>
            <div className="contact-info grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 mb-6">
              <div className="contact-item flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                <i className="fas fa-envelope text-teal-700 text-xl w-6"></i>
                <div className="contact-details">
                  <h4 className="text-gray-600 mb-1 text-xs">Email Address</h4>
                  <p id="userEmail" className="text-gray-800 font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="contact-item flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                <i className="fas fa-phone text-teal-700 text-xl w-6"></i>
                <div className="contact-details">
                  <h4 className="text-gray-600 mb-1 text-xs">Phone Number</h4>
                  <p id="userPhone" className="text-gray-800 font-medium">{profile.phone}</p>
                </div>
              </div>
              <div className="contact-item flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                <i className="fas fa-map-marker-alt text-teal-700 text-xl w-6"></i>
                <div className="contact-details">
                  <h4 className="text-gray-600 mb-1 text-xs">Office Location</h4>
                  <p className="text-gray-800 font-medium">Headquarters, VIT-AP University</p>
                </div>
              </div>
              <div className="contact-item flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                <i className="fas fa-clock text-teal-700 text-xl w-6"></i>
                <div className="contact-details">
                  <h4 className="text-gray-600 mb-1 text-xs">Office Hours</h4>
                  <p className="text-gray-800 font-medium">Mon-Fri, 8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
            <button
              className="update-btn bg-teal-700 text-white px-6 py-3 rounded-md font-semibold flex items-center gap-2 mt-2 hover:bg-teal-900 transition-all"
              onClick={openModal}
            >
              <i className="fas fa-edit"></i> Update Profile Information
            </button>
          </div>
        </div>
      </main>

      {/* Update Profile Modal */}
      {modalOpen && (
        <div
          className="modal fixed inset-0 bg-black bg-opacity-50 z-[1001] flex items-center justify-center"
          onClick={(e) => {
            if (e.target.classList.contains('modal')) closeModal();
          }}
        >
          <div className="modal-content bg-white rounded-xl p-8 shadow-xl w-full max-w-md">
            <div className="modal-header flex justify-between items-center mb-5">
              <h3 className="text-teal-700 m-0 flex items-center gap-2 text-lg">
                <i className="fas fa-edit"></i> Update Profile Information
              </h3>
              <button className="close-modal bg-none border-none text-2xl cursor-pointer text-gray-500" onClick={closeModal} aria-label="Close Modal">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} id="profileForm">
              <div className="form-group mb-5">
                <label htmlFor="fullName" className="block mb-2 font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={profile.fullName}
                  onChange={handleFormChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md text-sm transition-border duration-300 focus:border-teal-700 focus:outline-none"
                />
              </div>
              <div className="form-group mb-5">
                <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  onChange={handleFormChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md text-sm transition-border duration-300 focus:border-teal-700 focus:outline-none"
                />
              </div>
              <div className="form-group mb-5">
                <label htmlFor="phone" className="block mb-2 font-semibold text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={profile.phone}
                  onChange={handleFormChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md text-sm transition-border duration-300 focus:border-teal-700 focus:outline-none"
                />
              </div>
              <div className="form-group mb-5">
                <label htmlFor="department" className="block mb-2 font-semibold text-gray-700">Department</label>
                <select
                  id="department"
                  value={profile.department}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm transition-border duration-300 focus:border-teal-700 focus:outline-none"
                >
                  <option>System Administration</option>
                  <option>Operations</option>
                  <option>Technical Support</option>
                  <option>Management</option>
                </select>
              </div>
              <div className="modal-actions flex gap-4 mt-6">
                <button type="submit" className="btn btn-primary bg-teal-700 text-white px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:bg-teal-900 transition-all">
                  <i className="fas fa-save"></i> Save Changes
                </button>
                <button type="button" className="btn btn-secondary bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-all" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-teal-900 text-white text-center p-3 text-sm mt-auto w-full">
        © 2025 GrainZillow — Smart Grain Storage Monitoring System
      </footer>
    </>
  );
}
