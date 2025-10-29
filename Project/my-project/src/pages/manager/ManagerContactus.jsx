import React, { useState } from "react";

export default function ContactUs() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const toggleSidebar = () => setSidebarExpanded(prev => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message sent!\nName: ${formData.name}\nEmail: ${formData.email}\nMessage:\n${formData.message}`);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f2fdfb] to-[#e6f4f1] font-[Poppins] text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between h-[70px] bg-gradient-to-r from-teal-700 to-teal-900 text-white px-6 shadow-lg z-50">
        <button onClick={toggleSidebar} aria-label="Toggle Sidebar" className="text-2xl focus:outline-none">
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
            { icon: "fas fa-info-circle", label: "About Us" },
            { icon: "fas fa-question-circle", label: "FAQs" },
            { icon: "fas fa-phone", label: "Contact Us", active: true },
          ].map(({ icon, label, active }) => (
            <li key={label}>
              <a
                href="#"
                className={`flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:bg-teal-100 hover:text-teal-900 transition ${
                  active ? "bg-teal-100 border-teal-700 text-teal-900 font-semibold" : ""
                }`}
              >
                <i className={`${icon} w-6 text-center`}></i>
                <span className={`${sidebarExpanded ? "opacity-100" : "opacity-0"} transition-opacity whitespace-nowrap`}>
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main
        className={`pt-[70px] px-6 md:px-10 pb-8 transition-all duration-300 flex-grow ${sidebarExpanded ? "ml-56" : "ml-16"} flex flex-col items-center`}
      >
        <div className="welcome bg-white rounded-lg shadow p-6 w-full max-w-3xl mb-8 text-center">
          <h1 className="text-teal-700 text-3xl font-bold mb-2">Contact Us</h1>
          <p>Get in touch with the GrainZillow team</p>
        </div>

        <div className="contact-section w-full max-w-3xl space-y-8">
          {/* Contact Information */}
          <div className="contact-card bg-white rounded-lg shadow p-8">
            <h2 className="contact-title flex items-center gap-3 text-teal-700 text-xl font-semibold mb-6">
              <i className="fas fa-phone"></i> Contact Information
            </h2>
            {[
              { icon: "fas fa-envelope", label: "Email:", value: "grainzillow.support@gmail.com" },
              { icon: "fas fa-phone", label: "Landline:", value: "+91 866 242 3456" },
              { icon: "fas fa-mobile-alt", label: "Mobile:", value: "+91 82590 73296" },
              { icon: "fab fa-whatsapp", label: "WhatsApp:", value: "+91 75433 66557" },
              { icon: "fas fa-university", label: "Institution:", value: "VIT-AP University" },
              { icon: "fas fa-globe", label: "Website:", value: "www.vitap.ac.in" },
              { icon: "fas fa-map-marker-alt", label: "Address:", value: "VIT-AP University, Amaravati, AP-522237" },
              { icon: "fas fa-clock", label: "Hours:", value: "Mon-Fri, 9:00 AM - 6:00 PM" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-none">
                <i className={`${icon} contact-icon text-teal-700 w-5 text-center`}></i>
                <div className="flex items-center gap-2 flex-1">
                  <span className="contact-label text-gray-600 min-w-[80px] font-medium">{label}</span>
                  <span className="contact-value text-gray-800">{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Message Form */}
          <div className="contact-card bg-white rounded-lg shadow p-8">
            <h2 className="contact-title flex items-center gap-3 text-teal-700 text-xl font-semibold mb-6">
              <i className="fas fa-comment"></i> Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label htmlFor="name" className="block mb-2 text-gray-700 font-medium">Your Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-teal-700"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="block mb-2 text-gray-700 font-medium">Your Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-teal-700"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="block mb-2 text-gray-700 font-medium">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-teal-700"
                  required
                />
              </div>
              <button type="submit" className="submit-btn bg-teal-700 hover:bg-teal-900 w-full text-white font-semibold py-3 rounded transition">
                Send Message
              </button>
            </form>
          </div>

          <div className="footer-note text-center text-gray-600 text-sm">
            <p>© 2025 GrainZillow Project Team | VIT-AP University</p>
            <p className="mt-1 text-gray-400 text-xs">For technical queries, include your User ID for faster resolution.</p>
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
