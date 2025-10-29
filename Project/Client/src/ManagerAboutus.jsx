import React, { useState } from "react";

export default function AboutUs() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);

  const teamMembers = [
    {
      name: "Talluri Jaswanth",
      role: "Backend Developer",
      responsibility: "Hardware, Database, IoT logic",
    },
    {
      name: "Vuddanti Dhana Sekhar",
      role: "Documentation Specialist",
      responsibility: "SRS, technical reports, and presentation materials",
    },
    {
      name: "Talari Hima Sai",
      role: "Hardware Support",
      responsibility: "Design, circuit connections, and hardware testing",
    },
    {
      name: "Syed Ameer Basha",
      role: "Frontend Developer",
      responsibility: "Web Interface, Dashboard UI",
    },
    {
      name: "Boddu Akhil",
      role: "Research Analyst",
      responsibility: "Data collection, analysis, and system testing",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f2fdfb] to-[#e6f4f1] text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between h-[70px] bg-gradient-to-r from-teal-700 to-teal-900 text-white px-6 shadow-md z-50">
        <button
          onClick={toggleSidebar}
          className="text-2xl focus:outline-none"
          aria-label="Toggle Sidebar"
        >
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

      {/* Sidebar */}
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
            { icon: "fas fa-user", label: "My Profile" },
            { icon: "fas fa-info-circle", label: "About Us", active: true },
            { icon: "fas fa-question-circle", label: "FAQs" },
            { icon: "fas fa-phone", label: "Contact Us" },
          ].map(({ icon, label, active }) => (
            <li key={label}>
              <a
                href="#"
                className={`flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:bg-teal-100 hover:text-teal-900 transition ${
                  active
                    ? "bg-teal-100 border-teal-700 text-teal-900 font-semibold"
                    : ""
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

      {/* Main Content */}
      <main
        className={`flex-1 pt-[70px] px-10 pb-8 transition-all duration-300 ${
          sidebarExpanded ? "ml-56" : "ml-16"
        } flex flex-col items-center max-w-7xl mx-auto`}
      >
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 w-full text-center mb-10">
          <h1 className="text-teal-700 text-3xl font-bold mb-2">About GrainZillow</h1>
          <p>Learn about our mission to revolutionize grain storage through smart IoT technology</p>
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 w-full">
          <h3 className="flex items-center gap-3 text-teal-700 text-xl font-semibold mb-4">
            <i className="fas fa-bullseye"></i> Project Overview
          </h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            <strong>GrainZillow</strong> is a smart IoT-based grain storage monitoring system designed to ensure safe and efficient grain management in silos. It continuously monitors temperature, humidity, and gas levels to detect early signs of spoilage or combustion, alerting warehouse managers in real-time.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our system provides a comprehensive solution for agricultural storage facilities, combining cutting-edge sensor technology with an intuitive web interface for complete control and monitoring capabilities.
          </p>
        </div>

        {/* Problem Statement */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 w-full">
          <h3 className="flex items-center gap-3 text-teal-700 text-xl font-semibold mb-4">
            <i className="fas fa-exclamation-triangle"></i> Problem Statement
          </h3>
          <p className="mb-4 text-gray-700 leading-relaxed">
            In many rural and industrial storage facilities, grains often get damaged due to improper temperature, humidity, and gas accumulation. Manual monitoring is inefficient, delayed, and sometimes impossible. Traditional methods lack real-time alerts and remote access capabilities.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>GrainZillow solves this</strong> by introducing automation and smart sensing for safer storage environments, preventing significant economic losses and ensuring food security through continuous, reliable monitoring.
          </p>
        </div>

        {/* Key Features */}
        <h2 className="section-title flex items-center gap-3 text-teal-700 text-2xl mb-6">
          <i className="fas fa-star"></i> Key Features
        </h2>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: "fas fa-chart-line",
              title: "Real-time Monitoring",
              description:
                "Continuous tracking of temperature, humidity, and gas levels (MQ2 & MQ135 sensors)",
            },
            {
              icon: "fas fa-bell",
              title: "Smart Alerts",
              description: "Instant notifications for unsafe conditions and potential hazards",
            },
            {
              icon: "fas fa-fan",
              title: "Remote Control",
              description: "Web-based fan control and environmental management",
            },
            {
              icon: "fas fa-tachometer-alt",
              title: "Visual Dashboard",
              description: "Intuitive interface with real-time data visualization",
            },
            {
              icon: "fas fa-shield-alt",
              title: "Secure Access",
              description: "User authentication with silo-specific data protection",
            },
            {
              icon: "fas fa-brain",
              title: "AI Ready",
              description: "Future integration with AI for predictive maintenance",
            },
          ].map(({ icon, title, description }) => (
            <div key={title} className="bg-gray-100 rounded-lg p-6 border border-green-100 text-center">
              <i className={`${icon} text-teal-700 text-3xl mb-4`}></i>
              <h4 className="text-teal-700 text-lg font-semibold mb-2">{title}</h4>
              <p className="text-gray-700 text-sm">{description}</p>
            </div>
          ))}
        </div>

        {/* Vision & Mission */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 w-full">
          <h3 className="flex items-center gap-3 text-teal-700 text-xl font-semibold mb-4">
            <i className="fas fa-eye"></i> Our Vision
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            To revolutionize agricultural storage safety using intelligent automation and data-driven insights — ensuring zero grain loss and improved food security across global agricultural supply chains.
          </p>
          <h3 className="flex items-center gap-3 text-teal-700 text-xl font-semibold mb-4">
            <i className="fas fa-bullseye"></i> Our Mission
          </h3>
          <p className="text-gray-700 leading-relaxed">
            To provide an affordable and scalable IoT-based solution for farmers and warehouse managers that enables continuous monitoring, control, and optimization of grain storage systems, making advanced technology accessible to all stakeholders in the agricultural ecosystem.
          </p>
        </div>

        {/* Our Team */}
        <h2 className="section-title flex items-center gap-3 text-teal-700 text-2xl mb-6">
          <i className="fas fa-users"></i> Our Team
        </h2>
        <div className="bg-white rounded-xl shadow-md p-6 w-full mb-10">
          <p className="mb-6 text-gray-700">Meet the dedicated team behind GrainZillow's development and success:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teamMembers.map(({ name, role, responsibility }) => (
              <div key={name} className="bg-gray-100 rounded-lg p-5 border-l-4 border-teal-700">
                <h4 className="text-teal-700 font-semibold mb-2">{name}</h4>
                <div className="text-gray-600 font-semibold mb-2">{role}</div>
                <div className="text-gray-700 text-sm">{responsibility}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Future Scope */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 w-full">
          <h3 className="flex items-center gap-3 text-teal-700 text-xl font-semibold mb-4">
            <i className="fas fa-rocket"></i> Future Scope
          </h3>
          <p className="text-gray-700 mb-4">We're continuously working to enhance GrainZillow with advanced features:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>AI Predictive Maintenance:</strong> Machine learning models to detect patterns before faults occur</li>
            <li><strong>Mobile Application:</strong> Companion app for remote silo management on-the-go</li>
            <li><strong>Cloud Analytics:</strong> Advanced dashboard for multi-silo management and analytics</li>
            <li><strong>Enhanced Alerts:</strong> GSM/Email notifications for critical conditions</li>
            <li><strong>Multi-language Support:</strong> Interface localization for global users</li>
            <li><strong>Blockchain Integration:</strong> Secure transaction tracking for grain storage and distribution</li>
          </ul>
        </div>

        {/* Institution & Guidance */}
        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 w-full">
          <h3 className="text-green-800 text-xl font-semibold mb-4 flex items-center gap-3">
            <i className="fas fa-graduation-cap"></i> Institution & Guidance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded p-4 shadow">
              <h4 className="text-teal-700 font-semibold mb-2">Institution</h4>
              <p>Vellore Institute of Technology, Amaravati (VIT-AP)</p>
            </div>
            <div className="bg-white rounded p-4 shadow">
              <h4 className="text-teal-700 font-semibold mb-2">Mentor</h4>
              <p>Yohoshiva Basaraboyina</p>
            </div>
            <div className="bg-white rounded p-4 shadow">
              <h4 className="text-teal-700 font-semibold mb-2">Program</h4>
              <p>Principles of Software Engineering</p>
            </div>
            <div className="bg-white rounded p-4 shadow">
              <h4 className="text-teal-700 font-semibold mb-2">Project Module</h4>
              <p>Academic Research Project</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-teal-900 text-white text-center py-3 mt-auto w-full">
        © 2025 GrainZillow — Smart Grain Storage Monitoring System
      </footer>
    </div>
  );
}
