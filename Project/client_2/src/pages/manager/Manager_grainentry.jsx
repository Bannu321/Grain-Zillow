import React, { useState } from "react";
import Layout from "./components/Layout";
import ContentContainer from "./components/ContentContainer";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";
import Button from "./components/Button";
import DataTable from "./components/DataTable";

const initialGrainStorage = {
  wheat: { current: 1250, capacity: 3000 },
  corn: { current: 1800, capacity: 3000 },
  rice: { current: 800, capacity: 2000 },
  barley: { current: 1200, capacity: 2000 },
};

const totalCapacity = 10000;

const initialTransactions = [
  {
    id: 1,
    date: "2025-01-15",
    type: "in",
    grain: "wheat",
    quantity: 500,
    customer: "John Smith",
    client: "AgriCorp Ltd.",
  },
  {
    id: 2,
    date: "2025-01-14",
    type: "out",
    grain: "corn",
    quantity: 300,
    customer: "Green Valley Farms",
    client: "FoodPro Inc.",
  },
  {
    id: 3,
    date: "2025-01-13",
    type: "in",
    grain: "rice",
    quantity: 350,
    customer: "Robert Johnson",
    client: "Rice Distributors",
  },
  {
    id: 4,
    date: "2025-01-12",
    type: "out",
    grain: "barley",
    quantity: 200,
    customer: "Brew Masters Co.",
    client: "Beverage Partners",
  },
];

