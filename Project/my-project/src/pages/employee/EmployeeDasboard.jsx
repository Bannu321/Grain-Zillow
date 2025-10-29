import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function EmployeeDashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const tempGaugeRef = useRef(null);
  const humGaugeRef = useRef(null);
  const mq2GaugeRef = useRef(null);
  const mq135GaugeRef = useRef(null);
  const charts = useRef({});

  // Helper to get color and status based on thresholds
  function getColorAndStatus(value, thresholds) {
    if (value >= thresholds.danger) return { color: "#e53935", status: "DANGER" };
    if (value >= thresholds.warning) return { color: "#fbc02d", status: "WARNING" };
    return { color: "#43A047", status: "SAFE" };
  }

  // Create or update gauge chart
  function createOrUpdateGauge(id, chartRef, value, max, thresholds) {
    const { color, status } = getColorAndStatus(value, thresholds);

    if (charts.current[id]) {
      charts.current[id].data.datasets[0].data = [value, max - value];
      charts.current[id].data.datasets[0].backgroundColor = [color, "#eee"];
      charts.current[id].update();
    } else {
      charts.current[id] = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          datasets: [{
            data: [value, max - value],
            backgroundColor: [color, "#eee"],
            borderWidth: 0,
          }]
        },
        options: {
          rotation: -90,
          circumference: 180,
          cutout: "75%",
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
        }
      });
    }
    return status;
  }

  // State for gauge values and statuses
  const [gauges, setGauges] = useState({
    temp: 32,
    hum: 68,
    mq2: 850,
    mq135: 1100,
  });

  const [statuses, setStatuses] = useState({
    temp: "SAFE",
    hum: "SAFE",
    mq2: "SAFE",
    mq135: "SAFE",
  });

  // Update charts when gauges change
  useEffect(() => {
    const tempStatus = createOrUpdateGauge("tempGauge", tempGaugeRef, gauges.temp, 100, { warning: 35, danger: 45 });
    const humStatus = createOrUpdateGauge("humGauge", humGaugeRef, gauges.hum, 100, { warning: 75, danger: 85 });
    const mq2Status = createOrUpdateGauge("mq2Gauge", mq2GaugeRef, gauges.mq2, 2000, { warning: 1200, danger: 1600 });
    const mq135Status = createOrUpdateGauge("mq135Gauge", mq135GaugeRef, gauges.mq135, 2000, { warning: 1300, danger: 1700 });

    setStatuses({
      temp: tempStatus,
      hum: humStatus,
      mq2: mq2Status,
      mq135: mq135Status,
    });
  }, [gauges]);

  // Determine overall status
  function getOverallStatus() {
    if (Object.values(statuses).includes("DANGER")) return "DANGER";
    if (Object.values(statuses).includes("WARNING")) return "WARNING";
    return "SAFE";
  }

  // Effect to simulate data updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setGauges((prev) => {
        const newTemp = Math.min(40, Math.max(25, prev.temp + (Math.random() - 0.5) * 2));
        const newHum = Math.min(100, Math.max(50, prev.hum + (Math.random() - 0.5) * 5));
        const newMq2 = Math.min(2000, Math.max(500, prev.mq2 + (Math.random() - 0.5) * 100));
        const newMq135 = Math.min(2000, Math.max(700, prev.mq135 + (Math.random() - 0.5) * 100));

        return {
          temp: parseFloat(newTemp.toFixed(1)),
          hum: parseFloat(newHum.toFixed(1)),
          mq2: Math.round(newMq2),
          mq135: Math.round(newMq135),
        };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header>
        <button className="toggle-sidebar" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
          <i className="fas fa-ellipsis-v"></i>
        </button>
        <div className="logo">
          <i className="fas fa-seedling"></i>
          <h1>GrainZillow</h1>
        </div>
        <button className="logout-btn">Logout</button>
      </header>

      <nav className={`sidebar ${sidebarExpanded ? "expanded" : ""}`} id="sidebar">
        <ul>
          <li>
            <a href="/employee" className="active">
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/my-tasks">
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

      <main id="content" className={sidebarExpanded ? "expanded" : ""}>
        <div className="welcome">
          <h1>Employee Dashboard</h1>
          <p>Monitor your assigned silo and stay informed about environmental conditions</p>
        </div>

        <div className="silo-info">
          <div className="silo-header">
            <h2 className="silo-title">Silo B-12 - Northern Facility</h2>
            <div className={`status-indicator ${
              getOverallStatus() === "SAFE" ? "status-safe" :
              getOverallStatus() === "WARNING" ? "status-warning" : "status-danger"
            }`} id="overallStatus">
              {getOverallStatus()}
            </div>
          </div>
          <div className="silo-details">
            <div className="detail-item">
              <h4>Assigned Employee</h4>
              <p>Amit Kumar</p>
            </div>
            <div className="detail-item">
              <h4>Silo Capacity</h4>
              <p>10,000 kg</p>
            </div>
            <div className="detail-item">
              <h4>Current Storage</h4>
              <p>6,500 kg (65%)</p>
            </div>
            <div className="detail-item">
              <h4>Last Inspection</h4>
              <p>Today, 09:15 AM</p>
            </div>
          </div>
        </div>

        <div className="grains-section">
          <h3><i className="fas fa-wheat-alt"></i> Grains Storage Details</h3>
          <div className="grains-grid">
            <div className="grain-item grain-wheat">
              <div className="grain-header">
                <div className="grain-icon icon-wheat">
                  <i className="fas fa-bread-slice"></i>
                </div>
                <div className="grain-name">Wheat</div>
              </div>
              <div className="grain-stats">
                <div className="grain-quantity">3,000 kg</div>
                <div className="grain-percentage">30% of capacity</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill progress-wheat" style={{ width: "45%" }}></div>
              </div>
            </div>
            <div className="grain-item grain-rice">
              <div className="grain-header">
                <div className="grain-icon icon-rice">
                  <i className="fas fa-seedling"></i>
                </div>
                <div className="grain-name">Rice</div>
              </div>
              <div className="grain-stats">
                <div className="grain-quantity">2,000 kg</div>
                <div className="grain-percentage">20% of capacity</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill progress-rice" style={{ width: "30%" }}></div>
              </div>
            </div>
            <div className="grain-item grain-corn">
              <div className="grain-header">
                <div className="grain-icon icon-corn">
                  <i className="fas fa-corn"></i>
                </div>
                <div className="grain-name">Corn</div>
              </div>
              <div className="grain-stats">
                <div className="grain-quantity">1,000 kg</div>
                <div className="grain-percentage">10% of capacity</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill progress-corn" style={{ width: "15%" }}></div>
              </div>
            </div>
            <div className="grain-item grain-barley">
              <div className="grain-header">
                <div className="grain-icon icon-barley">
                  <i className="fas fa-wheat-awn"></i>
                </div>
                <div className="grain-name">Barley</div>
              </div>
              <div className="grain-stats">
                <div className="grain-quantity">500 kg</div>
                <div className="grain-percentage">5% of capacity</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill progress-barley" style={{ width: "10%" }}></div>
              </div>
            </div>
          </div>
          <div className="total-capacity">
            <h4>Total Storage Utilization</h4>
            <p>6,500 kg / 10,000 kg (65%)</p>
          </div>
        </div>

        <div className="dashboard">
          <div className="gauge-card">
            <h3>Temperature (°C)</h3>
            <canvas id="tempGauge" ref={tempGaugeRef}></canvas>
            <div className="gauge-value" style={{ color: getColorAndStatus(gauges.temp, { warning: 35, danger: 45 }).color }}>
              {gauges.temp}°C
            </div>
            <div className="gauge-status" style={{ color: getColorAndStatus(gauges.temp, { warning: 35, danger: 45 }).color }}>
              {statuses.temp}
            </div>
          </div>
          <div className="gauge-card">
            <h3>Humidity (%)</h3>
            <canvas id="humGauge" ref={humGaugeRef}></canvas>
            <div className="gauge-value" style={{ color: getColorAndStatus(gauges.hum, { warning: 75, danger: 85 }).color }}>
              {gauges.hum}%
            </div>
            <div className="gauge-status" style={{ color: getColorAndStatus(gauges.hum, { warning: 75, danger: 85 }).color }}>
              {statuses.hum}
            </div>
          </div>
          <div className="gauge-card">
            <h3>Gas Level (MQ2)</h3>
            <canvas id="mq2Gauge" ref={mq2GaugeRef}></canvas>
            <div className="gauge-value" style={{ color: getColorAndStatus(gauges.mq2, { warning: 1200, danger: 1600 }).color }}>
              {gauges.mq2}
            </div>
            <div className="gauge-status" style={{ color: getColorAndStatus(gauges.mq2, { warning: 1200, danger: 1600 }).color }}>
              {statuses.mq2}
            </div>
          </div>
          <div className="gauge-card">
            <h3>Gas Level (MQ135)</h3>
            <canvas id="mq135Gauge" ref={mq135GaugeRef}></canvas>
            <div className="gauge-value" style={{ color: getColorAndStatus(gauges.mq135, { warning: 1300, danger: 1700 }).color }}>
              {gauges.mq135}
            </div>
            <div className="gauge-status" style={{ color: getColorAndStatus(gauges.mq135, { warning: 1300, danger: 1700 }).color }}>
              {statuses.mq135}
            </div>
          </div>
        </div>

        <div className="alerts-section">
          <h2><i className="fas fa-bell"></i> Recent Alerts</h2>
          <div className="alert-item alert-normal">
            <i className="fas fa-check-circle alert-icon"></i>
            <div className="alert-content">
              <div className="alert-title">All systems operating normally</div>
              <div className="alert-time">Updated 5 minutes ago</div>
            </div>
          </div>
          <div className="alert-item alert-warning">
            <i className="fas fa-exclamation-triangle alert-icon"></i>
            <div className="alert-content">
              <div className="alert-title">Rice compartment humidity slightly elevated</div>
              <div className="alert-time">Today, 10:30 AM</div>
            </div>
          </div>
          <div className="alert-item alert-normal">
            <i className="fas fa-info-circle alert-icon"></i>
            <div className="alert-content">
              <div className="alert-title">Ventilation system activated for wheat section</div>
              <div className="alert-time">Yesterday, 02:15 PM</div>
            </div>
          </div>
        </div>
      </main>

      <footer>© 2025 GrainZillow — Smart Grain Storage Monitoring System</footer>

      <style>{`
        /* Add your CSS here, or import it externally */
      `}</style>
    </>
  );
}
