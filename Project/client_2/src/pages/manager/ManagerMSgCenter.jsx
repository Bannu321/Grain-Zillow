import React, { useState } from "react";

export default function MessageCentre() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [recipientType, setRecipientType] = useState('all');
  const [priority, setPriority] = useState('urgent');
  const [recipientCheckboxes, setRecipientCheckboxes] = useState({
    emp1: true,
    emp2: false,
    emp3: false,
    emp4: false,
  });
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'Admin 1',
      role: 'Administrator',
      message: 'Update temperature sensors before next cycle.',
      date: '23-Oct-2025 09:45 AM',
      priority: 'urgent',
      status: 'Pending',
    },
    {
      sender: 'Employee - Rahul',
      role: 'Worker',
      message: 'Task completed for Silo-A1.',
      date: '22-Oct-2025 07:20 PM',
      priority: 'normal',
      status: 'Read',
    },
  ]);

  const [sentMessages, setSentMessages] = useState([]);

  // Employee tasks sample data for task management table
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
    // Add more tasks as needed
  ];

  const toggleSidebar = () => setSidebarExpanded(prev => !prev);

  const handlePriorityClick = (level) => setPriority(level);

  const handleRecipientChange = (id) => {
    setRecipientCheckboxes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  function sendMessage() {
    if (!messageSubject || !messageContent) {
      alert('Please fill subject and message');
      return;
    }
    const now = new Date().toLocaleString('en-IN');
    setSentMessages(prev => [
      ...prev,
      {
        recipient: recipientType === 'all' ? 'All Employees' : Object.keys(recipientCheckboxes).filter(k => recipientCheckboxes[k]).join(', '),
        role: recipientType,
        message: messageSubject,
        date: now,
        status: 'Sent',
      }
    ]);
    alert(`Message sent!\nSubject: ${messageSubject}\nTo: ${recipientType === 'all' ? 'All' : 'Selected Employees'}`);
    setMessageSubject('');
    setMessageContent('');
  }

  const handleReply = (replyMsg) => {
    const now = new Date().toLocaleString('en-IN');
    setSentMessages(prev => [
      ...prev,
      {
        recipient: 'Recipient',
        role: 'Admin/Employee',
        message: replyMsg,
        date: now,
        status: 'Sent',
      }
    ]);
    alert(`Reply sent: "${replyMsg}"`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f2fdfb] to-[#e6f4f1] text-gray-800 font-sans">

      {/* Header */}
      <header className="fixed top-0 flex items-center justify-between bg-gradient-to-r from-teal-700 to-teal-900 text-white px-6 h-[70px] shadow-lg z-50 w-full">
        <button onClick={toggleSidebar} aria-label="Toggle Sidebar" className="text-2xl">
          <i className="fas fa-ellipsis-v"></i>
        </button>
        <div className="flex items-center space-x-2 font-semibold text-lg">
          <i className="fas fa-seedling"></i>
          <h1>GrainZillow</h1>
        </div>
        <button className="bg-white text-teal-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-100 transition">Logout</button>
      </header>

      {/* Sidebar */}
      <nav className={`fixed top-0 left-0 h-full bg-white shadow-lg pt-[70px] transition-all duration-300 overflow-hidden z-40 ${sidebarExpanded ? 'w-56' : 'w-16'}`}>
        <ul className="flex flex-col text-gray-700">
          {[
            { icon: "fas fa-home", label: "Dashboard" },
            { icon: "fas fa-users", label: "Employees" },
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
              <a href="#" className={`flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:bg-teal-100 hover:text-teal-900 transition ${active ? 'bg-teal-100 border-teal-700 text-teal-900 font-semibold' : ''}`}>
                <i className={`${icon} w-6 text-center`}></i>
                <span className={`${sidebarExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity whitespace-nowrap`}>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <main className={`${sidebarExpanded ? 'ml-56' : 'ml-16'} pt-[70px] px-6 md:px-10 pb-8 transition-all duration-300 flex-1`}>
        {/* Task Management */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-teal-800">Employee Task Management</h2>
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
                {employeeTasks.map(e => (
                  <tr key={e.id} className="even:bg-[#f5fffd] text-center">
                    <td className="p-3 border">{e.id}</td>
                    <td className="p-3 border">{e.name}</td>
                    <td className="p-3 border">{e.silo}</td>
                    <td className="p-3 border">{e.task}</td>
                    <td className={`p-3 border font-bold ${e.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>{e.status}</td>
                    <td className="p-3 border">{e.remark}</td>
                    <td className="p-3 border">
                      <button className="text-red-600 hover:text-red-800 transition" title="Delete Task">
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
          <h2 className="text-xl font-semibold mb-4 text-teal-800">Assign New Task</h2>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Task assigned!'); }}>
            <div>
              <label className="block mb-2 font-semibold text-teal-800">Employee ID:</label>
              <input type="text" placeholder="Enter Employee ID" className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-teal-800">Task Description:</label>
              <textarea rows={3} placeholder="Describe the task..." className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-teal-800">Silo Code:</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option>Silo-A1</option>
                <option>Silo-B3</option>
                <option>Silo-C2</option>
              </select>
            </div>
            <button type="submit" className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-900 transition">Assign Task</button>
          </form>
        </section>

        {/* Alert & Message System */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="flex items-center gap-2 mb-4 text-teal-800 font-semibold text-xl">
            <i className="fas fa-bullhorn"></i> Alert & Message System
          </h2>
          {/* Send New Alert */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Send New Alert</h3>
            <input type="text" placeholder="Enter alert title" className="w-full border border-gray-300 rounded px-3 py-2 mb-4" />
            <textarea rows={4} placeholder="Enter your message..." className="w-full border border-gray-300 rounded px-3 py-2 mb-4"></textarea>
            {/* Priority selection */}
            <div className="flex gap-3 mb-4">
              {["normal", "warning", "urgent"].map((level) => (
                <div
                  key={level}
                  onClick={() => setPriority(level)}
                  className={`cursor-pointer border border-gray-300 rounded px-4 py-2 text-center hover:bg-teal-700 hover:text-white transition ${priority === level ? 'border-teal-700 bg-teal-50' : ''}`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </div>
              ))}
            </div>
            {/* Send and Save buttons */}
            <div className="flex gap-4 mb-6">
              <button onClick={sendMessage} className="bg-teal-700 hover:bg-teal-900 text-white px-5 py-2 rounded flex items-center gap-2">
                <i className="fas fa-paper-plane"></i> Send Message
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded flex items-center gap-2" onClick={() => alert('Draft saved!')}>
                <i className="fas fa-save"></i> Save Draft
              </button>
            </div>
          </div>

          {/* Message System */}
          {/* Incoming Messages */}
          <h3 className="flex items-center gap-2 mb-4 text-teal-800 font-semibold text-xl"><i className="fas fa-inbox"></i> Incoming Messages</h3>
          {messages.map((msg, idx) => (
            <div key={idx} className={`p-4 mb-4 rounded border-l-4 ${msg.priority === 'urgent' ? 'border-red-600 bg-red-50' : msg.priority === 'warning' ? 'border-yellow-400 bg-yellow-50' : 'border-teal-600 bg-teal-50'}`}>
              <div className="flex justify-between mb-1">
                <div className="font-bold">{msg.sender}</div>
                <div className="text-sm text-gray-600">{msg.date}</div>
              </div>
              <div className="mb-1">{msg.message}</div>
              <div className="text-sm text-teal-700 font-semibold">Role: {msg.role}</div>
            </div>
          ))}
          {/* Sent Messages */}
          <h3 className="flex items-center gap-2 mb-4 text-teal-800 font-semibold text-xl mt-8"><i className="fas fa-paper-plane"></i> Sent Messages</h3>
          <table className="w-full border-collapse mb-8">
            <thead>
              <tr className="bg-teal-700 text-white">
                <th className="p-3 border">Receiver</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Message</th>
                <th className="p-3 border">Date & Time</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {sentMessages.map((msg, idx) => (
                <tr key={idx} className="hover:bg-gray-100 text-center">
                  <td className="p-3 border">{msg.recipient || 'N/A'}</td>
                  <td className="p-3 border">{msg.role}</td>
                  <td className="p-3 border">{msg.message}</td>
                  <td className="p-3 border">{msg.date}</td>
                  <td className="p-3 border"><span className={`px-2 py-1 rounded font-semibold ${msg.status === 'Sent' ? 'bg-green-100 text-green-700' : ''}`}>{msg.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-teal-900 text-white text-center py-3 mt-auto w-full">
        © 2025 GrainZillow — Smart Grain Management System
      </footer>
    </div>
  );
}