export default function ManualGrainEntry() {
  const [grainStorage, setGrainStorage] = useState(initialGrainStorage);
  const [transactionHistory, setTransactionHistory] =
    useState(initialTransactions);

  const [form, setForm] = useState({
    transactionType: "",
    grainType: "",
    quantity: "",
    date: new Date().toISOString().split("T")[0],
    customerName: "",
    clientName: "",
    notes: "",
  });

  const totalGrains = Object.values(grainStorage).reduce(
    (sum, g) => sum + g.current,
    0
  );
  const availableSpace = totalCapacity - totalGrains;
  const utilizationPercent = totalCapacity
    ? ((totalGrains / totalCapacity) * 100).toFixed(1)
    : 0;

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      transactionType: "",
      grainType: "",
      quantity: "",
      date: new Date().toISOString().split("T")[0],
      customerName: "",
      clientName: "",
      notes: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      transactionType,
      grainType,
      quantity,
      date,
      customerName,
      clientName,
    } = form;
    const qty = parseInt(quantity, 10);

    if (
      !transactionType ||
      !grainType ||
      !quantity ||
      !date ||
      !customerName ||
      !clientName
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (qty <= 0) {
      alert("Quantity must be positive.");
      return;
    }

    if (transactionType === "out" && qty > grainStorage[grainType].current) {
      alert(
        `Cannot remove ${qty} kg of ${grainType}. Only ${grainStorage[grainType].current} kg available.`
      );
      return;
    }

    if (transactionType === "in") {
      if (qty + totalGrains > totalCapacity) {
        alert(`Adding ${qty} kg exceeds total capacity (${totalCapacity} kg).`);
        return;
      }
      if (
        qty + grainStorage[grainType].current >
        grainStorage[grainType].capacity
      ) {
        alert(
          `Adding ${qty} kg exceeds ${grainType} capacity (${grainStorage[grainType].capacity} kg).`
        );
        return;
      }
    }

    setGrainStorage((prev) => {
      const updated = { ...prev };
      updated[grainType].current =
        transactionType === "in"
          ? prev[grainType].current + qty
          : prev[grainType].current - qty;
      return updated;
    });

    const newTransaction = {
      id: Date.now(),
      date,
      type: transactionType,
      grain: grainType,
      quantity: qty,
      customer: customerName,
      client: clientName,
      notes: form.notes,
    };

    setTransactionHistory((prev) => [newTransaction, ...prev]);

    alert(`Transaction recorded successfully!
Type: ${transactionType === "in" ? "Grain In" : "Grain Out"}
Grain: ${grainType.charAt(0).toUpperCase() + grainType.slice(1)}
Quantity: ${qty} kg
Customer: ${customerName}
Client: ${clientName}`);

    resetForm();
  };

  const getCapacityColor = (percentage) => {
    if (percentage < 60) return "#22c55e";
    if (percentage < 85) return "#facc15";
    return "#dc2626";
  };

  // --- Style objects ---
  const styles = {
    section: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
      padding: "24px",
      marginBottom: "24px",
    },
    sectionTitle: {
      color: "#0d9488",
      fontWeight: "600",
      fontSize: "24px",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    welcomeSection: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
      padding: "24px",
      marginBottom: "24px",
      textAlign: "center",
    },
    welcomeTitle: {
      color: "#0d9488",
      fontWeight: "600",
      fontSize: "28px",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    grid4: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "24px",
      marginBottom: "24px",
    },
    storageCard: {
      backgroundColor: "#f3f4f6",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderLeft: "4px solid #0d9488",
      transition: "transform 0.3s ease",
      cursor: "default",
    },
    storageTitle: {
      color: "#0d9488",
      fontWeight: "600",
      fontSize: "20px",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    storageIcon: {
      color: "#eab308",
      fontSize: "24px",
    },
    storageInfoRow: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "6px",
      color: "#475569",
      fontWeight: "600",
    },
    progressBarBackground: {
      width: "100%",
      height: "12px",
      backgroundColor: "#d1d5db",
      borderRadius: "6px",
      overflow: "hidden",
    },
    progressBarFill: (color, widthPercent) => ({
      height: "100%",
      width: `${widthPercent}%`,
      backgroundColor: color,
      borderRadius: "6px",
      transition: "width 0.5s ease",
    }),
    formGrid3: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "24px",
      marginBottom: "24px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontWeight: "600",
      marginBottom: "8px",
      color: "#475569",
    },
    input: {
      border: "1px solid #cbd5e1",
      borderRadius: "6px",
      padding: "8px 12px",
      fontSize: "16px",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    infoBox: {
      backgroundColor: "#dcfce7",
      border: "1px solid #bbf7d0",
      borderRadius: "6px",
      padding: "16px",
      marginBottom: "24px",
    },
    infoTitle: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#166534",
      fontWeight: "600",
      marginBottom: "8px",
    },
    tableHeader: {
      backgroundColor: "#0d9488",
      color: "white",
    },
    tableHeaderCell: {
      padding: "16px",
      borderBottom: "2px solid #134e4a",
      fontWeight: "600",
      textAlign: "left",
    },
    tableCell: {
      padding: "16px",
      borderBottom: "1px solid #cbd5e1",
    },
    tableRow: {
      cursor: "default",
      transition: "background-color 0.3s ease",
    },
    badgeIn: {
      padding: "4px 12px",
      borderRadius: "9999px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: "#dcfce7",
      color: "#22c55e",
      display: "inline-block",
    },
    badgeOut: {
      padding: "4px 12px",
      borderRadius: "9999px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      display: "inline-block",
    },
    buttonGroup: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      marginTop: "24px",
      gap: "8px",
    },
    pageButton: (active) => ({
      padding: "8px 16px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      backgroundColor: active ? "#0d9488" : "white",
      color: active ? "white" : "#475569",
      cursor: "pointer",
      transition: "all 0.3s ease",
    }),
  };

  // Grain icons mapping
  const grainIcons = {
    wheat: "fas fa-wheat",
    corn: "fas fa-corn",
    rice: "fas fa-rice",
    barley: "fas fa-seedling",
  };

  // Table column configuration
  const transactionColumns = [
    { key: "date", label: "Date" },
    {
      key: "type",
      label: "Type",
      render: (value) => (
        <span style={value === "in" ? styles.badgeIn : styles.badgeOut}>
          {value.toUpperCase()}
        </span>
      ),
    },
    {
      key: "grain",
      label: "Grain Type",
      render: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    { key: "quantity", label: "Quantity (kg)" },
    { key: "customer", label: "Customer" },
    { key: "client", label: "Client" },
  ];

  return (
    <Layout currentPage="Manual Grain Entry" variant="admin">
      <ContentContainer>
        {/* Welcome Section */}
        <section style={styles.welcomeSection}>
          <h1 style={styles.welcomeTitle}>
            <i className="fas fa-pen"></i> Manual Grain Entry
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Manage grain storage, track inventory, and record transactions for
            your assigned silo
          </p>
        </section>

        {/* Total Storage Overview */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <i className="fas fa-chart-pie"></i> Overall Storage Capacity
          </h2>

          <div style={styles.grid4}>
            <div style={styles.storageCard}>
              <h4
                style={{
                  ...styles.storageInfoRow,
                  justifyContent: "center",
                  fontWeight: "600",
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Total Grains Stored
              </h4>
              <div
                style={{
                  ...styles.storageInfoRow,
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "20px",
                  color: "#0d9488",
                }}
              >
                {totalGrains.toLocaleString()} kg
              </div>
            </div>

            <div style={styles.storageCard}>
              <h4
                style={{
                  ...styles.storageInfoRow,
                  justifyContent: "center",
                  fontWeight: "600",
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Maximum Capacity
              </h4>
              <div
                style={{
                  ...styles.storageInfoRow,
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "20px",
                  color: "#0d9488",
                }}
              >
                {totalCapacity.toLocaleString()} kg
              </div>
            </div>

            <div style={styles.storageCard}>
              <h4
                style={{
                  ...styles.storageInfoRow,
                  justifyContent: "center",
                  fontWeight: "600",
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Available Space
              </h4>
              <div
                style={{
                  ...styles.storageInfoRow,
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "20px",
                  color: "#0d9488",
                }}
              >
                {availableSpace.toLocaleString()} kg
              </div>
            </div>

            <div style={styles.storageCard}>
              <h4
                style={{
                  ...styles.storageInfoRow,
                  justifyContent: "center",
                  fontWeight: "600",
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Utilization
              </h4>
              <div
                style={{
                  ...styles.storageInfoRow,
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "20px",
                  color: "#0d9488",
                }}
              >
                {utilizationPercent}%
              </div>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              height: "16px",
              backgroundColor: "#d1d5db",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: "8px",
                transition: "width 0.5s ease",
                backgroundImage:
                  "linear-gradient(to right, #22c55e, #facc15, #dc2626)",
                width: `${utilizationPercent}%`,
              }}
            ></div>
          </div>
        </section>

        {/* Current Grain Storage */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <i className="fas fa-warehouse"></i> Current Grain Storage
          </h2>
          <div style={styles.grid4}>
            {Object.entries(grainStorage).map(
              ([grain, { current, capacity }]) => {
                const percent = (current / capacity) * 100;
                const barColor = getCapacityColor(percent);

                return (
                  <div
                    key={grain}
                    style={styles.storageCard}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-4px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <h3 style={styles.storageTitle}>
                      <i
                        className={grainIcons[grain]}
                        style={styles.storageIcon}
                      ></i>
                      {grain.charAt(0).toUpperCase() + grain.slice(1)} Storage
                    </h3>
                    <div style={styles.storageInfoRow}>
                      <span>Current Quantity:</span>
                      <span>{current.toLocaleString()} kg</span>
                    </div>
                    <div style={styles.storageInfoRow}>
                      <span>Capacity:</span>
                      <span>{capacity.toLocaleString()} kg</span>
                    </div>
                    <div style={styles.progressBarBackground}>
                      <div style={styles.progressBarFill(barColor, percent)} />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* Grain Transaction Entry Form */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <i className="fas fa-edit"></i> Grain Transaction Entry
          </h2>

          <div style={styles.infoBox}>
            <h4 style={styles.infoTitle}>
              <i className="fas fa-info-circle"></i> Assigned Silo
            </h4>
            <p style={{ color: "#166534", margin: 0 }}>
              All transactions will be recorded for your assigned silo:{" "}
              <strong>Main Storage Facility</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} onReset={resetForm}>
            <div style={styles.formGrid3}>
              <div style={styles.formGroup}>
                <SelectField
                  label="Transaction Type"
                  value={form.transactionType}
                  onChange={(e) => onInputChange(e)}
                  name="transactionType"
                  options={[
                    { value: "", label: "Select Type" },
                    { value: "in", label: "Grain In (Addition)" },
                    { value: "out", label: "Grain Out (Removal)" },
                  ]}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <SelectField
                  label="Grain Type"
                  value={form.grainType}
                  onChange={(e) => onInputChange(e)}
                  name="grainType"
                  options={[
                    { value: "", label: "Select Grain" },
                    { value: "wheat", label: "Wheat" },
                    { value: "corn", label: "Corn" },
                    { value: "rice", label: "Rice" },
                    { value: "barley", label: "Barley" },
                  ]}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <InputField
                  label="Quantity (kg)"
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={(e) => onInputChange(e)}
                  placeholder="Enter quantity in kg"
                  min="1"
                  required
                />
              </div>
            </div>

            <div style={styles.formGrid3}>
              <div style={styles.formGroup}>
                <InputField
                  label="Transaction Date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <InputField
                  label="Customer/Farmer Name"
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={(e) => onInputChange(e)}
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <InputField
                  label="Client/Company Name"
                  type="text"
                  name="clientName"
                  value={form.clientName}
                  onChange={(e) => onInputChange(e)}
                  placeholder="Enter client/company name"
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <InputField
                label="Notes (Optional)"
                type="text"
                name="notes"
                value={form.notes}
                onChange={(e) => onInputChange(e)}
                placeholder="Additional notes about this transaction"
              />
            </div>

            <div style={styles.buttonGroup}>
              <Button variant="primary" icon="fa-save" type="submit">
                Save Transaction
              </Button>
              <Button variant="secondary" icon="fa-redo" type="reset">
                Reset Form
              </Button>
            </div>
          </form>
        </section>

        {/* Transaction History */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <i className="fas fa-history"></i> Transaction History
          </h2>

          <DataTable
            columns={transactionColumns}
            data={transactionHistory}
            headerStyle={styles.tableHeaderCell}
            rowStyle={styles.tableRow}
            tableStyle={{
              width: "100%",
              borderCollapse: "collapse",
              color: "#374151",
            }}
          />

          {/* Pagination UI */}
          <div style={styles.pagination}>
            {["1", "2", "3", "4", "5", "Next"].map((label) => (
              <button
                key={label}
                style={styles.pageButton(label === "1")}
                onMouseEnter={(e) => {
                  if (label !== "1") {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (label !== "1") {
                    e.currentTarget.style.backgroundColor = "white";
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </ContentContainer>
    </Layout>
  );
}
