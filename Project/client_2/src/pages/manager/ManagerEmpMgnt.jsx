import React, { useState } from "react";
import Layout from "./components/Layout";
import WelcomeSection from "./components/WelcomeSection";
import ContentContainer from "./components/ContentContainer";

const employees = [
  { id: "EMP001", name: "Rahul Sharma", silo: "Silo-A1", task: "Check Fan Connection", status: "Active", remark: "Fan working normally." },
  { id: "EMP002", name: "Priya Singh", silo: "Silo-B3", task: "Verify Temperature Sensor", status: "Pending", remark: "Sensor needs calibration." }
];

const completedWorks = [
  { id: "EMP003", name: "Vikram Patel", task: "Cleaned Moisture Filter", silo: "Silo-C1", date: "21-Oct-2025" },
  { id: "EMP004", name: "Anjali Verma", task: "Checked Gas Sensors", silo: "Silo-A2", date: "19-Oct-2025" }
];

export default function EmployeeManagement() {
  // Shared card width
  const CARD_MAX_WIDTH = "1050px";

  const styles = {
    card: {
      background: "white",
      borderRadius: "28px",
      boxShadow: "0 4px 18px rgba(0,0,0,0.10)",
      padding: "32px 40px",
      marginBottom: "34px",
      maxWidth: CARD_MAX_WIDTH,
      width: "100%",
      marginLeft: "auto",
      marginRight: "auto"
    },
    cardTitle: {
      fontSize: "25px",
      color: "#00897B",
      fontWeight: "700",
      marginBottom: "26px",
      textAlign: "center",
    },
    tableWrap: {
      overflowX: "auto"
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
      fontSize: "16px",
      minWidth: "680px",
      borderRadius: "22px",
      overflow: "hidden"
    },
    th: {
      background: "#00897B",
      color: "white",
      fontWeight: "700",
      padding: "17px 8px",
      border: "none"
    },
    tr: {
      background: "#f2fdfb"
    },
    td: {
      padding: "15px 8px",
      border: "none",
      background: "#f7fafc",
      textAlign: "center",
      fontSize: "16px"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "17px",
      alignItems: "center",
      marginTop: "10px",
      marginBottom: "6px"
    },
    label: {
      display: "block",
      marginBottom: "7px",
      fontSize: "16px",
      color: "#00796B",
      fontWeight: "500",
      textAlign: "center"
    },
    input: {
      width: "90%",
      padding: "15px",
      borderRadius: "16px",
      border: "1.5px solid #B0BEC5",
      fontSize: "17px",
      outline: "none",
      background: "#fcfcfd",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      margin: "0 auto"
    },
    select: {
      width: "90%",
      padding: "15px",
      borderRadius: "16px",
      border: "1.5px solid #B0BEC5",
      fontSize: "17px",
      outline: "none",
      background: "#fcfcfd",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      margin: "0 auto"
    },
    textarea: {
      width: "90%",
      minHeight: "60px",
      padding: "15px",
      borderRadius: "16px",
      border: "1.5px solid #B0BEC5",
      fontSize: "17px",
      outline: "none",
      background: "#fcfcfd",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      margin: "0 auto",
      resize: "vertical"
    },
    submitBtn: {
      marginTop: "10px",
      width: "90%",
      background: "linear-gradient(90deg, #00897B, #00695C)",
      color: "white",
      fontWeight: "700",
      borderRadius: "22px",
      padding: "16px",
      border: "none",
      fontSize: "18px",
      cursor: "pointer",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      transition: "background 0.2s"
    },
    alertGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "36px",
      alignItems: "flex-start",
      width: "100%",
      maxWidth: CARD_MAX_WIDTH,
      marginLeft: "auto",
      marginRight: "auto"
    },
    alertCard: (type = "normal") => ({
      background:
        type === "urgent"
          ? "#fee8e7"
          : type === "warning"
          ? "#fffbe5"
          : "#e0f7fa",
      borderLeft: `6px solid ${
        type === "urgent"
          ? "#d32f2f"
          : type === "warning"
          ? "#fbc02d"
          : "#00897B"
      }`,
      borderRadius: "18px",
      boxShadow: "0 2px 7px rgba(0,0,0,0.08)",
      padding: "18px 22px",
      marginBottom: "18px",
      transition: "background 0.2s"
    }),
    tipBox: {
      textAlign: "center",
      background: "#e0f7fa",
      color: "#00796B",
      fontWeight: "600",
      fontSize: "17px",
      padding: "18px",
      borderRadius: "20px",
      margin: "32px auto 8px auto",
      maxWidth: "640px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
    }
  };

  return (
    <Layout currentPage="Employee Management">
      <ContentContainer>
        <WelcomeSection 
          title="Employee Management"
          subtitle="Manage employee tasks, assignments, and communication"
        />
        
        {/* Employee Task Management Table */}
        <section style={styles.card}>
          <div style={styles.cardTitle}>Employee Task Management</div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ 
                    ...styles.th, 
                    borderTopLeftRadius:"22px"
                  }}>Employee ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Assigned Silo</th>
                  <th style={styles.th}>Task</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Employee Remark</th>
                  <th style={{ 
                    ...styles.th, 
                    borderTopRightRadius:"22px"
                  }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(({ id, name, silo, task, status, remark }, rowIdx, arr) => (
                  <tr
                    key={id}
                    style={{
                      ...styles.tr,
                      ...(rowIdx === arr.length - 1
                        ? {
                            borderBottomLeftRadius: "22px",
                            borderBottomRightRadius: "22px",
                          }
                        : {})
                    }}
                  >
                    <td style={styles.td}>{id}</td>
                    <td style={styles.td}>{name}</td>
                    <td style={styles.td}>{silo}</td>
                    <td style={styles.td}>{task}</td>
                    <td style={{
                      ...styles.td,
                      fontWeight: "700",
                      color: status === "Active" ? "#388e3c" : "#fbc02d"
                    }}>
                      {status}
                    </td>
                    <td style={styles.td}>{remark}</td>
                    <td style={styles.td}>
                      <button 
                        title="Delete Task" 
                        style={{
                          color: "#d32f2f",
                          fontSize: "20px",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          borderRadius:"8px",
                          transition: "transform 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Assign New Task Form */}
        <section style={styles.card}>
          <div style={styles.cardTitle}>Assign New Task</div>
          <form style={{
            display: "flex",
            flexDirection: "column",
            gap: "17px",
            alignItems: "center",
            marginTop: "10px",
            marginBottom: "6px",
          }}>
            {/* Employee ID row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: "28px",
              flexWrap: "wrap",
            }}>
              <label style={{
                minWidth: "140px",
                fontSize: "17px",
                color: "#00796B",
                fontWeight: 500,
                margin: 0,
                textAlign: "right"
              }}>Employee ID</label>
              <input
                type="text"
                style={{
                  flex: "1 1 220px",
                  padding: "15px",
                  borderRadius: "16px",
                  border: "1.5px solid #B0BEC5",
                  fontSize: "17px",
                  outline: "none",
                  background: "#fcfcfd",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  margin: 0,
                }}
                placeholder="Enter Employee ID"
              />
            </div>
            {/* Task Description row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: "28px",
              flexWrap: "wrap",
            }}>
              <label style={{
                minWidth: "140px",
                fontSize: "17px",
                color: "#00796B",
                fontWeight: 500,
                margin: 0,
                textAlign: "right"
              }}>Task Description</label>
              <textarea
                rows="3"
                style={{
                  flex: "1 1 220px",
                  padding: "15px",
                  borderRadius: "16px",
                  border: "1.5px solid #B0BEC5",
                  fontSize: "17px",
                  outline: "none",
                  background: "#fcfcfd",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  margin: 0,
                }}
                placeholder="Describe the task..."
              />
            </div>
            {/* Silo Code row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: "28px",
              flexWrap: "wrap",
            }}>
              <label style={{
                minWidth: "140px",
                fontSize: "17px",
                color: "#00796B",
                fontWeight: 500,
                margin: 0,
                textAlign: "right"
              }}>Silo Code</label>
              <select
                style={{
                  flex: "1 1 220px",
                  padding: "15px",
                  borderRadius: "16px",
                  border: "1.5px solid #B0BEC5",
                  fontSize: "17px",
                  outline: "none",
                  background: "#fcfcfd",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  margin: 0,
                }}
              >
                <option>Silo-A1</option>
                <option>Silo-B3</option>
                <option>Silo-C2</option>
              </select>
            </div>
            <button 
              type="submit" 
              style={styles.submitBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #00695C, #004D40)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #00897B, #00695C)';
              }}
            >
              Assign Task
            </button>
          </form>
        </section>

        {/* Alert & Message System */}
        <section style={styles.card}>
          <div style={{
            ...styles.cardTitle,
            display: "flex", alignItems: "center", gap: "12px", justifyContent: "center"
          }}>
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Alert & Message System
          </div>
          <p style={{ marginBottom: "18px", textAlign:"center" }}>
            Send alerts and messages to employees about critical issues, updates, or tasks.
          </p>
          <div style={styles.alertGrid}>
            {/* Alert Form */}
            <div>
              <div style={{ fontWeight:"700", color:"#00897B", fontSize:"19px", marginBottom:"10px", textAlign:"center" }}>Send New Alert</div>
              <input type="text" placeholder="Enter alert title" style={{...styles.input, marginBottom:"17px"}} />
              <textarea rows={4} placeholder="Enter your message..." style={{...styles.textarea, marginBottom:"17px"}} />
              <label style={styles.label}>Priority</label>
              <div style={{ display:"flex", gap:"14px", justifyContent:"center", marginBottom:"16px" }}>
                {["normal", "warning", "urgent"].map(level => (
                  <div
                    key={level}
                    style={{
                      cursor: "pointer",
                      border: "1px solid #B0BEC5",
                      borderRadius: "16px",
                      padding: "10px 20px",
                      background: level==="urgent"? "#fee8e7" : level==="warning" ? "#fffbe5" : "#e0f7fa",
                      color: level==="urgent"? "#d32f2f" : level==="warning"? "#fbc02d" : "#00897B",
                      textAlign: "center",
                      fontWeight:"600",
                      transition: "transform 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </div>
                ))}
              </div>
              <label style={styles.label}>Send To</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"19px" }}>
                {["All Employees","Rahul Sharma","Priya Singh","Vikram Patel","Anjali Verma"].map(name=>(
                  <label key={name} style={{ display:"flex", alignItems:"center", gap:"8px", fontWeight:"500" }}>
                    <input type="checkbox" defaultChecked={name==="All Employees"} />
                    {name}
                  </label>
                ))}
              </div>
              <button type="button" style={{
                ...styles.submitBtn,
                width:"100%", 
                marginTop:"5px",
                display:"flex", 
                alignItems:"center", 
                justifyContent:"center", 
                gap:"9px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #00695C, #004D40)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #00897B, #00695C)';
              }}
              >
                <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Alert
              </button>
            </div>
            {/* Alert History */}
            <div>
              <div style={{ fontWeight:"700", color:"#00897B", fontSize:"19px", marginBottom:"10px", textAlign:"center" }}>Recent Alerts</div>
              {[
                {
                  title: "Critical Temperature Alert",
                  date: "Today, 10:30 AM",
                  message: "Silo-B3 temperature has exceeded safe limits. Please check immediately.",
                  recipients: "All Employees",
                  type: "urgent"
                },
                {
                  title: "Scheduled Maintenance",
                  date: "Yesterday, 3:15 PM",
                  message: "Preventive maintenance scheduled for Silo-A1 on Friday. Please plan accordingly.",
                  recipients: "Rahul Sharma, Priya Singh",
                  type: "warning"
                },
                {
                  title: "New Safety Protocol",
                  date: "Oct 22, 2025",
                  message: "Please review the updated safety protocols document in the shared folder.",
                  recipients: "All Employees",
                  type: "normal"
                },
                {
                  title: "Gas Sensor Malfunction",
                  date: "Oct 20, 2025",
                  message: "MQ2 sensor in Silo-C2 needs immediate replacement. Avoid area until fixed.",
                  recipients: "Vikram Patel, Anjali Verma",
                  type: "urgent"
                }
              ].map(({ title, date, message, recipients, type }, index) => (
                <div key={index} style={styles.alertCard(type)}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"2px" }}>
                    <div style={{ fontWeight:"700", color:"#00897B" }}>{title}</div>
                    <div style={{ fontSize:"15px", color:"#455A64" }}>{date}</div>
                  </div>
                  <div style={{ color:"#37474F", marginBottom:"4px" }}>{message}</div>
                  <div style={{ color:"#00897B", fontWeight:"600", fontSize:"15px" }}>Sent to: {recipients}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Completed Work History */}
        <section style={styles.card}>
          <div style={styles.cardTitle}>Completed Work History</div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ 
                    ...styles.th, 
                    borderTopLeftRadius:"22px"
                  }}>Employee ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Task Completed</th>
                  <th style={styles.th}>Silo</th>
                  <th style={{ 
                    ...styles.th, 
                    borderTopRightRadius:"22px"
                  }}>Date Completed</th>
                </tr>
              </thead>
              <tbody>
                {completedWorks.map(({ id, name, task, silo, date }, rowIdx, arr) => (
                  <tr
                    key={id}
                    style={{
                      ...styles.tr,
                      ...(rowIdx === arr.length - 1
                        ? {
                            borderBottomLeftRadius: "22px",
                            borderBottomRightRadius: "22px",
                          }
                        : {})
                    }}
                  >
                    <td style={styles.td}>{id}</td>
                    <td style={styles.td}>{name}</td>
                    <td style={styles.td}>{task}</td>
                    <td style={styles.td}>{silo}</td>
                    <td style={styles.td}>{date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tip Box */}
        <div style={styles.tipBox}>
          Tip: Keep updating employee status and completed tasks for better tracking.
        </div>
      </ContentContainer>
    </Layout>
  );
}