import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";


export default function GrainZillowDashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const fanSwitchRef = useRef(null);
  const fanStatusRef = useRef(null);

  const tempGaugeRef = useRef(null);
  const humGaugeRef = useRef(null);
  const mq2GaugeRef = useRef(null);
  const mq135GaugeRef = useRef(null);

  // Helper to get color and status
  const getColorAndStatus = (value, thresholds) => {
    if (value >= thresholds.danger) return { color: "#e53935", status: "DANGER" };
    if (value >= thresholds.warning) return { color: "#fbc02d", status: "WARNING" };
    return { color: "#43A047", status: "SAFE" };
  };

  // Create gauge chart or update if exists
  const createOrUpdateGauge = (ref, value, max, thresholds, unit) => {
    if (!ref.current) return null;

    if (ref.current.chart) {
      ref.current.chart.data.datasets[0].data = [value, max - value];
      const { color, status } = getColorAndStatus(value, thresholds);
      ref.current.chart.data.datasets[0].backgroundColor = [color, "#eee"];
      ref.current.chart.update();
      return status;
    } else {
      const { color, status } = getColorAndStatus(value, thresholds);
      ref.current.chart = new Chart(ref.current, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: [value, max - value],
              backgroundColor: [color, "#eee"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          rotation: -90,
          circumference: 180,
          cutout: "75%",
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
      return status;
    }
  };

  // State for gauge values and statuses
  const [gauges, setGauges] = useState({
    temp: 34,
    hum: 70,
    mq2: 950,
    mq135: 1450,
  });

  const [statuses, setStatuses] = useState({
    temp: "SAFE",
    hum: "SAFE",
    mq2: "SAFE",
    mq135: "SAFE",
  });

  useEffect(() => {
    setStatuses({
      temp: createOrUpdateGauge(tempGaugeRef, gauges.temp, 100, { warning: 35, danger: 45 }, "°C"),
      hum: createOrUpdateGauge(humGaugeRef, gauges.hum, 100, { warning: 75, danger: 85 }, "%"),
      mq2: createOrUpdateGauge(mq2GaugeRef, gauges.mq2, 2000, { warning: 1200, danger: 1600 }, ""),
      mq135: createOrUpdateGauge(mq135GaugeRef, gauges.mq135, 2000, { warning: 1300, danger: 1700 }, ""),
    });
  }, [gauges]);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Correct: handleFanToggle inside component scope
  const handleFanToggle = () => {
    if (!fanStatusRef.current || !fanSwitchRef.current) return;
    if (fanSwitchRef.current.checked) {
      fanStatusRef.current.textContent = "Fan is ON";
      fanStatusRef.current.style.color = "#43A047";
    } else {
      fanStatusRef.current.textContent = "Fan is OFF";
      fanStatusRef.current.style.color = "#e53935";
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[70px] bg-gradient-to-br from-teal-700 to-teal-900 text-white flex justify-between items-center px-6 shadow-md z-50">
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
          Logout
        </button>
      </header>

      <nav
        className={`sidebar fixed top-0 left-0 h-full bg-white pt-[90px] shadow-md overflow-x-hidden transition-width duration-300 z-40 ${
          sidebarExpanded ? "w-[230px]" : "w-[70px]"
        }`}
      >
        <ul className="list-none p-0 m-0">
          {[
            { icon: "fa-home", label: "Dashboard", active: true },
            { icon: "fa-users", label: "Employee Management" },
            { icon: "fa-tasks", label: "Task Assignment" },
            { icon: "fa-envelope", label: "Message Centre" },
            { icon: "fa-history", label: "History Logs" },
            { icon: "fa-pen", label: "Manual Grain Entry" },
            { icon: "fa-user", label: "My Profile" },
            { icon: "fa-info-circle", label: "About Us" },
            { icon: "fa-question-circle", label: "FAQs" },
            { icon: "fa-phone", label: "Contact Us" },
          ].map(({ icon, label, active }) => (
            <li key={label}>
              <a
                href="#"
                className={`flex items-center px-5 py-4 gap-4 text-gray-800 no-underline border-l-4 ${
                  active
                    ? "bg-[#e0f7f5] border-l-teal-700 text-teal-900 font-semibold"
                    : "border-l-transparent hover:bg-[#e0f7f5] hover:border-l-teal-700 hover:text-teal-900"
                } ${!sidebarExpanded ? "justify-center" : ""}`}
              >
                <i className={`fas ${icon} w-5 text-center text-lg`}></i>
                <span className={`${sidebarExpanded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
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
        <div className="welcome bg-white p-5 rounded-lg shadow-md mb-7 text-center w-full max-w-[900px]">
          <h1 className="text-teal-700 text-2xl mb-2.5">Smart Grain Storage Dashboard</h1>
          <p>Monitor real-time data of your silo — stay informed and take control!</p>
        </div>

        <div className="dashboard grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[900px] justify-items-center">
          <div className="gauge-card bg-white rounded-xl shadow-md p-6 max-w-md w-full text-center transition-transform hover:scale-105">
            <h3 className="text-[#004D40] mb-2 text-lg font-semibold">Temperature (°C)</h3>
            <canvas id="tempGauge" ref={tempGaugeRef} style={{ height: "200px", width: "100%" }}></canvas>
            <div className="gauge-value text-xl font-bold mt-2" id="tempValue"></div>
            <div className="gauge-status font-semibold text-sm uppercase mt-1" id="tempStatus"></div>
          </div>
          <div className="gauge-card bg-white rounded-xl shadow-md p-6 max-w-md w-full text-center transition-transform hover:scale-105">
            <h3 className="text-[#004D40] mb-2 text-lg font-semibold">Humidity (%)</h3>
            <canvas id="humGauge" ref={humGaugeRef} style={{ height: "200px", width: "100%" }}></canvas>
            <div className="gauge-value text-xl font-bold mt-2" id="humValue"></div>
            <div className="gauge-status font-semibold text-sm uppercase mt-1" id="humStatus"></div>
          </div>
          <div className="gauge-card bg-white rounded-xl shadow-md p-6 max-w-md w-full text-center transition-transform hover:scale-105">
            <h3 className="text-[#004D40] mb-2 text-lg font-semibold">Gas Level (MQ2)</h3>
            <canvas id="mq2Gauge" ref={mq2GaugeRef} style={{ height: "200px", width: "100%" }}></canvas>
            <div className="gauge-value text-xl font-bold mt-2" id="mq2Value"></div>
            <div className="gauge-status font-semibold text-sm uppercase mt-1" id="mq2Status"></div>
          </div>
          <div className="gauge-card bg-white rounded-xl shadow-md p-6 max-w-md w-full text-center transition-transform hover:scale-105">
            <h3 className="text-[#004D40] mb-2 text-lg font-semibold">Gas Level (MQ135)</h3>
            <canvas id="mq135Gauge" ref={mq135GaugeRef} style={{ height: "200px", width: "100%" }}></canvas>
            <div className="gauge-value text-xl font-bold mt-2" id="mq135Value"></div>
            <div className="gauge-status font-semibold text-sm uppercase mt-1" id="mq135Status"></div>
          </div>
        </div>

        <section className="control-section bg-white p-6 rounded-xl shadow-md w-full max-w-[600px] mt-10 text-center">
          <h2 className="text-[#004D40] mb-4 text-xl font-semibold">Fan Control</h2>
          <label className="switch inline-block relative w-[70px] h-[36px] cursor-pointer select-none">
            <input
              type="checkbox"
              id="fanSwitch"
              ref={fanSwitchRef}
              defaultChecked
              className="opacity-0 w-0 h-0 peer"
              onChange={handleFanToggle}
            />
            <span className="slider absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-teal-600"></span>
            <span className="slider:before absolute left-[4px] bottom-[4px] w-[28px] h-[28px] bg-white rounded-full transition peer-checked:translate-x-[34px]"></span>
          </label>
          <p id="fanStatus" ref={fanStatusRef} className="mt-4 text-lg font-semibold text-green-600">
            Fan is ON
          </p>
        </section>
      </main>

      <footer className="bg-teal-900 text-white text-center p-3 text-sm mt-auto w-full">
        &copy; 2025 GrainZillow — Smart Grain Storage Monitoring System
      </footer>
    </>
  );
}
