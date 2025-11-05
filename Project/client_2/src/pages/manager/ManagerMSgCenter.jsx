import React, { useState } from "react";
import Layout from "./components/Layout";
import ContentContainer from "./components/ContentContainer";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";
import Button from "./components/Button";
import DataTable from "./components/DataTable";

const initialMessages = [
  {
    id: 1,
    sender: "Admin 1",
    role: "Administrator",
    message: "Update temperature sensors before next cycle.",
    date: "23-Oct-2025 09:45 AM",
    priority: "urgent",
    status: "Pending",
  },
  {
    id: 2,
    sender: "Employee - Rahul",
    role: "Worker",
    message: "Task completed for Silo-A1.",
    date: "22-Oct-2025 07:20 PM",
    priority: "normal",
    status: "Read",
  },
];

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

const employeesList = [
  { id: "emp1", name: "Rahul Sharma (EMP001)" },
  { id: "emp2", name: "Priya Singh (EMP002)" },
  { id: "emp3", name: "Vikram Patel (EMP003)" },
  { id: "emp4", name: "Anjali Verma (EMP004)" },
];

export default function MessageCentre() {
  const [recipientType, setRecipientType] = useState("all");
  const [priority, setPriority] = useState("urgent");
  const [recipientCheckboxes, setRecipientCheckboxes] = useState({
    emp1: true,
    emp2: false,
    emp3: false,
    emp4: false,
  });
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [sentMessages, setSentMessages] = useState([]);
  const [newTask, setNewTask] = useState({
    employeeId: "",
    taskDescription: "",
    siloCode: "Silo-A1",
  });

  const handlePriorityClick = (level) => setPriority(level);

  const handleRecipientChange = (id) => {
    setRecipientCheckboxes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSendMessage = () => {
    if (!messageSubject || !messageContent) {
      alert("Please fill subject and message");
      return;
    }

    const now = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const newSentMessage = {
      id: Date.now(),
      recipient:
        recipientType === "all"
          ? "All Employees"
          : employeesList
              .filter((emp) => recipientCheckboxes[emp.id])
              .map((emp) => emp.name)
              .join(", "),
      role: recipientType,
      message: messageSubject,
      content: messageContent,
      date: now,
      status: "Sent",
      priority: priority,
    };

    setSentMessages((prev) => [newSentMessage, ...prev]);

    // Add to incoming messages for demo
    setMessages((prev) => [
      {
        id: Date.now() + 1,
        sender: "You",
        role: "Administrator",
        message: messageSubject,
        date: now,
        priority: priority,
        status: "Sent",
      },
      ...prev,
    ]);

    alert(
      `Message sent successfully!\nSubject: ${messageSubject}\nTo: ${
        recipientType === "all" ? "All Employees" : "Selected Employees"
      }`
    );

    // Reset form
    setMessageSubject("");
    setMessageContent("");
    setPriority("urgent");
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!newTask.employeeId || !newTask.taskDescription) {
      alert("Please fill all required fields");
      return;
    }
    alert(
      `Task assigned successfully!\nEmployee: ${newTask.employeeId}\nTask: ${newTask.taskDescription}\nSilo: ${newTask.siloCode}`
    );

    // Reset form
    setNewTask({
      employeeId: "",
      taskDescription: "",
      siloCode: "Silo-A1",
    });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      console.log("Deleting task:", taskId);
      // In a real app, you would update the state or make an API call here
    }
  };

  const handleTaskInputChange = (field, value) => {
    setNewTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // --- Style objects ---
  const styles = {
    section: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      padding: "24px",
      marginBottom: "24px",
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "16px",
      color: "#0d9488",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    subsectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
      color: "#0d9488",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    formGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "600",
      color: "#0d9488",
    },
    input: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "8px 12px",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.2s",
    },
    textarea: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "8px 12px",
      fontSize: "14px",
      minHeight: "100px",
      resize: "vertical",
      outline: "none",
      transition: "border-color 0.2s",
      fontFamily: "inherit",
    },
    select: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "8px 12px",
      fontSize: "14px",
      backgroundColor: "white",
      outline: "none",
      transition: "border-color 0.2s",
    },
    priorityButtons: {
      display: "flex",
      gap: "12px",
      marginBottom: "16px",
    },
    priorityButton: (active) => ({
      cursor: "pointer",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "8px 16px",
      textAlign: "center",
      userSelect: "none",
      backgroundColor: active ? "#d1fae5" : "transparent",
      borderColor: active ? "#0d9488" : "#d1d5db",
      color: active ? "#0d9488" : "#374151",
      transition: "all 0.3s ease",
      flex: 1,
      fontWeight: "600",
    }),
    buttonGroup: {
      display: "flex",
      gap: "12px",
      marginBottom: "24px",
      flexWrap: "wrap",
    },
    messageCard: (priority) => {
      const priorityStyles = {
        urgent: {
          borderLeft: "4px solid #dc2626",
          backgroundColor: "#fee2e2",
          color: "#7f1d1d",
        },
        warning: {
          borderLeft: "4px solid #facc15",
          backgroundColor: "#fef3c7",
          color: "#78350f",
        },
        normal: {
          borderLeft: "4px solid #0d9488",
          backgroundColor: "#d1fae5",
          color: "#064e3b",
        },
      };
      return {
        padding: "16px",
        marginBottom: "16px",
        borderRadius: "4px",
        ...priorityStyles[priority],
      };
    },
    statusBadge: (status) => ({
      backgroundColor: status === "Sent" ? "#d1fae5" : "#f3f4f6",
      color: status === "Sent" ? "#166534" : "#374151",
      borderRadius: "4px",
      padding: "4px 8px",
      fontWeight: "600",
      display: "inline-block",
      fontSize: "12px",
    }),
    tableHeader: {
      backgroundColor: "#0d9488",
      color: "white",
    },
    tableHeaderCell: {
      padding: "12px",
      border: "1px solid #cbd5e1",
      textAlign: "center",
      fontWeight: "600",
    },
    tableCell: {
      padding: "12px",
      border: "1px solid #cbd5e1",
      textAlign: "center",
    },
    tableRow: {
      backgroundColor: "#f5fffd",
    },
    statusText: (status) => ({
      color: status === "Active" ? "#16a34a" : "#ca8a04",
      fontWeight: "700",
    }),
    deleteButton: {
      color: "#dc2626",
      cursor: "pointer",
      background: "none",
      border: "none",
      fontSize: "16px",
      transition: "color 0.2s",
    },
    twoColumnLayout: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
      marginBottom: "24px",
    },
    checkboxGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginBottom: "16px",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      fontSize: "14px",
    },
    noMessages: {
      textAlign: "center",
      color: "#6b7280",
      padding: "32px",
      fontStyle: "italic",
    },
    messageHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "8px",
    },
    messageSender: {
      fontWeight: "bold",
      fontSize: "14px",
    },
    messageDate: {
      fontSize: "12px",
      color: "#6b7280",
    },
    messageContent: {
      marginBottom: "8px",
      fontSize: "14px",
      lineHeight: "1.4",
    },
    messageRole: {
      fontSize: "12px",
      color: "#0d9488",
      fontWeight: "600",
    },
  };

  // Focus styles for better accessibility
  const focusStyles = {
    input: {
      ":focus": {
        borderColor: "#0d9488",
        boxShadow: "0 0 0 3px rgba(13, 148, 136, 0.1)",
      },
    },
  };

  // Table column configurations
  const taskTableColumns = [
    { key: "id", label: "Employee ID" },
    { key: "name", label: "Name" },
    { key: "silo", label: "Assigned Silo" },
    { key: "task", label: "Task" },
    {
      key: "status",
      label: "Status",
      render: (value) => <span style={styles.statusText(value)}>{value}</span>,
    },
    { key: "remark", label: "Employee Remark" },
    {
      key: "actions",
      label: "Delete",
      render: (_, row) => (
        <button
          title="Delete Task"
          style={styles.deleteButton}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#b91c1c")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#dc2626")}
          onClick={() => handleDeleteTask(row.id)}
        >
          <i className="fas fa-trash"></i>
        </button>
      ),
    },
  ];

  const sentMessagesColumns = [
    { key: "recipient", label: "Receiver" },
    { key: "role", label: "Role" },
    { key: "message", label: "Message" },
    { key: "date", label: "Date & Time" },
    {
      key: "status",
      label: "Status",
      render: (value) => <span style={styles.statusBadge(value)}>{value}</span>,
    },
  ];

  return (
    <Layout currentPage="Message Centre" variant="admin">
      <ContentContainer>
        <div style={styles.twoColumnLayout}>
          {/* Employee Task Management */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <i className="fas fa-users"></i> Employee Task Management
            </h2>
            <DataTable
              columns={taskTableColumns}
              data={employeeTasks}
              headerStyle={styles.tableHeaderCell}
              rowStyle={styles.tableRow}
            />
          </section>

          {/* Assign New Task */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <i className="fas fa-tasks"></i> Assign New Task
            </h2>
            <form onSubmit={handleAssignTask}>
              <div style={styles.formGroup}>
                <InputField
                  label="Employee ID"
                  placeholder="Enter Employee ID (e.g., EMP001)"
                  value={newTask.employeeId}
                  onChange={(e) =>
                    handleTaskInputChange("employeeId", e.target.value)
                  }
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Task Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the task in detail..."
                  style={styles.textarea}
                  value={newTask.taskDescription}
                  onChange={(e) =>
                    handleTaskInputChange("taskDescription", e.target.value)
                  }
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Silo Code</label>
                <select
                  style={styles.select}
                  value={newTask.siloCode}
                  onChange={(e) =>
                    handleTaskInputChange("siloCode", e.target.value)
                  }
                >
                  <option value="Silo-A1">Silo-A1</option>
                  <option value="Silo-B3">Silo-B3</option>
                  <option value="Silo-C2">Silo-C2</option>
                  <option value="Silo-D4">Silo-D4</option>
                </select>
              </div>
              <Button variant="primary" type="submit" icon="fa-plus">
                Assign Task
              </Button>
            </form>
          </section>
        </div>

        {/* Alert & Message System */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <i className="fas fa-bullhorn"></i> Alert & Message System
          </h2>

          {/* Send New Alert */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={styles.subsectionTitle}>Send New Alert</h3>

            <div style={styles.formGroup}>
              <InputField
                label="Message Subject"
                placeholder="Enter alert title"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Message Content</label>
              <textarea
                rows={4}
                placeholder="Enter your message content here..."
                style={styles.textarea}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Priority Level</label>
              <div style={styles.priorityButtons}>
                {[
                  { level: "normal", label: "Normal", color: "#0d9488" },
                  { level: "warning", label: "Warning", color: "#facc15" },
                  { level: "urgent", label: "Urgent", color: "#dc2626" },
                ].map(({ level, label, color }) => (
                  <div
                    key={level}
                    onClick={() => handlePriorityClick(level)}
                    style={styles.priorityButton(priority === level)}
                    onMouseEnter={(e) => {
                      if (priority !== level) {
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                        e.currentTarget.style.borderColor = color;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (priority !== level) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.borderColor = "#d1d5db";
                      }
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Recipient Type</label>
              <select
                style={styles.select}
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
              >
                <option value="all">All Employees</option>
                <option value="managers">Managers Only</option>
                <option value="selected">Selected Employees</option>
              </select>
            </div>

            {recipientType === "selected" && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Employees</label>
                <div style={styles.checkboxGroup}>
                  {employeesList.map((employee) => (
                    <label key={employee.id} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={recipientCheckboxes[employee.id]}
                        onChange={() => handleRecipientChange(employee.id)}
                        style={{ cursor: "pointer" }}
                      />
                      {employee.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div style={styles.buttonGroup}>
              <Button
                variant="primary"
                icon="fa-paper-plane"
                onClick={handleSendMessage}
                buttonStyle={{ minWidth: "140px" }}
              >
                Send Message
              </Button>
              <Button
                variant="secondary"
                icon="fa-save"
                onClick={() => {
                  if (messageSubject || messageContent) {
                    alert("Draft saved successfully!");
                    setMessageSubject("");
                    setMessageContent("");
                  } else {
                    alert("No content to save as draft.");
                  }
                }}
                buttonStyle={{ minWidth: "140px" }}
              >
                Save Draft
              </Button>
              <Button
                variant="outline"
                icon="fa-times"
                onClick={() => {
                  setMessageSubject("");
                  setMessageContent("");
                  setPriority("urgent");
                }}
                buttonStyle={{ minWidth: "140px" }}
              >
                Clear Form
              </Button>
            </div>
          </div>

          {/* Incoming Messages */}
          <h3 style={styles.subsectionTitle}>
            <i className="fas fa-inbox"></i> Incoming Messages
          </h3>
          {messages.length === 0 ? (
            <div style={styles.noMessages}>No incoming messages</div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} style={styles.messageCard(msg.priority)}>
                <div style={styles.messageHeader}>
                  <div style={styles.messageSender}>{msg.sender}</div>
                  <div style={styles.messageDate}>{msg.date}</div>
                </div>
                <div style={styles.messageContent}>{msg.message}</div>
                <div style={styles.messageRole}>
                  Role: {msg.role} • Status: {msg.status}
                </div>
              </div>
            ))
          )}

          {/* Sent Messages */}
          <h3 style={{ ...styles.subsectionTitle, marginTop: "32px" }}>
            <i className="fas fa-paper-plane"></i> Sent Messages
          </h3>
          {sentMessages.length === 0 ? (
            <div style={styles.noMessages}>No sent messages yet</div>
          ) : (
            <DataTable
              columns={sentMessagesColumns}
              data={sentMessages}
              headerStyle={styles.tableHeaderCell}
              rowStyle={styles.tableRow}
            />
          )}
        </section>
      </ContentContainer>
    </Layout>
  );
}
