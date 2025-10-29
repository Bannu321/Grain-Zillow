import React, { useState } from "react";

const faqs = [
  {
    question: "What is GrainZillow?",
    icon: "fas fa-seedling",
    answer: (
      <>
        <p>
          <strong>GrainZillow</strong> is a smart IoT-based grain storage monitoring system that
          tracks temperature, humidity, and gas levels inside silos and provides real-time alerts and control features.
          It's designed to prevent grain spoilage and ensure optimal storage conditions through continuous monitoring and automated responses.
        </p>
      </>
    ),
  },
  {
    question: "How does the system work?",
    icon: "fas fa-cogs",
    answer: (
      <p>
        The system uses <strong>sensors like DHT11, MQ2, and MQ135</strong> to collect environmental data inside
        the silo. Data is sent to an <strong>ESP32 microcontroller</strong>, which processes it and updates readings on the web dashboard
        via a cloud database. Users can monitor conditions in real-time and control ventilation systems remotely.
      </p>
    ),
  },
  {
    question: "What happens if the levels exceed safety limits?",
    icon: "fas fa-exclamation-triangle",
    answer: (
      <p>
        When any reading crosses safe thresholds, the dashboard immediately shows a <strong>red warning (DANGER)</strong> indicator.
        The system can automatically or manually activate fans to stabilize conditions and prevent spoilage or combustion.
        Critical alerts are prominently displayed to ensure immediate attention.
      </p>
    ),
  },
  {
    question: "Can the system be controlled remotely?",
    icon: "fas fa-globe",
    answer: (
      <p>
        <strong>Yes, absolutely!</strong> The fan can be turned on or off through the web interface from anywhere with internet.
        This allows full remote grain storage monitoring and management.
      </p>
    ),
  },
  {
    question: "Who can access the data?",
    icon: "fas fa-user-shield",
    answer: (
      <p>
        Each user has a <strong>unique User ID</strong>, permitting access only to their assigned silo’s data.
        Proper authentication and authorization protect privacy, and admins can manage multiple users and access rights.
      </p>
    ),
  },
  {
    question: "Does the system store historical data?",
    icon: "fas fa-database",
    answer: (
      <>
        <p>
          <strong>Yes, comprehensive historical data storage is included.</strong> All sensor readings and control actions
          are stored and accessible. Users can view trends, analyze storage conditions over time, and optimize for better safety.
        </p>
      </>
    ),
  },
  {
    question: "How do alerts and notifications work?",
    icon: "fas fa-bell",
    answer: (
      <p>
        Unsafe gas, humidity, or temperature levels trigger immediate red highlights on the dashboard.
        Notifications are sent via the web interface, with plans to add email and SMS alerts in future updates.
      </p>
    ),
  },
  {
    question: "What technologies are used in GrainZillow?",
    icon: "fas fa-microchip",
    answer: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Hardware:</strong> ESP32 microcontroller, DHT11 (temp/humidity), MQ2 & MQ135 (gas sensors)
        </li>
        <li><strong>Backend:</strong> Firebase/Cloud database</li>
        <li><strong>Frontend:</strong> Web dashboard with HTML, CSS, JS</li>
        <li><strong>Connectivity:</strong> Wi-Fi for data transmission</li>
      </ul>
    ),
  },
  {
    question: "Can the project be expanded in the future?",
    icon: "fas fa-rocket",
    answer: (
      <ul className="list-disc pl-5 space-y-1">
        <li>AI predictive maintenance</li>
        <li>Multi-silo management</li>
        <li>Automated machine learning control systems</li>
        <li>Mobile monitoring app</li>
        <li>Integration with weather and market data</li>
        <li>Advanced analytics</li>
      </ul>
    ),
  },
  {
    question: "Who developed GrainZillow?",
    icon: "fas fa-users",
    answer: (
      <p>
        <strong>Developed by a 5-member team</strong> at VIT-AP University with hardware and software expertise,
        under expert mentorship to address real-world grain storage challenges.
      </p>
    ),
  },
];

