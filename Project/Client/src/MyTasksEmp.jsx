import React, { useState, useEffect, useRef } from "react";

const sampleTasks = [
  {
    id: "TASK-001",
    description: "Inspect temperature sensors in Silo B-12 and report any anomalies",
    dueDate: "2025-10-28",
    status: "pending",
    priority: "High",
    completed: false,
    remarks: ""
  },
  {
    id: "TASK-002",
    description: "Perform routine maintenance on ventilation system in Wheat section",
    dueDate: "2025-10-26",
    status: "in-progress",
    priority: "Medium",
    completed: false,
    remarks: "Started maintenance, waiting for replacement parts"
  },
  // add other tasks similarly
];

export default function EmployeeTasks() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [tasks, setTasks] = useState(sampleTasks);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [remarkInput, setRemarkInput] = useState("");

  const filteredTasks = tasks.filter(task => {
    const statusMatch = statusFilter === "all" || task.status === statusFilter;
    const priorityMatch = priorityFilter === "all" || task.priority.toLowerCase() === priorityFilter;
    return statusMatch && priorityMatch;
  });

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  }

  function getStatusText(status) {
    const map = {
      "pending": "Pending",
      "in-progress": "In Progress",
      "completed": "Completed",
      "overdue": "Overdue",
    };
    return map[status] || status;
  }

  function toggleTaskCompletion(id) {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed, status: !task.completed ? "completed" : "pending" }
          : task
      )
    );
    alert(`Task ${id} marked as completed!`);
  }

  function openModal(task) {
    setCurrentTask(task);
    setRemarkInput(task.remarks || "");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div className="relative min-h-screen flex">
      {/* Sidebar */}
      <nav className={`sidebar fixed top-0 left-0 h-full bg-white shadow-md transition-width duration-300 z-50 ${sidebarExpanded ? "w-[230px]" : "w-[70px]"}`}>
        <ul className="list-none p-0 m-0">
          <li>
            <a href="/employee" >
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/my-tasks" className="active">
              <i className="fas fa-tasks"></i>
              <span>My Tasks</span>
            </a>
          </li>
          <li>
            <a href="/employee-messages">
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
      <div className={`flex-1 ml-[70px] transition-margin duration-300 ${sidebarExpanded ? "ml-[230px]" : ""} p-8`}>
        {/* Header */}
        <header className="fixed top-0 left-[70px] right-0 h-[70px] bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-between px-6 z-40 transition-left duration-300" style={{ left: sidebarExpanded ? "230px" : "70px" }}>
          <button onClick={() => setSidebarExpanded(!sidebarExpanded)} className="text-2xl hover:text-teal-300"><i className="fas fa-ellipsis-v"></i></button>
          <button className="bg-white text-teal-700 py-2 px-4 rounded font-semibold hover:bg-teal-100 transition">Logout</button>
        </header>

        {/* Page Title */}
        <div className="pt-[90px] max-w-6xl mx-auto">
          <div className="welcome bg-white p-8 rounded shadow mb-6 text-center">
            <h1 className="text-3xl font-semibold text-teal-700 mb-2">My Tasks</h1>
            <p className="text-gray-600">View and manage your assigned tasks</p>
          </div>

          <section className="tasks-section w-full bg-white rounded-lg shadow p-6">
            {/* Stats */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-5">
              <h2 className="text-teal-900 text-2xl flex items-center gap-3 font-semibold">
                <i className="fas fa-clipboard-list"></i> Assigned Tasks
              </h2>
              <div className="flex gap-6">
                <div className="stat-card stat-total text-center">
                  <div className="stat-value text-blue-600 font-bold text-2xl">{tasks.length}</div>
                  <div className="stat-label text-gray-500">Total Tasks</div>
                </div>
                <div className="stat-card stat-pending text-center">
                  <div className="stat-value text-orange-500 font-bold text-2xl">{tasks.filter(t => !t.completed && t.status !== 'completed').length}</div>
                  <div className="stat-label text-gray-500">Pending</div>
                </div>
                <div className="stat-card stat-completed text-center">
                  <div className="stat-value text-green-600 font-bold text-2xl">{tasks.filter(t => t.completed).length}</div>
                  <div className="stat-label text-gray-500">Completed</div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="tasks-filters flex flex-wrap gap-6 mb-6">
              <div className="filter-group flex items-center gap-2">
                <label htmlFor="statusFilter" className="filter-label font-semibold text-gray-700">Status:</label>
                <select
                  id="statusFilter"
                  className="filter-select border border-gray-300 rounded py-2 px-3"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div className="filter-group flex items-center gap-2">
                <label htmlFor="priorityFilter" className="filter-label font-semibold text-gray-700">Priority:</label>
                <select
                  id="priorityFilter"
                  className="filter-select border border-gray-300 rounded py-2 px-3"
                  value={priorityFilter}
                  onChange={e => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Tasks Table */}
            {filteredTasks.length === 0 ? (
              <div className="empty-state text-center text-gray-500 py-16">
                <i className="fas fa-clipboard-check text-5xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">No Tasks Assigned</h3>
                <p>You don't have any tasks assigned at the moment.</p>
              </div>
            ) : (
              <div className="tasks-table-container overflow-x-auto">
                <table className="tasks-table w-full min-w-[700px] border-collapse">
                  <thead>
                    <tr className="bg-teal-700 text-white">
                      <th className="p-4 text-left font-semibold">Task ID</th>
                      <th className="p-4 text-left font-semibold">Description</th>
                      <th className="p-4 text-left font-semibold">Due Date</th>
                      <th className="p-4 text-left font-semibold">Priority</th>
                      <th className="p-4 text-left font-semibold">Status</th>
                      <th className="p-4 text-center font-semibold">Completed</th>
                      <th className="p-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map(task => (
                      <tr key={task.id} className="hover:bg-gray-50 border-b border-gray-200">
                        <td className="task-id p-4 font-semibold text-teal-700">{task.id}</td>
                        <td className="task-description p-4 max-w-xs truncate">{task.description}</td>
                        <td className="p-4">{formatDate(task.dueDate)}</td>
                        <td className="p-4">
                          <span className={`priority-badge uppercase text-xs font-semibold rounded-full px-3 py-1 ${
                            task.priority.toLowerCase() === "high" ? "bg-red-100 text-red-700" :
                            task.priority.toLowerCase() === "medium" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`status-badge uppercase text-xs font-semibold rounded-full px-3 py-1 ${
                            task.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                            task.status === "in-progress" ? "bg-blue-100 text-blue-800" : 
                            task.status === "completed" ? "bg-green-100 text-green-800" : 
                            "bg-red-100 text-red-800"
                          }`}>
                            {getStatusText(task.status)}
                          </span>
                        </td>
                        <td className="checkbox-container p-4 text-center">
                          <input
                            type="checkbox"
                            className="task-checkbox h-5 w-5 cursor-pointer"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                          />
                        </td>
                        <td className="action-buttons p-4 flex gap-2">
                          <button
                            className="btn btn-view bg-orange-500 text-white rounded px-3 py-1 hover:bg-orange-600 flex items-center gap-2 text-xs font-semibold"
                            onClick={() => openModal(task)}
                          >
                            <i className="fas fa-eye"></i> View
                          </button>
                          <button
                            className="btn btn-remark bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700 flex items-center gap-2 text-xs font-semibold"
                            onClick={() => openModal(task)}
                          >
                            <i className="fas fa-comment"></i> Remark
                          </button>
                          {!task.completed && (
                            <button
                              className="btn btn-complete bg-green-600 text-white rounded px-3 py-1 hover:bg-green-700 flex items-center gap-2 text-xs font-semibold"
                              onClick={() => toggleTaskCompletion(task.id)}
                            >
                              <i className="fas fa-check"></i> Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Modal */}
        {modalOpen && currentTask && (
          <div
            className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={e => { if (e.target.classList.contains("modal")) closeModal(); }}
          >
            <div className="modal-content bg-white rounded-lg p-8 w-full max-w-lg shadow-lg relative">
              <div className="modal-header flex justify-between items-center mb-6">
                <h3 className="text-teal-700 flex items-center gap-2 text-xl font-semibold">
                  <i className="fas fa-tasks"></i> Task Details
                </h3>
                <button
                  className="close-modal text-gray-600 hover:text-gray-900 text-3xl font-bold cursor-pointer"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>
              <div className="task-details mb-6 space-y-3">
                <div className="detail-row flex">
                  <div className="detail-label font-semibold w-32 text-gray-700">Task ID:</div>
                  <div className="detail-value">{currentTask.id}</div>
                </div>
                <div className="detail-row flex">
                  <div className="detail-label font-semibold w-32 text-gray-700">Description:</div>
                  <div className="detail-value">{currentTask.description}</div>
                </div>
                <div className="detail-row flex">
                  <div className="detail-label font-semibold w-32 text-gray-700">Due Date:</div>
                  <div className="detail-value">{formatDate(currentTask.dueDate)}</div>
                </div>
                <div className="detail-row flex">
                  <div className="detail-label font-semibold w-32 text-gray-700">Priority:</div>
                  <div className="detail-value">{currentTask.priority}</div>
                </div>
                <div className="detail-row flex">
                  <div className="detail-label font-semibold w-32 text-gray-700">Status:</div>
                  <div className="detail-value">
                    <span className={`status-badge uppercase text-xs font-semibold rounded-full px-3 py-1 ${
                      currentTask.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                      currentTask.status === "in-progress" ? "bg-blue-100 text-blue-800" : 
                      currentTask.status === "completed" ? "bg-green-100 text-green-800" : 
                      "bg-red-100 text-red-800"
                    }`}>
                      {getStatusText(currentTask.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="remarks-section">
                <label htmlFor="remarkInput" className="block font-semibold text-gray-700 mb-2">Employee Remarks:</label>
                <div className="current-remark bg-gray-100 rounded p-3 mb-4 whitespace-pre-wrap min-h-[60px]">
                  {currentTask.remarks || "[translate:No remarks added yet.]"}
                </div>
                <textarea
                  id="remarkInput"
                  className="remark-input w-full border border-gray-300 rounded p-3 mb-4 resize-none min-h-[60px]"
                  placeholder="[translate:Add your remarks here...]"
                  value={remarkInput}
                  onChange={e => setRemarkInput(e.target.value)}
                />
                <div className="remark-actions flex gap-4 justify-end">
                  <button
                    className="btn-save bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-semibold"
                    onClick={() => {
                      setTasks(prev => prev.map(t => t.id === currentTask.id ? {...t, remarks: remarkInput} : t));
                      alert(`[translate:Remark saved for task] ${currentTask.id}`);
                      setModalOpen(false);
                    }}
                  >
                    <i className="fas fa-save mr-2"></i> [translate:Save Remark]
                  </button>
                  <button
                    className="btn-cancel bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded font-semibold"
                    onClick={() => setModalOpen(false)}
                  >
                    <i className="fas fa-times mr-2"></i> [translate:Cancel]
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
