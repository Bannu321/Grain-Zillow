import React, { useState } from "react";
import Layout from "./components/Layout";
import ContentContainer from "./components/ContentContainer";
import Button from "./components/Button";
import DataTable from "./components/DataTable";

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
  const [priority, setPriority] = useState("warning");
  const [allEmployeesSelected, setAllEmployeesSelected] = useState(true);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  // --- Style objects ---
  const styles = {
    section: {
      backgroundColor: "white",
      borderRadius: "0.5rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      padding: "1.5rem",
      marginBottom: "1.5rem",
    },
    sectionTitle: {
      color: "#2c7a7b",
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    tipBox: {
      backgroundColor: "#b2f5ea",
      color: "#2c7a7b",
      padding: "1rem",
      borderRadius: "0.375rem",
      textAlign: "center",
      fontWeight: "600",
      marginBottom: "1.5rem",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: "#2c7a7b",
      color: "white",
      textAlign: "center",
    },
    tableHeaderCell: {
      padding: "0.75rem",
      border: "1px solid #cbd5e0",
      fontWeight: "600",
    },
    tableCell: {
      padding: "0.75rem",
      border: "1px solid #cbd5e0",
      textAlign: "center",
    },
    tableRow: {
      backgroundColor: "#f5fffd",
    },
    statusActive: {
      color: "#38a169",
      fontWeight: "bold",
    },
    statusPending: {
      color: "#d69e2e",
      fontWeight: "bold",
    },
    deleteButton: {
      color: "#e53e3e",
      fontSize: "1.125rem",
      cursor: "pointer",
      background: "none",
      border: "none",
      transition: "color 0.3s",
    },
    formGroup: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "600",
      color: "#4a5568",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      border: "1px solid #cbd5e0",
      borderRadius: "0.375rem",
      fontSize: "1rem",
    },
    textarea: {
      width: "100%",
      padding: "0.5rem",
      border: "1px solid #cbd5e0",
      borderRadius: "0.375rem",
      fontSize: "1rem",
      minHeight: "100px",
      resize: "vertical",
    },
    select: {
      width: "100%",
      padding: "0.5rem",
      border: "1px solid #cbd5e0",
      borderRadius: "0.375rem",
      fontSize: "1rem",
      backgroundColor: "white",
    },
    checkboxGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      cursor: "pointer",
    },
    formActions: {
      display: "flex",
      gap: "1rem",
      marginTop: "1.5rem",
    },
    twoColumnLayout: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
      marginBottom: "1.5rem",
    },
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      // Handle task deletion logic here
      console.log("Deleting task:", taskId);
    }
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    // Handle task assignment logic here
    alert("Task assigned successfully!");
  };

  const taskTableColumns = [
    { key: "id", label: "Employee ID" },
    { key: "name", label: "Name" },
    { key: "silo", label: "Assigned Silo" },
    { key: "task", label: "Task" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          style={
            value === "Active" ? styles.statusActive : styles.statusPending
          }
        >
          {value}
        </span>
      ),
    },
    { key: "remark", label: "Employee Remark" },
    {
      key: "actions",
      label: "Delete",
      render: (_, row) => (
        <button
          title="Delete Task"
          style={styles.deleteButton}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#9b2c2c")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#e53e3e")}
          onClick={() => handleDeleteTask(row.id)}
        >
          <i className="fas fa-trash"></i>
        </button>
      ),
    },
  ];

  const completedWorkColumns = [
    { key: "id", label: "Employee ID" },
    { key: "name", label: "Name" },
    { key: "task", label: "Task" },
    { key: "silo", label: "Silo" },
    { key: "date", label: "Completion Date" },
  ];

  return (
    <Layout currentPage="Task Assignment" variant="admin">
      <ContentContainer>
        {/* Tip Box */}
        <div style={styles.tipBox}>
          Tip: Keep updating employee status and completed tasks for better
          tracking.
        </div>

        <div style={styles.twoColumnLayout}>
          {/* Assign New Task Section */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <i className="fas fa-tasks"></i> Assign New Task
            </h2>
            <form onSubmit={handleAssignTask}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Task Title</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Task Description</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Enter detailed task description"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Assigned Silo</label>
                <select style={styles.select} required>
                  <option value="">Select Silo</option>
                  <option value="Silo-A1">Silo-A1</option>
                  <option value="Silo-B3">Silo-B3</option>
                  <option value="Silo-C1">Silo-C1</option>
                  <option value="Silo-A2">Silo-A2</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Priority Level</label>
                <select style={styles.select} required>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Assign To</label>
                <div style={styles.checkboxGroup}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={allEmployeesSelected}
                      onChange={(e) =>
                        setAllEmployeesSelected(e.target.checked)
                      }
                    />
                    All Available Employees
                  </label>
                  <label style={styles.checkboxLabel}>
                    <input type="checkbox" />
                    Rahul Sharma (EMP001)
                  </label>
                  <label style={styles.checkboxLabel}>
                    <input type="checkbox" />
                    Priya Singh (EMP002)
                  </label>
                  <label style={styles.checkboxLabel}>
                    <input type="checkbox" />
                    Vikram Patel (EMP003)
                  </label>
                  <label style={styles.checkboxLabel}>
                    <input type="checkbox" />
                    Anjali Verma (EMP004)
                  </label>
                </div>
              </div>

              <div style={styles.formActions}>
                <Button variant="primary" icon="fa-plus" type="submit">
                  Assign Task
                </Button>
                <Button variant="secondary" icon="fa-times" type="button">
                  Clear Form
                </Button>
              </div>
            </form>
          </section>

          {/* Task Statistics Section */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <i className="fas fa-chart-bar"></i> Task Statistics
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  backgroundColor: "#f0fff4",
                  borderRadius: "0.5rem",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#38a169",
                  }}
                >
                  4
                </div>
                <div style={{ color: "#2d3748" }}>Total Tasks</div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  backgroundColor: "#fffaf0",
                  borderRadius: "0.5rem",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#d69e2e",
                  }}
                >
                  1
                </div>
                <div style={{ color: "#2d3748" }}>Pending</div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  backgroundColor: "#f0fff4",
                  borderRadius: "0.5rem",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#38a169",
                  }}
                >
                  2
                </div>
                <div style={{ color: "#2d3748" }}>Completed</div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  backgroundColor: "#fff5f5",
                  borderRadius: "0.5rem",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#e53e3e",
                  }}
                >
                  1
                </div>
                <div style={{ color: "#2d3748" }}>Overdue</div>
              </div>
            </div>
          </section>
        </div>

        {/* Employee Task Management */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <i className="fas fa-users"></i> Employee Task Management
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  {taskTableColumns.map((column) => (
                    <th key={column.key} style={styles.tableHeaderCell}>
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employeeTasks.map((task) => (
                  <tr key={task.id} style={styles.tableRow}>
                    {taskTableColumns.map((column) => (
                      <td key={column.key} style={styles.tableCell}>
                        {column.render
                          ? column.render(task[column.key], task)
                          : task[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Completed Work Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <i className="fas fa-check-circle"></i> Completed Work
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  {completedWorkColumns.map((column) => (
                    <th key={column.key} style={styles.tableHeaderCell}>
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {completedWork.map((work) => (
                  <tr key={work.id} style={styles.tableRow}>
                    {completedWorkColumns.map((column) => (
                      <td key={column.key} style={styles.tableCell}>
                        {work[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ContentContainer>
    </Layout>
  );
}
