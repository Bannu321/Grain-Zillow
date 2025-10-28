import React, { useState } from "react";

export default function ContactUs() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);

  const contactManager = (action) => {
    if (action === "call") {
      alert("[translate:Calling Rajesh Kumar at +91 98765 43210...]");
      // Real call functionality here
    } else if (action === "message") {
      alert("[translate:Redirecting to messages section to contact your manager...]");
      // Real redirect functionality here
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("[translate:Your message has been sent. You will receive a response within 24 hours.]");
    // Real form submission logic here
  };

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
          [translate:Logout]
        </button>
      </header>

      <nav
        className={`sidebar fixed top-0 left-0 h-screen bg-white pt-[90px] shadow-md overflow-x-hidden transition-width duration-300 z-40 ${
          sidebarExpanded ? "w-[230px]" : "w-[70px]"
        }`}
        id="sidebar"
      >
        <ul className="list-none p-0 m-0">
          {[
            { icon: "fa-home", label: "[translate:Dashboard]" },
            { icon: "fa-history", label: "[translate:Work History]" },
            { icon: "fa-tasks", label: "[translate:My Tasks]" },
            { icon: "fa-envelope", label: "[translate:Messages]" },
            { icon: "fa-user", label: "[translate:My Profile]" },
            { icon: "fa-phone", label: "[translate:Contact Us]", active: true },
          ].map(({ icon, label, active }) => (
            <li key={label}>
              <a
                href="#"
                className={`flex items-center px-5 py-3 gap-4 text-gray-800 no-underline border-l-4 ${
                  active ? "bg-[#e0f7f5] border-l-teal-700 text-teal-900 font-semibold" : "border-l-transparent hover:bg-[#e0f7f5] hover:border-l-teal-700 hover:text-teal-900"
                } ${!sidebarExpanded ? "justify-center" : ""}`}
              >
                <i className={`fas ${icon} w-5 text-center text-lg`}></i>
                <span className={`sidebar-span transition-opacity duration-300 ${sidebarExpanded ? "opacity-100" : "opacity-0"}`}>
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
        id="content"
      >
        <div className="welcome bg-white p-5 rounded-lg shadow-md mb-7 text-center w-full max-w-[1000px]">
          <h1 className="text-teal-700 text-2xl mb-2.5">[translate:Contact Us]</h1>
          <p>[translate:Get in touch with your manager or the GrainZillow support team]</p>
        </div>

        <section className="contact-section w-full max-w-[1000px] grid md:grid-cols-2 gap-6 mb-7">
          {/* Manager Contact Card */}
          <div className="contact-card bg-white rounded-lg shadow p-8">
            <h2 className="contact-title flex items-center gap-3 text-teal-700 text-xl font-semibold mb-6">
              <i className="fas fa-user-tie"></i> [translate:Your Manager]
            </h2>
            <div className="manager-header flex items-center gap-4 border-b border-gray-200 pb-6 mb-6">
              <div className="manager-avatar w-16 h-16 rounded-full bg-teal-700 text-white flex justify-center items-center text-2xl font-bold">
                RK
              </div>
              <div className="manager-details">
                <h3 className="text-teal-800 mb-1">Rajesh Kumar</h3>
                <p className="text-gray-600 text-sm">[translate:Zone Manager - Northern Facility]</p>
              </div>
            </div>

            {[
              { icon: "fa-phone", label: "[translate:Mobile:]", value: "+91 98765 43210" },
              { icon: "fa-envelope", label: "[translate:Email:]", value: "rajesh.kumar@grainszillow.com" },
              { icon: "fab fa-whatsapp", label: "[translate:WhatsApp:]", value: "+91 98765 43210" },
              { icon: "fa-clock", label: "[translate:Available:]", value: "[translate:Mon-Fri, 8:00 AM - 6:00 PM]" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="contact-item flex items-center gap-4 py-3 border-b border-gray-100 last:border-none">
                <i className={`contact-icon fas ${icon} text-teal-700 w-5 text-center`}></i>
                <div className="contact-text flex w-full justify-between">
                  <span className="contact-label font-medium text-gray-600">{label}</span>
                  <span className="contact-value text-gray-800">{value}</span>
                </div>
              </div>
            ))}

            <div className="quick-actions flex gap-4 mt-6">
              <button
                className="action-btn btn-call bg-green-600 text-white w-full py-3 rounded flex justify-center items-center gap-2 hover:bg-green-700 transition"
                onClick={() => contactManager("call")}
              >
                <i className="fas fa-phone"></i> [translate:Call Now]
              </button>
              <button
                className="action-btn btn-message bg-blue-600 text-white w-full py-3 rounded flex justify-center items-center gap-2 hover:bg-blue-700 transition"
                onClick={() => contactManager("message")}
              >
                <i className="fas fa-comment"></i> [translate:Send Message]
              </button>
            </div>

            <div className="emergency-section mt-6 border-l-4 border-red-600 bg-red-100 p-4 rounded">
              <h4 className="text-red-700 text-lg font-semibold flex items-center gap-2">
                <i className="fas fa-exclamation-triangle"></i> [translate:Emergency Contact]
              </h4>
              <p>[translate:For urgent silo-related emergencies outside office hours, contact directly via mobile.]</p>
            </div>
          </div>

          {/* System Support Contact Card */}
          <div className="contact-card bg-white rounded-lg shadow p-8">
            <h2 className="contact-title flex items-center gap-3 text-teal-700 text-xl font-semibold mb-6">
              <i className="fas fa-headset"></i> [translate:System Support]
            </h2>
            {[
              { icon: "fa-envelope", label: "[translate:Email:]", value: "grainzillow.support@gmail.com" },
              { icon: "fa-phone", label: "[translate:Landline:]", value: "+91 866 242 3456" },
              { icon: "fa-mobile-alt", label: "[translate:Mobile:]", value: "+91 82590 73296" },
              { icon: "fab fa-whatsapp", label: "[translate:WhatsApp:]", value: "+91 75433 66557" },
              { icon: "fa-university", label: "[translate:Institution:]", value: "VIT-AP University" },
              { icon: "fa-globe", label: "[translate:Website:]", value: "www.vitap.ac.in" },
              { icon: "fa-map-marker-alt", label: "[translate:Address:]", value: "[translate:VIT-AP University, Amaravati, AP-522237]" },
              { icon: "fa-clock", label: "[translate:Hours:]", value: "[translate:Mon-Fri, 9:00 AM - 6:00 PM]" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="contact-item flex items-center gap-4 py-3 border-b border-gray-100 last:border-none">
                <i className={`contact-icon fas ${icon} text-teal-700 w-5 text-center`}></i>
                <div className="contact-text flex w-full justify-between">
                  <span className="contact-label font-medium text-gray-600">{label}</span>
                  <span className="contact-value text-gray-800">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Card */}
        <section className="contact-card bg-white rounded-lg shadow p-8 w-full max-w-[1000px] mt-6">
          <h2 className="contact-title flex items-center gap-3 text-teal-700 text-xl font-semibold mb-6">
            <i className="fas fa-comment"></i> [translate:Send a Message]
          </h2>
          <form onSubmit={(e) => { e.preventDefault(); alert("[translate:Your message has been sent. You will receive a response within 24 hours.]"); }} className="flex flex-col gap-6">
            <div className="form-group flex flex-col">
              <label htmlFor="recipient" className="mb-2 font-semibold text-gray-700">[translate:Recipient]</label>
              <select id="recipient" className="p-3 rounded border border-gray-300 bg-white">
                <option value="manager">Rajesh Kumar (Manager)</option>
                <option value="support" disabled>[translate:System Admin (Read Only)]</option>
              </select>
            </div>
            <div className="form-group flex flex-col">
              <label htmlFor="subject" className="mb-2 font-semibold text-gray-700">[translate:Subject]</label>
              <input type="text" id="subject" placeholder="[translate:Enter message subject]" className="p-3 rounded border border-gray-300"/>
            </div>
            <div className="form-group flex flex-col">
              <label htmlFor="senderName" className="mb-2 font-semibold text-gray-700">[translate:Your Name]</label>
              <input type="text" id="senderName" defaultValue="Amit Kumar" className="p-3 rounded border border-gray-300"/>
            </div>
            <div className="form-group flex flex-col">
              <label htmlFor="employeeId" className="mb-2 font-semibold text-gray-700">[translate:Your Employee ID]</label>
              <input type="text" id="employeeId" defaultValue="GRZ-EMP-7284" className="p-3 rounded border border-gray-300"/>
            </div>
            <div className="form-group flex flex-col">
              <label htmlFor="message" className="mb-2 font-semibold text-gray-700">[translate:Message]</label>
              <textarea id="message" rows="5" placeholder="[translate:Type your message here...]" className="p-3 rounded border border-gray-300"></textarea>
            </div>
            <button type="submit" className="submit-btn bg-teal-700 hover:bg-teal-800 text-white py-3 rounded font-semibold flex items-center justify-center gap-3">
              <i className="fas fa-paper-plane"></i> [translate:Send Message]
            </button>
          </form>
        </section>

        <div className="footer-note text-center text-gray-600 text-sm mt-6 p-4 max-w-[1000px] mx-auto">
          <p>© 2025 GrainZillow Project Team | VIT-AP University</p>
          <p className="mt-1 text-xs text-gray-500">
            [translate:For technical queries, include your Employee ID for faster resolution. Contact your manager for work-related issues.]
          </p>
        </div>
      </main>

      <footer className="bg-teal-900 text-white text-center py-3 mt-auto w-full">
        &copy; 2025 GrainZillow — [translate:Smart Grain Storage Monitoring System]
      </footer>
    </>
  );
}