export default function FAQs() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleSidebar = () => setSidebarExpanded(prev => !prev);

  const toggleFAQ = (index) => {
    setActiveIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f2fdfb] to-[#e6f4f1] font-[Poppins] text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between h-[70px] bg-gradient-to-r from-teal-700 to-teal-900 text-white px-6 shadow-lg z-50">
        <button onClick={toggleSidebar} className="text-2xl focus:outline-none" aria-label="Toggle Sidebar">
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
      <nav className={`fixed top-0 left-0 h-full bg-white shadow-lg pt-[70px] transition-all duration-300 z-40 overflow-hidden ${sidebarExpanded ? "w-56" : "w-16"}`}>
        <ul className="flex flex-col text-gray-700">
          {[
            { icon: "fas fa-home", label: "Dashboard" },
            { icon: "fas fa-users", label: "Employee Management" },
            { icon: "fas fa-tasks", label: "Task Assignment" },
            { icon: "fas fa-comments", label: "Message Centre" },
            { icon: "fas fa-history", label: "History Logs" },
            { icon: "fas fa-pen", label: "Manual Grain Entry" },
            { icon: "fas fa-user", label: "My Profile" },
            { icon: "fas fa-info-circle", label: "About Us" },
            { icon: "fas fa-question-circle", label: "FAQs", active: true },
            { icon: "fas fa-phone", label: "Contact Us" },
          ].map(({ icon, label, active }, idx) => (
            <li key={label}>
              <a href="#"
                 className={`flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:bg-teal-100 hover:text-teal-900 transition ${
                   active ? "bg-teal-100 border-teal-700 text-teal-900 font-semibold" : ""
                 }`}>
                <i className={`${icon} w-6 text-center`}></i>
                <span className={`whitespace-nowrap transition-opacity ${sidebarExpanded ? "opacity-100" : "opacity-0"}`}>
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className={`pt-[70px] px-10 pb-8 transition-all duration-300 flex-grow ${sidebarExpanded ? "ml-56" : "ml-16"} flex flex-col items-center`}>
        <div className="welcome bg-white rounded-lg shadow-md p-5 w-full max-w-4xl mb-10 text-center">
          <h1 className="text-teal-700 text-3xl font-bold mb-2">Frequently Asked Questions</h1>
          <p>Find answers to common questions about GrainZillow</p>
        </div>

        <div className="faq-section max-w-4xl w-full">
          <div className="faq-intro bg-white rounded-lg shadow-lg p-7 mb-10 text-center">
            <h2 className="text-teal-700 text-2xl font-semibold flex items-center justify-center gap-3 mb-4">
              <i className="fas fa-question-circle"></i> Need Help?
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Browse through our frequently asked questions to learn more about how GrainZillow works, its features, and how it can help you manage grain storage effectively.
            </p>
          </div>

          <div className="faq-container bg-white rounded-lg shadow-lg p-7">
            {faqs.map(({ question, icon, answer }, idx) => (
              <div
                key={idx}
                className={`faq-item border-b border-gray-200 py-5 transition-colors ${activeIndex === idx ? "bg-gray-100 rounded-md" : ""}`}
              >
                <div
                  className="faq-question flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFAQ(idx)}
                >
                  <h3 className="text-teal-700 text-lg flex items-center gap-3 m-0">
                    <i className={icon}></i> {question}
                  </h3>
                  <i
                    className={`fas fa-chevron-down faq-icon text-teal-700 text-xl transform transition-transform duration-300 ${
                      activeIndex === idx ? "rotate-180" : ""
                    }`}
                  ></i>
                </div>
                <div
                  className="faq-answer overflow-hidden transition-max-height duration-300 ease-in-out"
                  style={{ maxHeight: activeIndex === idx ? "500px" : "0px" }}
                >
                  <div className="mt-4 text-gray-700 leading-relaxed">{answer}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-support bg-gradient-to-tr from-green-100 to-green-200 rounded-lg p-8 mt-10 text-center">
            <h3 className="text-green-800 text-xl font-semibold mb-4 flex items-center justify-center gap-3">
              <i className="fas fa-headset"></i> Still Have Questions?
            </h3>
            <p className="text-gray-700 mb-6">
              Can't find the answer you're looking for? Our support team is here to help you with any additional questions or technical support needs.
            </p>
            <button
              onClick={() => alert('Contact support clicked!')}
              className="bg-teal-700 hover:bg-teal-900 text-white font-semibold rounded-md px-6 py-3 inline-flex items-center gap-3"
            >
              <i className="fas fa-phone"></i> Contact Support
            </button>
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
