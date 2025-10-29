import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import Layout from "./components/Layout";
import WelcomeSection from "./components/WelcomeSection";
import ContentContainer from "./components/ContentContainer";

export default function GrainZillowDashboard() {
  const fanSwitchRef = useRef(null);
  const tempGaugeRef = useRef(null);
  const humGaugeRef = useRef(null);
  const mq2GaugeRef = useRef(null);
  const mq135GaugeRef = useRef(null);

  const getColorAndStatus = (value, thresholds) => {
    if (value >= thresholds.danger) return { color: "#ef4444", status: "DANGER" };
    if (value >= thresholds.warning) return { color: "#f59e0b", status: "WARNING" };
    return { color: "#10b981", status: "SAFE" };
  };

  const createOrUpdateGauge = (ref, value, max, thresholds, unit) => {
    if (!ref.current) return null;
    if (ref.current.chart) {
      ref.current.chart.data.datasets[0].data = [value, max - value];
      const { color, status } = getColorAndStatus(value, thresholds);
      ref.current.chart.data.datasets[0].backgroundColor = [color, "#e5e7eb"];
      ref.current.chart.update();
      return status;
    } else {
      const { color, status } = getColorAndStatus(value, thresholds);
      ref.current.chart = new Chart(ref.current, {
        type: "doughnut",
        data: {
          datasets: [{ 
            data: [value, max - value], 
            backgroundColor: [color, "#e5e7eb"], 
            borderWidth: 0 
          }],
        },
        options: {
          rotation: -90,
          circumference: 180,
          cutout: "70%",
          plugins: { 
            legend: { display: false }, 
            tooltip: { enabled: false } 
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
      return status;
    }
  };

  const [gauges, setGauges] = useState({ 
    temp: 34, 
    hum: 70, 
    mq2: 950, 
    mq135: 1450 
  });
  
  const [statuses, setStatuses] = useState({ 
    temp: "SAFE", 
    hum: "SAFE", 
    mq2: "SAFE", 
    mq135: "WARNING" 
  });

  const [fanOn, setFanOn] = useState(true);

  useEffect(() => {
    setStatuses({
      temp: createOrUpdateGauge(tempGaugeRef, gauges.temp, 100, { warning: 35, danger: 45 }, "°C"),
      hum: createOrUpdateGauge(humGaugeRef, gauges.hum, 100, { warning: 75, danger: 85 }, "%"),
      mq2: createOrUpdateGauge(mq2GaugeRef, gauges.mq2, 2000, { warning: 1200, danger: 1600 }, ""),
      mq135: createOrUpdateGauge(mq135GaugeRef, gauges.mq135, 2000, { warning: 1300, danger: 1700 }, ""),
    });
  }, [gauges]);

  const handleFanToggle = () => {
    setFanOn(!fanOn);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "DANGER": 
        return { color: "#b91c1c", background: "#fef2f2", borderColor: "#fca5a5" };
      case "WARNING": 
        return { color: "#b45309", background: "#fffbeb", borderColor: "#fcd34d" };
      case "SAFE": 
        return { color: "#15803d", background: "#f0fdf4", borderColor: "#86efac" };
      default: 
        return { color: "#374151", background: "#f9fafb", borderColor: "#d1d5db" };
    }
  };

  return (
    <Layout currentPage="Dashboard">
      <ContentContainer>
        <WelcomeSection />
        
        {/* Gauges Grid */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              { ref: tempGaugeRef, label: "Temperature (°C)", value: gauges.temp, status: statuses.temp, key: "temp" },
              { ref: humGaugeRef, label: "Humidity (%)", value: gauges.hum, status: statuses.hum, key: "hum" },
              { ref: mq2GaugeRef, label: "Gas Level (MQ2)", value: gauges.mq2, status: statuses.mq2, key: "mq2" },
              { ref: mq135GaugeRef, label: "Gas Level (MQ135)", value: gauges.mq135, status: statuses.mq135, key: "mq135" },
            ].map(({ ref, label, value, status, key }) => {
              const statusStyles = getStatusStyles(status);
              return (
                <div key={key} style={{
                  background: 'white',
                  borderRadius: '18px',
                  padding: '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#0f766e',
                    margin: '0 0 20px 0',
                    textAlign: 'center',
                    letterSpacing: '0.3px'
                  }}>
                    {label}
                  </h3>
                  <div style={{
                    height: '150px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <canvas ref={ref} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  </div>
                  <div style={{
                    textAlign: 'center',
                    marginTop: 'auto'
                  }}>
                    <div style={{
                      fontSize: '44px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '12px',
                      letterSpacing: '-1px'
                    }}>
                      {value}
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '8px 18px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: '2px solid',
                      ...statusStyles
                    }}>
                      <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        marginRight: '8px',
                        background: status === "DANGER" ? "#ef4444" : status === "WARNING" ? "#f59e0b" : "#10b981"
                      }}></span>
                      {status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Fan Control Section */}
        <section>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '36px 32px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: '30px',
              fontWeight: 'bold',
              color: '#0f766e',
              margin: '0 0 32px 0',
              textAlign: 'center',
              letterSpacing: '0.3px'
            }}>
              Fan Control System
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px'
            }}>
              <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id="fanSwitch"
                  ref={fanSwitchRef}
                  checked={fanOn}
                  style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0 }}
                  onChange={handleFanToggle}
                />
                <div 
                  style={{
                    width: '68px',
                    height: '36px',
                    background: fanOn ? '#0f766e' : '#d1d5db',
                    borderRadius: '18px',
                    position: 'relative',
                    transition: 'background 0.3s',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <div 
                    style={{
                      position: 'absolute',
                      top: '3px',
                      left: fanOn ? '36px' : '3px',
                      width: '30px',
                      height: '30px',
                      background: 'white',
                      borderRadius: '50%',
                      transition: 'left 0.3s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  ></div>
                </div>
              </label>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: fanOn ? '#f0fdf4' : '#fef2f2',
                  color: fanOn ? '#15803d' : '#dc2626',
                  border: fanOn ? '2px solid #86efac' : '2px solid #fca5a5',
                  transition: 'all 0.3s',
                  margin: 0
                }}
              >
                {fanOn ? "Fan is ON" : "Fan is OFF"}
              </p>
            </div>
          </div>
        </section>
      </ContentContainer>
    </Layout>
  );
}