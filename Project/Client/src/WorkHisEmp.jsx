import React, { useState, useEffect } from "react";

const workHistory = [
  {
    date: "2025-10-24",
    activities: [
      {
        id: 1,
        time: "09:00 AM - 10:30 AM",
        title: "Temperature Sensor Inspection",
        type: "inspection",
        silo: "Silo B-12",
        description: "Completed routine inspection of temperature sensors in Wheat section. All sensors functioning normally.",
        status: "completed",
        duration: "1.5 hours",
        grains: ["Wheat"]
      },
      {
        id: 2,
        time: "11:00 AM - 12:30 PM",
        title: "Ventilation System Maintenance",
        type: "maintenance",
        silo: "Silo B-12",
        description: "Performed scheduled maintenance on ventilation system. Replaced filters and cleaned ducts.",
        status: "completed",
        duration: "1.5 hours",
        grains: ["Wheat", "Rice"]
      },
      {
        id: 3,
        time: "02:00 PM - 03:00 PM",
        title: "Grain Inventory Update",
        type: "task",
        silo: "Silo B-12",
        description: "Updated inventory records for Rice compartment. Verified physical stock matches system records.",
        status: "completed",
        duration: "1 hour",
        grains: ["Rice"]
      }
    ]
  },
  // Additional day objects as in the original data...
];

const activityTypeIcons = {
  task: "tasks",
  maintenance: "tools",
  inspection: "search",
  emergency: "exclamation-triangle",
};

