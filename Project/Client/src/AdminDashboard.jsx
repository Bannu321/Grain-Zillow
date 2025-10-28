import React, { useState } from "react";
import { Link } from "react-router-dom";

const sidebarLinks = [
  { to: "/", text: "Dashboard", icon: "fa-home" },
  { to: "/silo-list", text: "Silo List", icon: "fa-list" },
  { to: "/silo-management", text: "Silo Management", icon: "fa-warehouse" },
  { to: "/grains-inventory", text: "Grains Inventory", icon: "fa-seedling" },
  { to: "/managers-management", text: "Managers Management", icon: "fa-user-tie" },
  { to: "/employee-management", text: "Employee Management", icon: "fa-users" },
  { to: "/contact-management", text: "Contact Management", icon: "fa-address-book" },
  { to: "/message-centre", text: "Message Centre", icon: "fa-envelope" },
  { to: "/my-profile", text: "My Profile", icon: "fa-user" },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-poppins bg-gradient-to-br from-[#e0f7f5] to-[#f2fdfb] text-[#333]">
      {/* HEADER */}
      <header className="fixed w-full top-0 left-0 z-20 h-[70px] flex items-center justify-between px-6 bg-gradient-to-tr from-teal-600 to-teal-800 text-white shadow-md">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="text-2xl focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-ellipsis-v"></i>
        </button>
        <div className="flex items-center gap-3 text-lg">
          <i className="fas fa-seedling text-yellow-300 text-2xl"></i>
          <h1 className="font-semibold text-base md:text-lg lg:text-xl">
            GrainZillow - Admin Dashboard
          </h1>
        </div>
        <button className="bg-white text-teal-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-100 transition">
          Logout
        </button>
      </header>

      {/* SIDEBAR */}
      <nav
        className={`fixed top-0 left-0 z-10 bg-white min-h-screen pt-20 shadow-md transition-all duration-300 ${
          sidebarOpen ? "w-56" : "w-[70px]"
        }`}
      >
        <ul className="flex flex-col">
          {sidebarLinks.map(({ to, text, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center py-3 px-5 gap-3 hover:bg-[#e0f7f5] border-l-4 border-transparent text-base transition ${
                  window.location.pathname === to
                    ? "bg-[#e0f7f5] border-l-4 border-teal-700 text-teal-900"
                    : "text-gray-700"
                }`}
              >
                <i className={`fas ${icon} w-[22px] text-[18px]`}></i>
                <span
                  className={`transition-opacity duration-300 ${
                    sidebarOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* MAIN */}
      <main
        className={`flex-1 transition-all duration-300 pt-24 pb-6 px-4 md:px-10 ${
          sidebarOpen ? "ml-56" : "ml-[70px]"
        }`}
      >
        {/* Welcome Card */}
        <div className="bg-white rounded-[10px] shadow p-6 text-center mb-7">
          <h1 className="text-xl font-semibold text-teal-700 mb-2">Welcome, Admin</h1>
          <p className="text-gray-500">Overview of GrainZillow system performance and metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-7">
          <StatCard icon="fa-warehouse" bgFrom="from-teal-500" bgTo="to-teal-800" value="24" label="Total Silos" trend="+2 this month" trendClass="text-green-600" />
          <StatCard icon="fa-user-tie" bgFrom="from-teal-500" bgTo="to-teal-800" value="8" label="Total Managers" trend="+1 this month" trendClass="text-green-600" />
          <StatCard icon="fa-users" bgFrom="from-green-600" bgTo="to-green-800" value="42" label="Total Employees" trend="+3 this month" trendClass="text-green-600" />
          <StatCard icon="fa-microchip" bgFrom="from-orange-500" bgTo="to-orange-800" value="96" label="Active Devices" trend="2 offline" trendClass="text-red-500" />
          <StatCard icon="fa-exclamation-triangle" bgFrom="from-red-500" bgTo="to-red-800" value="3" label="Current Alerts" trend="From 5 yesterday" trendClass="text-red-500" />
          <StatCard icon="fa-thermometer-half" bgFrom="from-pink-500" bgTo="to-pink-900" value="28.5°C" label="Avg Temperature" trend="Across all silos" trendClass="text-gray-600" />
          <StatCard icon="fa-tint" bgFrom="from-purple-500" bgTo="to-purple-900" value="65%" label="Avg Humidity" trend="Within safe range" trendClass="text-gray-600" />
        </div>

        {/* Recent Alerts Section */}
        <div className="bg-white rounded-[10px] p-5 shadow mb-8">
          <h3 className="text-[#004D40] mb-4 text-lg flex items-center gap-2">
            <i className="fas fa-bell"></i> Recent Alerts
          </h3>
          <AlertItem
            icon="fa-exclamation-triangle"
            bgColor="bg-red-500"
            title="High Temperature Alert - Silo B3"
            description="Temperature reached 42°C, exceeding safety threshold"
            time="10:30 AM • Today"
          />
          <AlertItem
            icon="fa-exclamation-circle"
            bgColor="bg-yellow-500"
            title="Device Offline - MQ135 Sensor"
            description="Gas sensor in Silo C2 not responding"
            time="Yesterday • 3:15 PM"
            warning
          />
          <AlertItem
            icon="fa-exclamation-triangle"
            bgColor="bg-red-500"
            title="Humidity Spike - Silo A1"
            description="Humidity levels increased to 85% in last hour"
            time="Oct 25 • 2:45 PM"
          />
        </div>

        {/* Footer */}
        <footer className="bg-[#004D40] text-white text-center py-3 text-sm rounded-t-lg">
          © 2025 GrainZillow | Smart Grain Storage Monitoring System
        </footer>
      </main>
    </div>
  );
}

const StatCard = ({ icon, bgFrom, bgTo, value, label, trend, trendClass }) => (
  <div className="bg-white rounded-[10px] p-5 flex items-center gap-5 shadow hover:-translate-y-1 transition">
    <div className={`w-[60px] h-[60px] flex items-center justify-center rounded-[12px] bg-gradient-to-br ${bgFrom} ${bgTo} text-white text-2xl`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="flex-1">
      <div className="text-2xl font-bold text-[#004D40] mb-1">{value}</div>
      <div className="text-gray-500 text-xs">{label}</div>
      <div className={`text-xs mt-1 ${trendClass}`}>{trend}</div>
    </div>
  </div>
);

const AlertItem = ({ icon, bgColor, title, description, time, warning = false }) => (
  <div className={`flex items-center p-3 rounded-md border-l-4 ${warning ? "border-yellow-500 bg-yellow-50" : "border-red-500 bg-red-50"} mb-3`}>
    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${bgColor} text-white mr-4 text-lg`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="flex-1">
      <div className="font-semibold text-[#004D40] mb-1">{title}</div>
      <div className="text-gray-600 text-sm">{description}</div>
      <div className="text-xs text-gray-400">{time}</div>
    </div>
  </div>
);
