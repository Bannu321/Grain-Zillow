import React, { useState, useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import Layout from "./components/Layout";
import WelcomeSection from "./components/WelcomeSection";
import ContentContainer from "./components/ContentContainer";

// Register Chart.js components
Chart.register(...registerables);

export default function HistoryLogs() {
  const tempChartRef = useRef(null);
  const humidityChartRef = useRef(null);
  const mq2ChartRef = useRef(null);
  const mq135ChartRef = useRef(null);

  // Chart setup
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

    const tempChart = createLineChart(tempChartRef.current.getContext('2d'), 'Temperature (°C)', [26.5, 27.2, 28.9, 30.1, 29.5, 28.7, 28.7], '#FF6384', 'rgba(255, 99, 132, 0.1)', 'Temperature (°C)');
    const humidityChart = createLineChart(humidityChartRef.current.getContext('2d'), 'Humidity (%)', [68.2, 69.5, 70.8, 72.1, 71.3, 70.5, 71.3], '#36A2EB', 'rgba(54, 162, 235, 0.1)', 'Humidity (%)');
    const mq2Chart = createLineChart(mq2ChartRef.current.getContext('2d'), 'MQ2 Gas (ppm)', [1050, 1120, 1080, 1150, 1180, 1165, 1185], '#4BC0C0', 'rgba(75, 192, 192, 0.1)', 'Gas Level (ppm)');
    const mq135Chart = createLineChart(mq135ChartRef.current.getContext('2d'), 'MQ135 Gas (ppm)', [980, 1020, 1080, 1150, 1200, 1220, 1250], '#FF9F40', 'rgba(255, 159, 64, 0.1)', 'Gas Level (ppm)');
    
    return () => {
      tempChart.destroy();
      humidityChart.destroy();
      mq2Chart.destroy();
      mq135Chart.destroy();
    };
  }, []);

  // Dummy handlers
  const handleFilterChange = (e) => {
    console.log("Filter changed:", e.target.name, e.target.value);
  };
  
  const handleExportClick = () => {
    alert("Export functionality would be implemented here. Data would be downloaded as CSV or PDF.");
  };
  
  const handlePageClick = (pageNum) => {
    console.log("Page changed to:", pageNum);
  };

  // Styles - Increased card width
  const MAX_CARD_WIDTH = "1400px"; // Increased from 1200px
  const styles = {
    card: {
      background: "white",
      borderRadius: "26px",
      boxShadow: "0 4px 18px rgba(0,0,0,0.11)",
      padding: "35px 45px", // Increased padding
      marginBottom: "32px",
      width: "100%",
      maxWidth: MAX_CARD_WIDTH,
      marginLeft: "auto",
      marginRight: "auto"
    },
    cardTitle: {
      color: "#00897B",
      fontSize: "28px", // Slightly larger title
      fontWeight: 700,
      marginBottom: "12px",
      textAlign: "center"
    },
    tableWrap: {
      overflowX: "auto"
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
      fontSize: "16px",
      minWidth: "800px", // Increased minimum width
      borderRadius: "20px",
      overflow: "hidden"
    },
    th: {
      background: "#00897B",
      color: "white",
      fontWeight: "700",
      padding: "20px 16px", // Increased padding
      border: "none",
      fontSize: "16px"
    },
    td: {
      padding: "16px 16px", // Increased padding
      border: "none",
      background: "#f7fafc",
      textAlign: "left",
      fontSize: "16px"
    },
    tr: {
      background: "#f2fdfb"
    },
    historyControls: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "20px", // Increased gap
      marginBottom: "25px"
    },
    filterControls: {
      display: "flex",
      gap: "20px", // Increased gap
      flexWrap: "wrap",
      width: "100%",
      maxWidth: "700px", // Increased max width
      alignItems: "center"
    },
    input: {
      padding: "12px 16px", // Increased padding
      borderRadius: "10px",
      border: "1px solid #ccc",
      fontSize: "16px", // Slightly larger font
      outline: "none",
      background: "#fff",
      transition: "border-color 0.2s",
      minWidth: "180px" // Minimum width for inputs
    },
    select: {
      padding: "12px 16px", // Increased padding
      borderRadius: "10px",
      border: "1px solid #ccc",
      fontSize: "16px", // Slightly larger font
      outline: "none",
      background: "#fff",
      transition: "border-color 0.2s",
      minWidth: "180px" // Minimum width for selects
    },
    exportBtn: {
      background: "#00897B",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontWeight: 600,
      padding: "14px 28px", // Increased padding
      fontSize: "16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.09)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "background 0.17s",
      minWidth: "140px" // Minimum width for button
    },
    historyTableContainer: {
      background: "white",
      borderRadius: "20px",
      boxShadow: "0 3px 15px rgba(0,0,0,0.09)",
      overflow: "hidden",
      marginBottom: "35px" // Increased margin
    },
    graphSection: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "28px", // Increased gap
      marginBottom: "40px", // Increased margin
      width: "100%"
    },
    graphCard: {
      background: "white",
      borderRadius: "20px",
      boxShadow: "0 3px 15px rgba(0,0,0,0.09)",
      padding: "28px 26px", // Increased padding
      minWidth: "0"
    },
    graphTitle: {
      color: "#00897B",
      marginBottom: "18px", // Increased margin
      textAlign: "center",
      fontSize: "18px", // Slightly larger
      fontWeight: "600"
    },
    graphContainer: {
      height: "280px", // Increased height for better chart visibility
      position: "relative"
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      gap: "15px", // Increased gap
      marginBottom: "20px"
    },
    pageBtn: (active) => ({
      padding: "12px 22px", // Increased padding
      border: "1px solid",
      borderColor: active ? "#00897B" : "#ccc",
      borderRadius: "10px",
      background: active ? "#00897B" : "#fff",
      color: active ? "white" : "#373737",
      fontWeight: 600,
      cursor: "pointer",
      transition: "background 0.16s, transform 0.2s",
      fontSize: "16px"
    })
  };

  return (
    <Layout currentPage="History Logs">
      <ContentContainer>
        <WelcomeSection 
          title="History Logs"
          subtitle="View historical data and sensor readings from your grain storage facilities"
        />

        <section style={styles.card}>
          {/* Controls */}
          <div style={styles.historyControls}>
            <div style={styles.filterControls}>
              <select
                id="timeFilter"
                name="timeFilter"
                onChange={handleFilterChange}
                defaultValue="week"
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00897B';
                  e.target.style.boxShadow = '0 0 0 2px rgba(0, 137, 123, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ccc';
                  e.target.style.boxShadow = 'none';
                }}
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
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00897B';
                  e.target.style.boxShadow = '0 0 0 2px rgba(0, 137, 123, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ccc';
                  e.target.style.boxShadow = 'none';
                }}
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
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00897B';
                  e.target.style.boxShadow = '0 0 0 2px rgba(0, 137, 123, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ccc';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              onClick={handleExportClick}
              style={styles.exportBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#00695C';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#00897B';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Data
            </button>
          </div>

          {/* Table */}
          <div style={styles.historyTableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{
                    ...styles.th,
                    borderTopLeftRadius:"20px"
                  }}>Date & Time</th>
                  <th style={styles.th}>Sensor Type</th>
                  <th style={styles.th}>Reading</th>
                  <th style={{
                    ...styles.th,
                    borderTopRightRadius:"20px"
                  }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: '2025-01-15 14:30:22', type: 'Temperature', reading: '28.7°C', status: 'Normal', statusClass: '#43a047' },
                  { date: '2025-01-15 14:25:18', type: 'Humidity', reading: '71.3%', status: 'High', statusClass: '#fbc02d' },
                  { date: '2025-01-15 14:20:05', type: 'MQ2 Gas', reading: '1185 ppm', status: 'Normal', statusClass: '#43a047' },
                  { date: '2025-01-15 14:15:42', type: 'MQ135 Gas', reading: '1250 ppm', status: 'Critical', statusClass: '#d32f2f' },
                  { date: '2025-01-15 14:10:33', type: 'Temperature', reading: '32.1°C', status: 'High', statusClass: '#fbc02d' },
                  { date: '2025-01-15 14:05:27', type: 'Humidity', reading: '65.8%', status: 'Normal', statusClass: '#43a047' },
                  { date: '2025-01-15 14:00:15', type: 'MQ2 Gas', reading: '980 ppm', status: 'Normal', statusClass: '#43a047' },
                  { date: '2025-01-15 13:55:08', type: 'MQ135 Gas', reading: '1105 ppm', status: 'Normal', statusClass: '#43a047' },
                  { date: '2025-01-15 13:50:22', type: 'Temperature', reading: '26.4°C', status: 'Normal', statusClass: '#43a047' },
                  { date: '2025-01-15 13:45:17', type: 'Humidity', reading: '68.9%', status: 'Normal', statusClass: '#43a047' },
                ].map(({ date, type, reading, status, statusClass }, idx, arr) => (
                  <tr key={idx} style={{
                    ...styles.tr,
                    ...(idx === arr.length - 1 ? {
                      borderBottomLeftRadius: "20px",
                      borderBottomRightRadius: "20px",
                    } : {})
                  }}>
                    <td style={styles.td}>{date}</td>
                    <td style={styles.td}>{type}</td>
                    <td style={styles.td}>{reading}</td>
                    <td style={{
                      ...styles.td,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px" // Increased gap
                    }}>
                      <span style={{
                        background: statusClass,
                        borderRadius: "50%",
                        width: "12px", // Slightly larger dot
                        height: "12px",
                        display: "inline-block"
                      }}></span>
                      {status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Graphs */}
          <div style={styles.graphSection}>
            {[
              { id: "tempChart", title: "Temperature Trend (Last 7 Days)", ref: tempChartRef },
              { id: "humidityChart", title: "Humidity Trend (Last 7 Days)", ref: humidityChartRef },
              { id: "mq2Chart", title: "MQ2 Gas Level (Last 7 Days)", ref: mq2ChartRef },
              { id: "mq135Chart", title: "MQ135 Gas Level (Last 7 Days)", ref: mq135ChartRef }
            ].map(({ id, title, ref }) => (
              <div key={id} style={styles.graphCard}>
                <h3 style={styles.graphTitle}>{title}</h3>
                <div style={styles.graphContainer}>
                  <canvas id={id} ref={ref}></canvas>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={styles.pagination}>
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                aria-current={num === 1 ? "page" : undefined}
                style={styles.pageBtn(num === 1)}
                onClick={() => handlePageClick(num)}
                onMouseEnter={(e) => {
                  if (num !== 1) {
                    e.currentTarget.style.background = '#f0fdfa';
                    e.currentTarget.style.borderColor = '#00897B';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (num !== 1) {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#ccc';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {num}
              </button>
            ))}
            <button
              style={styles.pageBtn(false)}
              onClick={() => handlePageClick("Next")}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0fdfa';
                e.currentTarget.style.borderColor = '#00897B';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#ccc';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Next
            </button>
          </div>
        </section>
      </ContentContainer>
    </Layout>
  );
}