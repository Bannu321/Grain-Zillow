import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(...registerables);

export default function HistoryLogs() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const tempChartRef = useRef(null);
  const humidityChartRef = useRef(null);
  const mq2ChartRef = useRef(null);
  const mq135ChartRef = useRef(null);

  useEffect(() => {
    const dates = ['Jan 9', 'Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15'];

    const createLineChart = (ctx, label, data, borderColor, bgColor, yLabel) => {
      return new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label,
            data,
            borderColor,
            backgroundColor: bgColor,
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: yLabel
              }
            }
          }
        }
      });
    };

    const tempCtx = tempChartRef.current.getContext('2d');
    const humidityCtx = humidityChartRef.current.getContext('2d');
    const mq2Ctx = mq2ChartRef.current.getContext('2d');
    const mq135Ctx = mq135ChartRef.current.getContext('2d');

    const tempChart = createLineChart(tempCtx, 'Temperature (°C)', [26.5, 27.2, 28.9, 30.1, 29.5, 28.7, 28.7], '#FF6384', 'rgba(255, 99, 132, 0.1)', 'Temperature (°C)');
    const humidityChart = createLineChart(humidityCtx, 'Humidity (%)', [68.2, 69.5, 70.8, 72.1, 71.3, 70.5, 71.3], '#36A2EB', 'rgba(54, 162, 235, 0.1)', 'Humidity (%)');
    const mq2Chart = createLineChart(mq2Ctx, 'MQ2 Gas (ppm)', [1050, 1120, 1080, 1150, 1180, 1165, 1185], '#4BC0C0', 'rgba(75, 192, 192, 0.1)', 'Gas Level (ppm)');
    const mq135Chart = createLineChart(mq135Ctx, 'MQ135 Gas (ppm)', [980, 1020, 1080, 1150, 1200, 1220, 1250], '#FF9F40', 'rgba(255, 159, 64, 0.1)', 'Gas Level (ppm)');

    return () => {
      tempChart.destroy();
      humidityChart.destroy();
      mq2Chart.destroy();
      mq135Chart.destroy();
    };
  }, []);

  // Filters and pagination handlers can be added here
  // For simplicity, just logging changes as in original script

  const handleFilterChange = (e) => {
    console.log("Filter changed:", e.target.name, e.target.value);
  };

  const handleExportClick = () => {
    alert("Export functionality would be implemented here. Data would be downloaded as CSV or PDF.");
  };

  const handlePageClick = (pageNum) => {
    console.log("Page changed to:", pageNum);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[70px] bg-gradient-to-br from-teal-600 to-teal-800 text-white flex items-center justify-between px-6 shadow-md z-[1000] font-poppins">
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="toggle-sidebar bg-none border-none text-white text-xl cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <i className="fas fa-ellipsis-v"></i>
        </button>

        <div className="logo flex items-center gap-2 text-xl font-semibold">
          <i className="fas fa-seedling text-2xl"></i>
          <h1>GrainZillow</h1>
        </div>

        <button
          className="logout-btn bg-white text-teal-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </header>

      <nav className={`sidebar fixed top-0 left-0 bg-white h-screen pt-[90px] shadow-md overflow-x-hidden transition-[width] duration-300 z-[999] ${sidebarExpanded ? 'w-[230px]' : 'w-[70px]'}`}>
        <ul className="list-none">
          {[
            { icon: "fas fa-home", label: "Dashboard" },
            { icon: "fas fa-users", label: "Employee Management" },
            { icon: "fas fa-tasks", label: "Task Assignment" },
            { icon: "fas fa-comments", label: "Message Centre" },
            { icon: "fas fa-history", label: "History Logs", active: true },
            { icon: "fas fa-pen", label: "Manual Grain Entry" },
            { icon: "fas fa-user", label: "My Profile" },
            { icon: "fas fa-info-circle", label: "About Us" },
            { icon: "fas fa-question-circle", label: "FAQs" },
            { icon: "fas fa-phone", label: "Contact Us" }
          ].map(({ icon, label, active }) => (
            <li key={label}>
              <a href="#" className={`flex items-center gap-4 px-5 py-4 text-gray-800 border-l-4 border-transparent transition-colors duration-300 hover:bg-teal-50 hover:border-teal-700 hover:text-teal-900 ${active ? "bg-teal-50 border-teal-700 text-teal-900" : ""}`}>
                <i className={`${icon} w-[22px] text-center text-lg`}></i>
                <span className={`transition-opacity duration-300 ${sidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className={`flex-1 transition-margin duration-300 flex flex-col items-center pt-[90px] px-10 pb-5 ${sidebarExpanded ? "ml-[230px]" : "ml-[70px]"}`}>
        <div className="welcome bg-white p-5 rounded-lg shadow-md mb-8 w-full max-w-[1200px] text-center">
          <h1 className="text-teal-700 text-2xl mb-2">History Logs</h1>
          <p>View historical data and sensor readings from your grain storage facilities</p>
        </div>

        <section className="history-section w-full max-w-[1200px]">
          <div className="history-controls flex justify-between items-center flex-wrap gap-4 mb-5">
            <div className="filter-controls flex gap-4 flex-wrap w-full max-w-[600px]">
              <select
                id="timeFilter"
                name="timeFilter"
                onChange={handleFilterChange}
                defaultValue="week"
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
              <select
                id="sensorFilter"
                name="sensorFilter"
                onChange={handleFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="all">All Sensors</option>
                <option value="temperature">Temperature</option>
                <option value="humidity">Humidity</option>
                <option value="mq2">MQ2 Gas</option>
                <option value="mq135">MQ135 Gas</option>
              </select>
              <input
                type="text"
                id="searchInput"
                name="searchInput"
                placeholder="Search logs..."
                onChange={handleFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm flex-grow min-w-[150px]"
              />
            </div>
            <button
              onClick={handleExportClick}
              className="export-btn bg-teal-700 text-white px-5 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-teal-800 transition"
            >
              <i className="fas fa-download"></i> Export Data
            </button>
          </div>

          <div className="history-table-container bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <table className="history-table w-full border-collapse text-left">
              <thead>
                <tr className="bg-teal-700 text-white font-semibold">
                  <th className="p-4">Date &amp; Time</th>
                  <th className="p-4">Sensor Type</th>
                  <th className="p-4">Reading</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: '2025-01-15 14:30:22', type: 'Temperature', reading: '28.7°C', status: 'Normal', statusClass: 'bg-green-500' },
                  { date: '2025-01-15 14:25:18', type: 'Humidity', reading: '71.3%', status: 'High', statusClass: 'bg-yellow-400' },
                  { date: '2025-01-15 14:20:05', type: 'MQ2 Gas', reading: '1185 ppm', status: 'Normal', statusClass: 'bg-green-500' },
                  { date: '2025-01-15 14:15:42', type: 'MQ135 Gas', reading: '1250 ppm', status: 'Critical', statusClass: 'bg-red-600' },
                  { date: '2025-01-15 14:10:33', type: 'Temperature', reading: '32.1°C', status: 'High', statusClass: 'bg-yellow-400' },
                  { date: '2025-01-15 14:05:27', type: 'Humidity', reading: '65.8%', status: 'Normal', statusClass: 'bg-green-500' },
                  { date: '2025-01-15 14:00:15', type: 'MQ2 Gas', reading: '980 ppm', status: 'Normal', statusClass: 'bg-green-500' },
                  { date: '2025-01-15 13:55:08', type: 'MQ135 Gas', reading: '1105 ppm', status: 'Normal', statusClass: 'bg-green-500' },
                  { date: '2025-01-15 13:50:22', type: 'Temperature', reading: '26.4°C', status: 'Normal', statusClass: 'bg-green-500' },
                  { date: '2025-01-15 13:45:17', type: 'Humidity', reading: '68.9%', status: 'Normal', statusClass: 'bg-green-500' },
                ].map(({ date, type, reading, status, statusClass }, idx) => (
                  <tr key={idx} className="hover:bg-gray-100 border-b border-gray-200">
                    <td className="p-4">{date}</td>
                    <td className="p-4">{type}</td>
                    <td className="p-4">{reading}</td>
                    <td className="p-4 flex items-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${statusClass}`}></span>
                      {status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Graphs Section */}
          <div className="graphs-section grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full">
            {[
              { id: "tempChart", title: "Temperature Trend (Last 7 Days)", ref: tempChartRef },
              { id: "humidityChart", title: "Humidity Trend (Last 7 Days)", ref: humidityChartRef },
              { id: "mq2Chart", title: "MQ2 Gas Level (Last 7 Days)", ref: mq2ChartRef },
              { id: "mq135Chart", title: "MQ135 Gas Level (Last 7 Days)", ref: mq135ChartRef }
            ].map(({ id, title, ref }) => (
              <div key={id} className="graph-card bg-white rounded-lg shadow-md p-5">
                <h3 className="text-teal-700 text-center mb-4">{title}</h3>
                <div className="graph-container" style={{ height: "250px", position: "relative" }}>
                  <canvas id={id} ref={ref}></canvas>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination flex justify-center gap-3 mb-10">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                className={`px-4 py-2 border rounded ${num === 1 ? "bg-teal-700 text-white border-teal-700" : "bg-white border-gray-300"} hover:bg-gray-100`}
                onClick={() => handlePageClick(num)}
                aria-current={num === 1 ? "page" : undefined}
              >
                {num}
              </button>
            ))}
            <button
              className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-100"
              onClick={() => handlePageClick("Next")}
            >
              Next
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-teal-900 text-white text-center py-3 text-sm mt-auto w-full">
        © 2025 GrainZillow — Smart Grain Storage Monitoring System
      </footer>
    </>
  );
}
