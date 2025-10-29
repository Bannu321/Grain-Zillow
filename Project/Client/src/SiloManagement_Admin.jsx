import React, { useState, useEffect } from "react";

const initialSilos = [
  {
    id: "SILO-A1",
    name: "North Storage A1",
    area: "Northern Zone",
    code: "GZ-NA1",
    manager: "Rajesh Kumar",
    capacity: 1500,
    status: "active",
    description: "Primary wheat storage",
  },
  {
    id: "SILO-B2",
    name: "Central Storage B2",
    area: "Central Zone",
    code: "GZ-CB2",
    manager: "Priya Singh",
    capacity: 2000,
    status: "active",
    description: "Rice storage facility",
  },
  {
    id: "SILO-C3",
    name: "Southern Storage C3",
    area: "Southern Zone",
    code: "GZ-SC3",
    manager: "Amit Sharma",
    capacity: 1200,
    status: "maintenance",
    description: "Under maintenance until next week",
  },
  {
    id: "SILO-D4",
    name: "Eastern Storage D4",
    area: "Eastern Zone",
    code: "GZ-ED4",
    manager: "Neha Patel",
    capacity: 1800,
    status: "inactive",
    description: "Reserve storage - currently empty",
  },
];

const areas = [
  "Northern Zone",
  "Central Zone",
  "Southern Zone",
  "Eastern Zone",
  "Western Zone",
];

const managers = [
  "Rajesh Kumar",
  "Priya Singh",
  "Amit Sharma",
  "Neha Patel",
  "Vikram Joshi",
];