const activityTypeLabels = {
  task: "Task",
  maintenance: "Maintenance",
  inspection: "Inspection",
  emergency: "Emergency",
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function calculateTotalHours(activities) {
  let totalMinutes = 0;
  activities.forEach(({ duration }) => {
    // Extract numeric hours from a string like "1.5 hours"
    const hoursMatch = duration.match(/[\d.]+/);
    if (hoursMatch) {
      totalMinutes += parseFloat(hoursMatch[0]) * 60;
    }
  });
  return (totalMinutes / 60).toFixed(1);
}

export default function WorkHistory() {
  const [activityFilter, setActivityFilter] = useState("all");
  const [siloFilter, setSiloFilter] = useState("all");
  const [startDate, setStartDate] = useState("2025-10-01");
  const [endDate, setEndDate] = useState("2025-10-24");
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    // Filter workHistory by filters and date range
    const filtered = workHistory
      .map(({ date, activities }) => {
        const dayDate = new Date(date);
        if (dayDate < new Date(startDate) || dayDate > new Date(endDate)) {
          return null;
        }
        const filteredActivities = activities.filter((activity) => {
          const activityTypeMatch = activityFilter === "all" || activity.type === activityFilter;
          const siloMatch =
            siloFilter === "all" || activity.silo.toLowerCase() === siloFilter.toLowerCase();
          return activityTypeMatch && siloMatch;
        });
        return filteredActivities.length > 0 ? { date, activities: filteredActivities } : null;
      })
      .filter(Boolean);
    setFilteredHistory(filtered);
  }, [activityFilter, siloFilter, startDate, endDate]);

  function viewActivityDetails(activity) {
    alert(
      `Activity Details:\n\nTitle: ${activity.title}\nType: ${activityTypeLabels[activity.type]}\nSilo: ${activity.silo}\nTime: ${activity.time}\nDuration: ${activity.duration}\nDescription: ${activity.description}\nGrains: ${activity.grains.join(
        ", "
      )}`
    );
  }

  function addActivityNote() {
    const note = prompt("[translate:Add a note to this activity:]");
    if (note) {
      alert("[translate:Note added successfully!]");
      // In real app, save note to backend
    }
  }

  function exportHistory(format) {
    if (format === "print") {
      alert("[translate:Preparing print layout...]");
    } else {
      alert(`[translate:Exporting work history as] ${format.toUpperCase()}...`);
    }
    // Real export logic here
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f2fdfb] to-[#e6f4f1] font-poppins text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-br from-teal-700 to-teal-900 text-white flex justify-between items-center px-6 shadow-lg z-50">
        <button className="text-2xl text-white"><i className="fas fa-ellipsis-v"></i></button>
        <div className="flex items-center gap-2">
          <i className="fas fa-seedling text-2xl"></i>
          <h1 className="text-xl font-semibold">GrainZillow</h1>
        </div>
        <button className="bg-white text-teal-700 rounded px-4 py-2 font-semibold hover:bg-gray-100 transition">Logout</button>
      </header>

      {/* Sidebar */}
      <nav className="fixed top-16 left-0 h-full bg-white shadow-md w-[70px] transition-width duration-300 z-40 p-4">
        <ul className="space-y-6">
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
            <a href="/employee-messages">
              <i className="fas fa-envelope"></i>
              <span>Messages</span>
            </a>
          </li>
          <li>
            <a href="/work-history" className="active">
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
      <main className="ml-[70px] mt-16 p-8 max-w-6xl mx-auto">
        <div className="welcome bg-white p-6 rounded shadow mb-6 text-center">
          <h1 className="text-3xl font-semibold text-teal-700 mb-2">[translate:Work History]</h1>
          <p className="text-gray-600">[translate:Track your daily activities, completed tasks, and work accomplishments]</p>
        </div>

        {/* Overview Stats */}
        <section className="flex gap-8 mb-8 flex-wrap">
          <article className="stat-card text-center p-6 rounded shadow w-48">
            <div className="stat-value text-blue-600 font-bold text-3xl">47</div>
            <div className="stat-label text-gray-600">[translate:Tasks Completed]</div>
          </article>
          <article className="stat-card text-center p-6 rounded shadow w-48">
            <div className="stat-value text-orange-500 font-bold text-3xl">128</div>
            <div className="stat-label text-gray-600">[translate:Work Hours]</div>
          </article>
          <article className="stat-card text-center p-6 rounded shadow w-48">
            <div className="stat-value text-green-600 font-bold text-3xl">94%</div>
            <div className="stat-label text-gray-600">[translate:Productivity]</div>
          </article>
        </section>

        {/* Filters */}
        <section className="history-filters bg-white p-6 rounded shadow mb-8 flex flex-wrap gap-6 items-center">
          <div className="filter-group flex items-center gap-2">
            <label className="filter-label min-w-[80px]" htmlFor="startDate">[translate:Date Range:]</label>
            <input type="date" id="startDate" className="filter-input border border-gray-300 rounded p-2" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span>to</span>
            <input type="date" id="endDate" className="filter-input border border-gray-300 rounded p-2" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div className="filter-group flex items-center gap-2">
            <label className="filter-label" htmlFor="activityFilter">[translate:Activity Type:]</label>
            <select id="activityFilter" className="filter-select border border-gray-300 rounded p-2" value={activityFilter} onChange={e => setActivityFilter(e.target.value)}>
              <option value="all">[translate:All Activities]</option>
              <option value="task">[translate:Tasks]</option>
              <option value="maintenance">[translate:Maintenance]</option>
              <option value="inspection">[translate:Inspections]</option>
              <option value="emergency">[translate:Emergency]</option>
            </select>
          </div>
          <div className="filter-group flex items-center gap-2">
            <label className="filter-label" htmlFor="siloFilter">[translate:Silo:]</label>
            <select id="siloFilter" className="filter-select border border-gray-300 rounded p-2" value={siloFilter} onChange={e => setSiloFilter(e.target.value)}>
              <option value="all">[translate:All Silos]</option>
              <option value="Silo B-12">Silo B-12</option>
              <option value="Silo A-05">Silo A-05</option>
              <option value="Silo C-08">Silo C-08</option>
            </select>
          </div>
          <button className="btn btn-view bg-teal-700 text-white px-4 py-2 rounded" onClick={() => { /* refilter handled by effect */ }}>
            <i className="fas fa-filter mr-2"></i> [translate:Apply Filters]
          </button>
        </section>

        {/* Timeline */}
        <section className="timeline-container bg-white p-6 rounded shadow max-h-[600px] overflow-y-auto">
          {filteredHistory.length === 0 ? (
            <div className="empty-state text-center py-20 text-gray-500">
              <i className="fas fa-clipboard-list text-6xl mb-4"></i>
              <h3 className="text-2xl font-semibold mb-2">[translate:No Work History Found]</h3>
              <p>[translate:No work activities found for the selected filters.]</p>
            </div>
          ) : (
            filteredHistory.map(day => (
              <article key={day.date} className="timeline-day mb-12 relative pl-16 border-l-2 border-gray-200">
                <header className="day-header flex items-center gap-4 p-3 bg-gray-100 rounded mb-6">
                  <time className="day-date font-bold text-teal-700 text-lg min-w-[140px]">{formatDate(day.date)}</time>
                  <p className="day-summary text-gray-600">
                    {day.activities.length} {day.activities.length === 1 ? "[translate:activity]" : "[translate:activities]"} •{" "}
                    {calculateTotalHours(day.activities)} [translate:total hours]
                  </p>
                </header>
                <div className="timeline-items space-y-8">
                  {day.activities.map(activity => (
                    <div key={activity.id} className={`timeline-item bg-gray-50 p-6 rounded-lg border-l-4 ${
                      activity.type === "task" ? "border-teal-500" :
                      activity.type === "maintenance" ? "border-orange-500" :
                      activity.type === "inspection" ? "border-purple-600" :
                      activity.type === "emergency" ? "border-red-600" : "border-gray-400"
                    }`}>
                      <div className="item-header flex justify-between mb-3">
                        <h3 className="item-title font-semibold text-gray-800 flex items-center gap-2">
                          <i className={`fas fa-${activityTypeIcons[activity.type] || "circle"} text-teal-700`}></i> {activity.title}
                        </h3>
                        <time className="item-time text-xs text-gray-500 bg-white rounded px-2 py-1 border border-gray-300">{activity.time}</time>
                      </div>
                      <p className="item-content text-gray-700 mb-3">{activity.description}</p>
                      <div className="item-details flex flex-wrap gap-5 text-gray-600 text-sm">
                        <span className="detail-badge flex items-center gap-1"><i className="fas fa-warehouse"></i> {activity.silo}</span>
                        <span className="detail-badge flex items-center gap-1"><i className="fas fa-clock"></i> {activity.duration}</span>
                        <span className="detail-badge flex items-center gap-1"><i className="fas fa-seedling"></i> {activity.grains.join(", ")}</span>
                      </div>
                      <div className="item-actions flex gap-4 mt-4">
                        <button onClick={() => viewActivityDetails(activity)} className="btn btn-view bg-blue-600 text-white px-3 py-1 rounded font-semibold flex items-center gap-2">
                          <i className="fas fa-eye"></i> [translate:View Details]
                        </button>
                        <button onClick={() => addActivityNote()} className="btn btn-details bg-orange-600 text-white px-3 py-1 rounded font-semibold flex items-center gap-2">
                          <i className="fas fa-edit"></i> [translate:Add Note]
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))
          )}
        </section>

        {/* Export Section */}
        <section className="export-section bg-white mt-8 p-6 rounded shadow text-center">
          <h3 className="text-teal-700 flex justify-center items-center gap-3 mb-6 text-xl font-semibold">
            <i className="fas fa-download"></i> [translate:Export Work History]
          </h3>
          <div className="export-options flex justify-center gap-6 flex-wrap">
            <button className="btn-export bg-teal-700 text-white px-5 py-3 rounded flex items-center gap-3" onClick={() => exportHistory("pdf")}>
              <i className="fas fa-file-pdf"></i> PDF
            </button>
            <button className="btn-export bg-teal-700 text-white px-5 py-3 rounded flex items-center gap-3" onClick={() => exportHistory("excel")}>
              <i className="fas fa-file-excel"></i> Excel
            </button>
            <button className="btn-export bg-teal-700 text-white px-5 py-3 rounded flex items-center gap-3" onClick={() => exportHistory("print")}>
              <i className="fas fa-print"></i> [translate:Print Report]
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-white bg-teal-900 p-4 text-center mt-auto">
        &copy; 2025 GrainZillow — [translate:Smart Grain Storage Monitoring System]
      </footer>
    </div>
  );

  // Helper functions inside component
  function viewActivityDetails(activity) {
    alert(`[translate:Activity Details:]\n\n[translate:Title:] ${activity.title}\n[translate:Type:] ${activityTypeLabels[activity.type]}\n[translate:Silo:] ${activity.silo}\n[translate:Time:] ${activity.time}\n[translate:Duration:] ${activity.duration}\n[translate:Description:] ${activity.description}\n[translate:Grains:] ${activity.grains.join(", ")}`);
  }

  function addActivityNote() {
    const note = window.prompt("[translate:Add a note to this activity:]");
    if (note) {
      alert("[translate:Note added successfully!]");
    }
  }

  function exportHistory(format) {
    if(format === "print") {
      alert("[translate:Preparing print layout...]");
    } else {
      alert(`[translate:Exporting work history as] ${format.toUpperCase()}...`);
    }
  }
}
