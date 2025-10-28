import React, { useState } from "react";

const employeeTasks = [
  {
    id: "EMP001",
    name: "Rahul Sharma",
    silo: "Silo-A1",
    task: "Check Fan Connection",
    status: "Active",
    remark: "Fan working normally.",
  },
  {
    id: "EMP002",
    name: "Priya Singh",
    silo: "Silo-B3",
    task: "Verify Temperature Sensor",
    status: "Pending",
    remark: "Sensor needs calibration.",
  },
];

const completedWork = [
  {
    id: "EMP003",
    name: "Vikram Patel",
    task: "Cleaned Moisture Filter",
    silo: "Silo-C1",
    date: "21-Oct-2025",
  },
  {
    id: "EMP004",
    name: "Anjali Verma",
    task: "Checked Gas Sensors",
    silo: "Silo-A2",
    date: "19-Oct-2025",
  },
];

export default function TaskAssignment() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [priority, setPriority] = useState("warning");
  const [allEmployeesSelected, setAllEmployeesSelected] = useState(true);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const toggleSidebar = () => setSidebarExpanded((prev) => !prev);

  const handlePrioritySelect = (level) => {
    setPriority(level);
  };

  const handleAllEmployeesToggle = (e) => {
    const checked = e.target.checked;
    setAllEmployeesSelected(checked);
    if (checked) setSelectedRecipients([]);
  };

  const handleRecipientToggle = (e) => {
    const { checked, value } = e.target;
    setSelectedRecipients((prev) =>
      checked ? [...prev, value] : prev.filter((val) => val !== value)
    );
  };

  const sendAlert = () => {
    const recipients = allEmployeesSelected ? "All Employees" : selectedRecipients.join(", ");
    alert(
      `Alert sent successfully!\nPriority: ${priority}\nRecipients: ${recipients}`
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f2fdfb] to-[#e6f4f1] text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between h-[70px] bg-gradient-to-r from-teal-700 to-teal-900 text-white px-6 shadow-md z-50">
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
      <nav
        className={`fixed top-0 left-0 h-full bg-white shadow-lg pt-[70px] transition-all duration-300 overflow-hidden z-40 ${
          sidebarExpanded ? "w-56" : "w-16"
        }`}
      >
        <ul className="flex flex-col text-gray-700">
          {[
            { icon: "fas fa-home", label: "Dashboard" },
            { icon: "fas fa-users", label: "Employee Management" },
            { icon: "fas fa-tasks", label: "Task Assignment", active: true },
            { icon: "fas fa-comments", label: "Message Centre" },
            { icon: "fas fa-history", label: "History Logs" },
            { icon: "fas fa-pen", label: "Manual Grain Entry" },
            { icon: "fas fa-user", label: "My Profile" },
            { icon: "fas fa-info-circle", label: "About Us" },
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
        className={`pt-[70px] px-6 md:px-10 pb-8 transition-all duration-300 flex-grow ${
          sidebarExpanded ? "ml-56" : "ml-16"
        }`}
      >
        {/* Employee Task Management */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-teal-800 text-xl font-semibold mb-4">Employee Task Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-teal-700 text-white text-center">
                  <th className="p-3 border">Employee ID</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Assigned Silo</th>
                  <th className="p-3 border">Task</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Employee Remark</th>
                  <th className="p-3 border">Delete</th>
                </tr>
              </thead>
              <tbody>
                {employeeTasks.map(({ id, name, silo, task, status, remark }) => (
                  <tr key={id} className="even:bg-[#f5fffd] text-center">
                    <td className="p-3 border">{id}</td>
                    <td className="p-3 border">{name}</td>
                    <td className="p-3 border">{silo}</td>
                    <td className="p-3 border">{task}</td>
                    <td className={`p-3 border font-bold ${status === "Active" ? "text-green-600" : "text-yellow-500"}`}>
                      {status}
                    </td>
                    <td className="p-3 border">{remark}</td>
                    <td className="p-3 border">
                      <button className="text-red-600 text-lg hover:text-red-800 transition transform hover:scale-110" title="Delete Task">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Assign New Task */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-teal-800 text-xl font-semibold mb-4">Assign New Task</h2>
          <form>
            <div className="mb-4">
              <label className="block text-teal-800 font-semibold mb-2">Employee ID:</label>
              <input type="text" placeholder="Enter Employee ID" className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div className="mb-4">
              <label className="block text-teal-800 font-semibold mb-2">Task Description:</label>
              <textarea placeholder="Describe the task..." rows={3} className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-teal-800 font-semibold mb-2">Silo Code:</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option>Silo-A1</option>
                <option>Silo-B3</option>
                <option>Silo-C2</option>
              </select>
            </div>
            <button type="submit" className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-900 transition">
              Assign Task
            </button>
          </form>
        </section>

        {/* Alert & Message System */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="flex items-center gap-2 text-teal-800 font-semibold text-xl mb-4">
            <i className="fas fa-bullhorn"></i> Alert & Message System
          </h2>
          <p className="mb-4">Send alerts and messages to employees about critical issues, updates, or tasks.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alert Form */}
            <div>
              <input
                id="alertTitle"
                type="text"
                placeholder="Enter alert title"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              />
              <textarea
                id="alertMessage"
                rows={4}
                placeholder="Enter your message..."
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              />
              <div className="mb-4">
                <label className="block text-teal-800 font-semibold mb-2">Priority:</label>
                <div className="flex gap-3">
                  {["normal", "warning", "urgent"].map((level) => (
                    <div
                      key={level}
                      className={`cursor-pointer border border-gray-300 rounded px-4 py-2 text-center hover:bg-teal-700 hover:text-white transition`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-teal-800 font-semibold mb-2">Send To:</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    All Employees
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    Rahul Sharma
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    Priya Singh
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    Vikram Patel
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    Anjali Verma
                  </label>
                </div>
              </div>

              <button className="bg-teal-700 text-white px-5 py-2 rounded hover:bg-teal-900 transition flex items-center gap-2">
                <i className="fas fa-paper-plane"></i> Send Alert
              </button>
            </div>

            {/* Alert History */}
            <div>
              <h3 className="text-teal-700 font-semibold mb-3">Recent Alerts</h3>
              {[
                {
                  title: "Critical Temperature Alert",
                  date: "Today, 10:30 AM",
                  message: "Silo-B3 temperature has exceeded safe limits. Please check immediately.",
                  recipients: "All Employees",
                  type: "urgent",
                },
                {
                  title: "Scheduled Maintenance",
                  date: "Yesterday, 3:15 PM",
                  message: "Preventive maintenance scheduled for Silo-A1 on Friday. Please plan accordingly.",
                  recipients: "Rahul Sharma, Priya Singh",
                  type: "warning",
                },
                {
                  title: "New Safety Protocol",
                  date: "Oct 22, 2025",
                  message: "Please review the updated safety protocols document in the shared folder.",
                  recipients: "All Employees",
                  type: "normal",
                },
                {
                  title: "Gas Sensor Malfunction",
                  date: "Oct 20, 2025",
                  message: "MQ2 sensor in Silo-C2 needs immediate replacement. Avoid area until fixed.",
                  recipients: "Vikram Patel, Anjali Verma",
                  type: "urgent",
                },
              ].map(({ title, date, message, recipients, type }, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded border-l-4 mb-4 ${
                    type === "urgent"
                      ? "border-red-600 bg-red-50"
                      : type === "warning"
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-teal-600 bg-teal-50"
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <div className="font-bold text-teal-700">{title}</div>
                    <div className="text-sm text-gray-600">{date}</div>
                  </div>
                  <div className="text-gray-800 mb-1">{message}</div>
                  <div className="text-teal-700 text-sm font-semibold">Sent to: {recipients}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Completed Work History */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-teal-800 text-xl font-semibold mb-4">Completed Work History</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <thead className="bg-teal-700 text-white">
                <tr>
                  <th className="p-3 border">Employee ID</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Task Completed</th>
                  <th className="p-3 border">Silo</th>
                  <th className="p-3 border">Date Completed</th>
                </tr>
              </thead>
              <tbody>
                {completedWork.map(({ id, name, task, silo, date }) => (
                  <tr key={id} className="even:bg-[#f5fffd]">
                    <td className="p-3 border">{id}</td>
                    <td className="p-3 border">{name}</td>
                    <td className="p-3 border">{task}</td>
                    <td className="p-3 border">{silo}</td>
                    <td className="p-3 border">{date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tip */}
        <div className="bg-teal-100 text-teal-800 p-4 rounded text-center font-semibold">
          Tip: Keep updating employee status and completed tasks for better tracking.
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-teal-900 text-white text-center py-3 mt-auto w-full">
        © 2025 GrainZillow — Smart Grain Management System
      </footer>
    </div>
  );
}
