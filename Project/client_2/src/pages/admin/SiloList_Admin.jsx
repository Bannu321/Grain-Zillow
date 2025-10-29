import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import ContentContainer from "./components/ContentContainer";
import SiloCard from "./components/SiloCard";
import SensorReading from "./components/SensorReading";
import AlertSection from "./components/AlertSection";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Express backend base URL
});

function SiloList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [silos, setSilos] = useState([]);
  const [filteredSilos, setFilteredSilos] = useState([]);
  const [selectedSiloId, setSelectedSiloId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch silos from backend
  const fetchSilos = async () => {
    try {
      const res = await api.get("/silos");
      setSilos(res.data);
      setFilteredSilos(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching silos:", err);
      setError("Failed to load silo data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSilos();
  }, []);

  // Filter silos based on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSilos(silos);
    } else {
      const term = searchTerm.trim().toLowerCase();
      const filtered = silos.filter(
        (silo) =>
          silo.name.toLowerCase().includes(term) ||
          silo.area.toLowerCase().includes(term) ||
          silo.manager.toLowerCase().includes(term)
      );
      setFilteredSilos(filtered);
    }
  }, [searchTerm, silos]);

  const selectedSilo = selectedSiloId
    ? silos.find((s) => s._id === selectedSiloId)
    : null;

  // --- Style objects (same as before) ---
  const styles = {
    searchSection: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: "24px",
      marginBottom: "24px",
    },
    searchTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#0f766e",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    searchInput: {
      flex: 1,
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      outline: "none",
      transition: "border-color 0.2s",
    },
    searchButton: {
      background: "#0f766e",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "background 0.2s",
    },
    siloListSection: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: "24px",
      marginBottom: "24px",
      maxHeight: "400px",
      overflow: "auto",
    },
    siloListTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "16px",
    },
    siloGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "16px",
    },
    noSilos: {
      gridColumn: "1 / -1",
      textAlign: "center",
      color: "#ef4444",
      padding: "20px",
    },
    detailsSection: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: "24px",
    },
    detailsTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#0f766e",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "24px",
      marginBottom: "24px",
    },
    infoItem: {
      borderLeft: "4px solid #0f766e",
      paddingLeft: "16px",
    },
    infoLabel: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#6b7280",
      marginBottom: "4px",
    },
    infoValue: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#0f766e",
    },
    sensorsTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#0f766e",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    sensorsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    },
    statusBanner: {
      background: "#f8fafc",
      padding: "20px",
      borderRadius: "8px",
      textAlign: "center",
      marginBottom: "24px",
      border: "1px solid #e5e7eb",
    },
    statusText: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    statusDescription: {
      color: "#6b7280",
      fontSize: "16px",
    },
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "safe":
        return {
          text: "✅ ALL SYSTEMS NORMAL",
          description: "All sensor readings are within safe parameters.",
          color: "#10b981",
        };
      case "warning":
        return {
          text: "⚠ NEEDS ATTENTION",
          description:
            "Some parameters require monitoring and possible intervention.",
          color: "#f59e0b",
        };
      case "danger":
        return {
          text: "🚨 CRITICAL ALERT",
          description:
            "Immediate action required! Critical conditions detected.",
          color: "#ef4444",
        };
      default:
        return {
          text: "❓ UNKNOWN STATUS",
          description: "Status information not available.",
          color: "#6b7280",
        };
    }
  };

  if (loading) return <p>Loading silos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Layout currentPage="Silo List">
      {" "}
      <ContentContainer>
        {/* Search Section */}{" "}
        <section style={styles.searchSection}>
          {" "}
          <h2 style={styles.searchTitle}>🔍 Search Silo</h2>
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
            <input
              type="text"
              placeholder="Type to filter silos below..."
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              style={styles.searchButton}
              onClick={() => {
                if (filteredSilos.length === 1) {
                  setSelectedSiloId(filteredSilos[0]._id);
                } else if (searchTerm.trim()) {
                  alert("Please select a silo from the list.");
                }
              }}
            >
              Search{" "}
            </button>{" "}
          </div>{" "}
        </section>
        ```
        {/* All Silos List */}
        <section style={styles.siloListSection}>
          <h3 style={styles.siloListTitle}>All Silos</h3>
          <div style={styles.siloGrid}>
            {filteredSilos.length === 0 ? (
              <div style={styles.noSilos}>No silos found.</div>
            ) : (
              filteredSilos.map((silo) => (
                <SiloCard
                  key={silo._id}
                  id={silo._id}
                  silo={silo}
                  isSelected={selectedSiloId === silo._id}
                  onSelect={() => setSelectedSiloId(silo._id)}
                />
              ))
            )}
          </div>
        </section>
        {/* Silo Details Section */}
        {selectedSilo && (
          <section style={styles.detailsSection}>
            <h3 style={styles.detailsTitle}>
              Silo Details - {selectedSilo.name}
            </h3>

            {/* Silo Information */}
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Silo Name</div>
                <div style={styles.infoValue}>{selectedSilo.name}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Area</div>
                <div style={styles.infoValue}>{selectedSilo.area}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Silo Code</div>
                <div style={styles.infoValue}>{selectedSilo.code}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Manager</div>
                <div style={styles.infoValue}>{selectedSilo.manager}</div>
              </div>
            </div>

            {/* Sensor Readings */}
            <h4 style={styles.sensorsTitle}>Sensor Readings</h4>
            <div style={styles.sensorsGrid}>
              {selectedSilo.sensors &&
                Object.entries(selectedSilo.sensors).map(([type, data]) => (
                  <SensorReading
                    key={type}
                    type={type}
                    label={type.toUpperCase()}
                    value={data.value}
                    unit={
                      type === "temperature"
                        ? "°C"
                        : type === "humidity"
                        ? "%"
                        : ""
                    }
                    status={data.status}
                    color="#0f766e"
                  />
                ))}
            </div>

            {/* Overall Status */}
            <div style={styles.statusBanner}>
              <div
                style={{
                  ...styles.statusText,
                  color: getStatusDisplay(selectedSilo.overallStatus).color,
                }}
              >
                {getStatusDisplay(selectedSilo.overallStatus).text}
              </div>
              <div style={styles.statusDescription}>
                {getStatusDisplay(selectedSilo.overallStatus).description}
              </div>
            </div>

            {/* Alert Section */}
            <AlertSection
              siloId={selectedSilo._id}
              siloName={selectedSilo.name}
            />
          </section>
        )}
      </ContentContainer>
    </Layout>
  );
}

export default SiloList;
