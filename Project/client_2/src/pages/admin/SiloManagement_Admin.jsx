import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./components/Layout";
import ContentContainer from "./components/ContentContainer";
import TabNavigation from "./components/TabNavigation";
import Alert from "./components/Alert";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";
import DataTable from "./components/DataTable";

// --- Axios instance for consistent base URL ---

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL (adjust if needed)
});


const areas = ["Northern Zone", "Central Zone", "Southern Zone", "Eastern Zone", "Western Zone"];
const managers = ["Rajesh Kumar", "Priya Singh", "Amit Sharma", "Neha Patel", "Vikram Joshi"];

export default function SiloManagement() {
  const [activeTab, setActiveTab] = useState("add-silo");
  const [silos, setSilos] = useState([]);
  const [formData, setFormData] = useState({
    name: "", area: "", code: "", capacity: "", manager: "", status: "active", description: "",
  });
  const [selectedRemoveId, setSelectedRemoveId] = useState("");
  const [alerts, setAlerts] = useState({ success: "", error: "" });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // --- GET all silos from backend ---
  const fetchSilos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/silos");
      // Map backend silo objects to ensure each has an 'id' field based on '_id'
      const normalized = res.data.map((silo) => ({
        ...silo,
        id: silo._id, // copy unique MongoDB ID to 'id' used by frontend logic
      }));
      setSilos(normalized);
    } catch (err) {
      console.error("Fetch error:", err);
      setAlerts({ success: "", error: "Failed to fetch silos from server." });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSilos();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setAlerts({ success: "", error: "" });
    if (tab === "remove-silo") setSelectedRemoveId("");
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // --- POST: Add new silo ---
  const handleAddSilo = async (e) => {
    e.preventDefault();
    const { name, area, code, capacity, manager, status } = formData;
    if (!name || !area || !code || !capacity || !manager || !status) {
      setAlerts({ success: "", error: "Please fill in all required fields." });
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post("/silos", { ...formData, capacity: Number(capacity) });
      setAlerts({ success: "✅ Silo added successfully!", error: "" });
      setFormData({ name: "", area: "", code: "", capacity: "", manager: "", status: "active", description: "" });
      fetchSilos(); // Refresh list after add
    } catch (err) {
      console.error("Add error:", err);
      setAlerts({ success: "", error: err.response?.data?.error || "Failed to add silo." });
    } finally {
      setActionLoading(false);
    }
  };

  // --- DELETE: Remove silo ---
  const handleRemoveSilo = async () => {
    if (!selectedRemoveId) {
      setAlerts({ success: "", error: "Please select a silo to remove." });
      return;
    }
    if (!window.confirm(`Remove silo ${selectedRemoveId}? This cannot be undone.`)) return;

    setActionLoading(true);
    try {
      await api.delete(`/silos/${selectedRemoveId}`);
      setSilos(silos.filter((s) => s._id !== selectedRemoveId)); // ✅ fixed here
      setAlerts({ success: "🗑️ Silo removed successfully!", error: "" });
      fetchSilos();
      setSelectedRemoveId("");
    } catch (err) {
      console.error("Delete error:", err);
      setAlerts({
        success: "",
        error: err.response?.data?.error || "Failed to remove silo.",
      });
    } finally {
      setActionLoading(false);
    }
  };


  // --- DELETE from table row ---
  const handleTableDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to remove ${row.name}?`)) return;
    setActionLoading(true);
    try {
      console.log("Deleting row:", row);
      await api.delete(`/silos/${row._id || row.id}`);
      setAlerts({ success: `🧹 Removed silo ${row.name}.`, error: "" });
      fetchSilos();
    } catch (err) {
      console.error("Delete error:", err);
      setAlerts({ success: "", error: err.response?.data?.error || "Failed to delete silo." });
    } finally {
      setActionLoading(false);
    }
  };


  // (Your tabItems, tableColumns, styles, and JSX stay unchanged below this line)
  // ...

  const selectedSilo = silos.find((s) => s.id === selectedRemoveId);


  // const selectedSilo = silos.find((s) => s.id === selectedRemoveId);

  const tabItems = [
    { id: "add-silo", label: "Add New Silo", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" },
    { id: "remove-silo", label: "Remove Silo", icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" },
    { id: "view-silos", label: "View All Silos", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" }
  ];

  const tableColumns = [
    { key: "id", label: "Silo ID" },
    { key: "name", label: "Name" },
    { key: "area", label: "Area" },
    { key: "code", label: "Code" },
    { key: "manager", label: "Manager" },
    { key: "capacity", label: "Capacity" },
    { key: "status", label: "Status", render: (value) => (
      <span style={{
        display: "inline-block",
        padding: "5px 13px",
        borderRadius: "13px",
        fontWeight: "700",
        color: value === "active" ? "#059669" : value === "inactive" ? "#767676" : "#f59e42",
        background: value === "active" ? "#eafff7" : value === "inactive" ? "#e5e5e5" : "#fff7e6",
        fontSize: "14px",
      }}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </span>
    )},
    { key: "actions", label: "Actions", render: (_, row) => (
      <button
        style={{
          background: "#dc2626",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "6px 19px",
          fontWeight: "600",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
        onClick={() => {
          if (window.confirm(`Are you sure you want to remove ${row.id}?`)) {
            setSilos((prev) => prev.filter((sil) => sil.id !== row.id));
            if (selectedRemoveId === row.id) setSelectedRemoveId("");
          }
        }}
      >
        <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Remove
      </button>
    )}
  ];

  const styles = {
    mainSection: {
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 2px 13px 0 rgba(15,118,110,.09)",
      marginBottom: "36px",
      padding: "30px 28px"
    },
    title: {
      color: "#0f766e",
      fontWeight: "700",
      fontSize: "25px",
      marginBottom: "24px"
    },
    formGrid: {
      display: "grid",
      gap: "23px",
      gridTemplateColumns: "1fr 1fr",
      marginBottom: "18px"
    },
    textarea: {
      width: "100%",
      padding: "11px 14px",
      borderRadius: "7px",
      border: "1.5px solid #e5e7eb",
      fontSize: "15px",
      background: "#fafbfb",
      outline: "none",
      resize: "vertical"
    },
    addButton: {
      background: "#059669",
      color: "#fff",
      fontWeight: "700",
      fontSize: "16px",
      border: "none",
      borderRadius: "8px",
      padding: "12px 27px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: "2px",
      cursor: "pointer",
      transition: "background 0.2s"
    },
    removeSelect: {
      width: "100%",
      padding: "11px 14px",
      borderRadius: "7px",
      border: "1.5px solid #e5e7eb",
      fontSize: "15px",
      background: "#fafbfb",
      outline: "none",
      maxWidth: "420px",
      marginBottom: "14px",
      marginTop: "5px"
    },
    siloDetails: {
      background: "#f5f5ff",
      padding: "15px",
      borderRadius: "7px",
      marginBottom: "10px",
      marginTop: "8px"
    },
    removeButton: {
      background: "#dc2626",
      color: "#fff",
      fontWeight: "700",
      fontSize: "16px",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      marginTop: "2px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "background 0.2s"
    }
  };

  return (
    <Layout currentPage="Silo Management">
      <ContentContainer>
        <section style={styles.mainSection}>
          <h2 style={styles.title}>Silo Management System</h2>
          
          {/* Tab Navigation */}
          <TabNavigation 
            items={tabItems}
            activeTab={activeTab}
            onTabChange={handleTabClick}
          />

          {/* Alerts */}
          {alerts.error && (
            <Alert type="error" message={alerts.error} />
          )}
          {alerts.success && (
            <Alert type="success" message={alerts.success} />
          )}

          {/* Add New Silo Tab */}
          {activeTab === "add-silo" && (
            <form onSubmit={handleAddSilo}>
              <div style={styles.formGrid}>
                <InputField 
                  id="name"
                  label="Silo Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., North Storage A1"
                />
                <SelectField 
                  id="area"
                  label="Area *"
                  value={formData.area}
                  onChange={handleInputChange}
                  options={areas}
                />
                <InputField 
                  id="code"
                  label="Silo Code *"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., GZ-NA1"
                />
                <InputField 
                  id="capacity"
                  label="Capacity (tons) *"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000"
                  min="100"
                />
                <SelectField 
                  id="manager"
                  label="Assigned Manager *"
                  value={formData.manager}
                  onChange={handleInputChange}
                  options={managers}
                />
                <SelectField 
                  id="status"
                  label="Initial Status *"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={["active", "inactive", "maintenance"]}
                />
              </div>
              <div style={{ marginBottom: "23px" }}>
                <label htmlFor="description" style={{ fontWeight: "600", marginBottom: "5px", color: "#374151", display: "block" }}>
                  Description
                </label>
                <textarea
                  id="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Optional description about the silo..."
                  style={styles.textarea}
                />
              </div>
              <button 
                type="submit" 
                style={styles.addButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#047857';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#059669';
                }}
              >
                <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Add Silo to System
              </button>
            </form>
          )}

          {/* Remove Silo Tab */}
          {activeTab === "remove-silo" && (
            <div>
              <label htmlFor="siloToRemove" style={{ fontWeight: "600", marginBottom: "5px", color: "#374151", display: "block" }}>
                Select Silo to Remove *
              </label>
              <select
                id="siloToRemove"
                value={selectedRemoveId}
                onChange={(e) => setSelectedRemoveId(e.target.value)}
                style={styles.removeSelect}
              >
                <option value="">Choose a silo...</option>
                {silos.map((s) => (
                  <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
                ))}
              </select>
              {selectedRemoveId && (
                <div style={styles.siloDetails}>
                  <h4 style={{ fontWeight: "600", color: "#0f766e", marginBottom: "7px" }}>Silo Details:</h4>
                  <div>Name: <b>{selectedSilo?.name}</b></div>
                  <div>Area: <b>{selectedSilo?.area}</b></div>
                  <div>Code: <b>{selectedSilo?.code}</b></div>
                  <div>Manager: <b>{selectedSilo?.manager}</b></div>
                  <div>Status: <b>{selectedSilo?.status}</b></div>
                </div>
              )}
              <button
                onClick={handleRemoveSilo}
                disabled={!selectedRemoveId}
                style={{
                  ...styles.removeButton,
                  opacity: selectedRemoveId ? 1 : 0.7,
                  cursor: selectedRemoveId ? "pointer" : "not-allowed"
                }}
                onMouseEnter={(e) => {
                  if (selectedRemoveId) {
                    e.currentTarget.style.background = '#b91c1c';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedRemoveId) {
                    e.currentTarget.style.background = '#dc2626';
                  }
                }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Selected Silo
              </button>
            </div>
          )}

          {/* View All Silos Tab */}
          {activeTab === "view-silos" && (
            <DataTable
              columns={tableColumns}
              data={silos}
              emptyMessage="No silos available."
            />
          )}
        </section>
      </ContentContainer>
    </Layout>
  );
}