export default function SiloManagement() {
  const [activeTab, setActiveTab] = useState("add-silo");
  const [silos, setSilos] = useState(initialSilos);
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    code: "",
    capacity: "",
    manager: "",
    status: "active",
    description: "",
  });
  const [selectedRemoveId, setSelectedRemoveId] = useState("");
  const [alerts, setAlerts] = useState({ success: "", error: "" });

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setAlerts({ success: "", error: "" });
    if (tab === "remove-silo") {
      setSelectedRemoveId("");
    }
  };

  // Form input change handler
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Add Silo form submission
  const handleAddSilo = (e) => {
    e.preventDefault();
    const { name, area, code, capacity, manager, status } = formData;
    if (!name || !area || !code || !capacity || !manager || !status) {
      setAlerts({ success: "", error: "Please fill in all required fields." });
      return;
    }
    // Generate unique Silo ID: e.g., SILOA1 (from area first letter + numeric increment)
    const areaCode = area.charAt(0).toUpperCase();
    let maxNum = 0;
    silos.forEach(({ id }) => {
      const match = id.match(new RegExp(`SILO${areaCode}(\\d+)`));
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const newId = `SILO${areaCode}${maxNum + 1}`;

    const newSilo = {
      id: newId,
      ...formData,
      capacity: Number(capacity),
    };

    setSilos((prev) => [...prev, newSilo]);
    setAlerts({ success: "Silo added successfully!", error: "" });
    setFormData({
      name: "",
      area: "",
      code: "",
      capacity: "",
      manager: "",
      status: "active",
      description: "",
    });
  };

  // Remove Silo handler
  const handleRemoveSilo = () => {
    if (!selectedRemoveId) {
      setAlerts({ success: "", error: "Please select a silo to remove." });
      return;
    }
    if (!window.confirm(`Are you sure you want to remove ${selectedRemoveId}? This action cannot be undone.`)) {
      return;
    }
    setSilos((prev) => prev.filter((s) => s.id !== selectedRemoveId));
    setAlerts({ success: `Silo ${selectedRemoveId} removed successfully!`, error: "" });
    setSelectedRemoveId("");
  };

  const selectedSilo = silos.find((s) => s.id === selectedRemoveId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7f5] to-[#f2fdfb] font-poppins text-gray-800 p-6 pt-28 md:pt-24 flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-tr from-teal-600 to-teal-800 text-white flex items-center justify-between px-6 shadow z-20">
        <h1 className="text-lg flex items-center gap-3 font-semibold">
          <i className="fas fa-warehouse"></i> GrainZillow - Silo Management
        </h1>
        <button className="bg-white text-teal-700 rounded px-4 py-1 font-semibold hover:bg-gray-100">
          Logout
        </button>
      </header>

      {/* Sidebar can go here as needed */}

      <section className="bg-white rounded-lg shadow p-6 flex-grow">
        <h2 className="text-2xl font-semibold text-teal-700 mb-4">Silo Management System</h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b-2 border-gray-200">
          {[
            { id: "add-silo", label: "Add New Silo", icon: "fa-plus-circle" },
            { id: "remove-silo", label: "Remove Silo", icon: "fa-trash-alt" },
            { id: "view-silos", label: "View All Silos", icon: "fa-list" },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              className={`tab-btn py-3 px-6 border-b-4 font-semibold ${
                activeTab === id ? "border-teal-600 text-teal-600" : "border-transparent text-gray-700 hover:text-teal-600"
              }`}
              onClick={() => handleTabClick(id)}
            >
              <i className={`fas ${icon} mr-2`}></i> {label}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {alerts.error && (
          <div className="alert alert-error mb-4 flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i> {alerts.error}
          </div>
        )}
        {alerts.success && (
          <div className="alert alert-success mb-4 flex items-center gap-2">
            <i className="fas fa-check-circle"></i> {alerts.success}
          </div>
        )}

        {/* Add New Silo Tab */}
        {activeTab === "add-silo" && (
          <form onSubmit={handleAddSilo} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField id="name" label="Silo Name *" value={formData.name} onChange={handleInputChange} placeholder="e.g., North Storage A1" />
              <SelectField id="area" label="Area *" value={formData.area} onChange={handleInputChange} options={areas} />
              <InputField id="code" label="Silo Code *" value={formData.code} onChange={handleInputChange} placeholder="e.g., GZ-NA1" />
              <InputField id="capacity" label="Capacity (tons) *" type="number" value={formData.capacity} onChange={handleInputChange} placeholder="e.g., 1000" min="100" />
              <SelectField id="manager" label="Assigned Manager *" value={formData.manager} onChange={handleInputChange} options={managers} />
              <SelectField
                id="status"
                label="Initial Status *"
                value={formData.status}
                onChange={handleInputChange}
                options={["active", "inactive", "maintenance"]}
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 font-semibold text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional description about the silo..."
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <button type="submit" className="btn btn-success px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold">
              <i className="fas fa-save mr-2"></i> Add Silo to System
            </button>
          </form>
        )}

        {/* Remove Silo Tab */}
        {activeTab === "remove-silo" && (
          <div>
            <label htmlFor="siloToRemove" className="block mb-2 font-semibold text-gray-700">Select Silo to Remove *</label>
            <select
              id="siloToRemove"
              value={selectedRemoveId}
              onChange={(e) => setSelectedRemoveId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4"
            >
              <option value="">Choose a silo...</option>
              {silos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} - {s.name}
                </option>
              ))}
            </select>
            {selectedRemoveId && (
              <div className="bg-gray-100 p-4 rounded mb-4">
                <h4 className="font-semibold mb-2">Silo Details:</h4>
                <p><strong>Name:</strong> {silos.find(s => s.id === selectedRemoveId)?.name}</p>
                <p><strong>Area:</strong> {silos.find(s => s.id === selectedRemoveId)?.area}</p>
                <p><strong>Code:</strong> {silos.find(s => s.id === selectedRemoveId)?.code}</p>
                <p><strong>Manager:</strong> {silos.find(s => s.id === selectedRemoveId)?.manager}</p>
                <p><strong>Status:</strong> {silos.find(s => s.id === selectedRemoveId)?.status}</p>
              </div>
            )}
            <button
              className="btn btn-danger bg-red-600 text-white rounded px-5 py-3 hover:bg-red-700 font-semibold disabled:opacity-50"
              onClick={handleRemoveSilo}
              disabled={!selectedRemoveId}
            >
              <i className="fas fa-trash mr-2"></i> Remove Selected Silo
            </button>
          </div>
        )}

        {/* View All Silos Tab */}
        {activeTab === "view-silos" && (
          <div>
            <table className="silos-table w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-semibold">
                  <th className="p-3 border border-gray-300">Silo ID</th>
                  <th className="p-3 border border-gray-300">Name</th>
                  <th className="p-3 border border-gray-300">Area</th>
                  <th className="p-3 border border-gray-300">Code</th>
                  <th className="p-3 border border-gray-300">Manager</th>
                  <th className="p-3 border border-gray-300">Capacity</th>
                  <th className="p-3 border border-gray-300">Status</th>
                  <th className="p-3 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {silos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-6 text-gray-500">
                      No silos available.
                    </td>
                  </tr>
                ) : (
                  silos.map((s) => (
                    <tr key={s.id} className="border border-gray-200 hover:bg-gray-50">
                      <td className="border p-3">{s.id}</td>
                      <td className="border p-3">{s.name}</td>
                      <td className="border p-3">{s.area}</td>
                      <td className="border p-3">{s.code}</td>
                      <td className="border p-3">{s.manager}</td>
                      <td className="border p-3">{s.capacity}</td>
                      <td className="border p-3">
                        <span className={
                          s.status === "active"
                            ? "status-badge status-active"
                            : s.status === "inactive"
                            ? "status-badge status-inactive"
                            : "status-badge status-maintenance"
                        }>
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </span>
                      </td>
                      <td className="border p-3">
                        <button
                          className="btn btn-danger bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${s.id}?`)) {
                              setSilos((prev) => prev.filter((sil) => sil.id !== s.id));
                              if (selectedRemoveId === s.id) setSelectedRemoveId("");
                            }
                          }}
                        >
                          <i className="fas fa-trash"></i> Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="bg-[#004D40] text-white text-center py-3 text-sm rounded-t-lg mt-auto">
        © 2025 GrainZillow | Smart Grain Storage Monitoring System
      </footer>
    </div>
  );
}

function InputField({ id, label, value, onChange, type = "text", placeholder, min }) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="block mb-2 font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
        required
      />
    </div>
  );
}

function SelectField({ id, label, value, onChange, options }) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="block mb-2 font-semibold text-gray-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
        required
      >
        <option value="">Select</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
