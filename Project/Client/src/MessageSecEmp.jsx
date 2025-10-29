// React JSX with Tailwind CSS for "Messages & Notifications" Page
export default function EmployeeMessages() {
  // Sample data
  const messages = [
    {
      id: 1,
      sender: "Rajesh Kumar",
      senderType: "manager",
      content: "Please complete the temperature sensor inspection in Silo B-12 by tomorrow. Let me know if you face any issues.",
      timestamp: "2025-10-24 09:30 AM",
      replies: [
        {
          sender: "You",
          content: "I'll complete it by today evening. The sensors seem to be working fine.",
          timestamp: "2025-10-24 10:15 AM"
        }
      ]
    },
    {
      id: 2,
      sender: "System Admin",
      senderType: "admin",
      content: "System maintenance scheduled for Saturday from 2-4 AM. Some features may be temporarily unavailable.",
      timestamp: "2025-10-23 03:45 PM",
      replies: []
    },
    {
      id: 3,
      sender: "Rajesh Kumar",
      senderType: "manager",
      content: "Great work on the wheat shipment loading yesterday. The transport company appreciated your efficiency.",
      timestamp: "2025-10-23 11:20 AM",
      replies: [
        {
          sender: "You",
          content: "Thank you! The new loading process is working well.",
          timestamp: "2025-10-23 02:30 PM"
        }
      ]
    }
  ];

  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Temperature Alert",
      message: "Temperature in Wheat section approaching warning level (34°C)",
      timestamp: "2025-10-24 10:45 AM"
    },
    {
      id: 2,
      type: "info",
      title: "Maintenance Reminder",
      message: "Routine ventilation system maintenance due this Friday",
      timestamp: "2025-10-24 09:15 AM"
    },
    {
      id: 3,
      type: "normal",
      title: "Task Completed",
      message: "Inventory update for Rice compartment completed successfully",
      timestamp: "2025-10-23 05:20 PM"
    },
    {
      id: 4,
      type: "critical",
      title: "Gas Level Warning",
      message: "MQ2 sensor detected elevated gas levels in Corn storage. Ventilation activated automatically.",
      timestamp: "2025-10-23 03:10 PM"
    }
  ];

  // UI Rendering with Tailwind classes
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f2fdfb] to-[#e6f4f1] font-sans text-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full h-16 bg-gradient-to-br from-teal-700 to-teal-900 text-white flex justify-between items-center px-6 shadow-lg z-50">
        <button className="text-2xl" id="toggleSidebar">
          <i className="fas fa-ellipsis-v"></i>
        </button>
        <div className="flex items-center gap-2">
          <i className="fas fa-seedling text-3xl"></i>
          <h1 className="text-xl font-semibold">GrainZillow</h1>
        </div>
        <button className="bg-white text-teal-700 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition">Logout</button>
      </header>

      {/* Sidebar */}
      <nav className="fixed top-0 left-0 h-full bg-white shadow-md w-[70px] transition-all duration-300 z-40" id="sidebar">
        <ul className="flex flex-col p-0 m-0 mt-20">
        <li>
            <a href="/employee" >
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/my-tasks" >
              <i className="fas fa-tasks"></i>
              <span>My Tasks</span>
            </a>
          </li>
          <li>
            <a href="/employee-messages" className="active">
              <i className="fas fa-envelope"></i>
              <span>Messages</span>
            </a>
          </li>
          <li>
            <a href="/work-history">
              <i className="fas fa-clock"></i>
              <span>Work History</span>
            </a>
          </li>
          <li>
            <a href="/my-profile-emp">
              <i className="fas fa-user"></i>
              <span>My Profile</span>
            </a>
          </li>
          <li>
            <a href="/contactus-emp">
              <i className="fas fa-phone"></i>
              <span>Contact Us</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <div className="flex-1 ml-[70px] mt-20 p-8 transition-margin duration-300" id="content">
        {/* Page Header */}
        <div className="bg-white p-6 rounded shadow mb-6 text-center">
          <h2 className="text-3xl font-semibold text-teal-700 mb-2">Messages & Notifications</h2>
          <p className="text-gray-600">Communicate with your manager and stay updated with important alerts</p>
        </div>

        {/* Messages & Alerts Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Manager Contact Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="flex items-center gap-2 text-teal-700 mb-4 text-xl font-semibold">
              <i className="fas fa-user-tie"></i> <span>My Manager</span>
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xl">RK</div>
              <div>
                <h4 className="text-lg font-semibold text-teal-700 mb-1">Rajesh Kumar</h4>
                <p className="text-gray-600 text-sm">Zone Manager - Northern Facility</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <i className="fas fa-phone text-teal-700"></i>
                <span className="text-gray-700">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-envelope text-teal-700"></i>
                <span className="text-gray-700">rajesh.kumar@grainszillow.com</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fab fa-whatsapp text-teal-700"></i>
                <span className="text-gray-700">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-clock text-teal-700"></i>
                <span className="text-gray-700">Available: Mon-Fri, 9AM-6PM</span>
              </div>
            </div>
          </div>

          {/* Messages Card */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col h-full">
            <h3 className="flex items-center gap-2 text-teal-700 mb-4 text-xl font-semibold">
              <i className="fas fa-comments"></i> <span>Recent Messages</span>
            </h3>
            <div className="flex-1 overflow-y-auto mb-4" id="messagesList">
              {/* Messages will be populated here dynamically */}
            </div>
            <div className="border-t pt-4">
              <textarea className="w-full p-3 border border-gray-300 rounded mb-4" placeholder="Type your message to manager..."></textarea>
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold flex items-center gap-2">
                <i className="fas fa-paper-plane"></i> Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Compose New Message */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="flex items-center gap-2 text-teal-700 mb-4 text-xl font-semibold">
            <i className="fas fa-edit"></i> <span>Compose New Message</span>
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Recipient</label>
              <select className="w-full border border-gray-300 rounded p-3" disabled>
                <option>Rajesh Kumar (Manager)</option>
                <option disabled>System Admin (Read Only)</option>
              </select>
              <small className="block text-gray-500 mt-2">Note: You can only send messages to your manager</small>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Subject</label>
              <input className="w-full border border-gray-300 rounded p-3" placeholder="Enter message subject" />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Message</label>
              <textarea className="w-full border border-gray-300 rounded p-3 min-h-[100px]" placeholder="Type your message here..."></textarea>
            </div>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold flex items-center gap-2">
              <i className="fas fa-paper-plane"></i> Send Message
            </button>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="flex items-center gap-2 text-teal-700 mb-4 text-xl font-semibold">
            <i className="fas fa-bell"></i> <span>System Alerts & Notifications</span>
          </h3>
          <div className="flex flex-col gap-4" id="alertsList">
            {/* Alerts will be populated here dynamically */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#004D40] text-white text-center p-3 mt-auto">
        &copy; 2025 GrainZillow — <span className="font-semibold">Smart Grain Storage Monitoring System</span>
      </footer>
    </div>
  );
}
