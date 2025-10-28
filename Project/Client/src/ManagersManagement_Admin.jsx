import React, { useState, useEffect } from "react";

const initialManagers = [
  {
    id: "MGR001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@grainzillow.com",
    phone: "+91 9876543210",
    siloId: "SILO-A1",
    password: "password123",
    status: "active",
  },
  {
    id: "MGR002",
    name: "Priya Singh",
    email: "priya.singh@grainzillow.com",
    phone: "+91 9876543211",
    siloId: "SILO-B2",
    password: "password123",
    status: "active",
  },
  {
    id: "MGR003",
    name: "Amit Sharma",
    email: "amit.sharma@grainzillow.com",
    phone: "+91 9876543212",
    siloId: "SILO-C1",
    password: "password123",
    status: "active",
  },
  {
    id: "MGR004",
    name: "Neha Patel",
    email: "neha.patel@grainzillow.com",
    phone: "+91 9876543213",
    siloId: "SILO-D2",
    password: "password123",
    status: "inactive",
  },
];

const availableSilos = [
  "SILO-A1",
  "SILO-A2",
  "SILO-B1",
  "SILO-B2",
  "SILO-B3",
  "SILO-C1",
  "SILO-C2",
  "SILO-D1",
  "SILO-D2",
  "SILO-D3",
];

export default function ManagersManagement() {
  const [activeTab, setActiveTab] = useState("view-managers");
  const [managers, setManagers] = useState(initialManagers);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    siloId: "",
    password: "",
    status: "active",
  });
  const [removeId, setRemoveId] = useState("");
  const [alerts, setAlerts] = useState({ success: "", error: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [idToRemove, setIdToRemove] = useState("");

  // Filtered managers for search
  const filteredManagers = managers.filter(
    (m) =>
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.siloId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setAlerts({ success: "", error: "" });
    if (tab === "add-manager") {
      setFormData({
        id: "",
        name: "",
        email: "",
        phone: "",
        siloId: "",
        password: "",
        status: "active",
      });
    }
    if (tab === "remove-manager") {
      setRemoveId("");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const generateManagerId = () => {
    let num = 1;
    let newId;
    const existingIds = managers.map((m) => m.id);
    do {
      newId = `MGR${String(num).padStart(3, "0")}`;
      num++;
    } while (existingIds.includes(newId));
    setFormData((prev) => ({ ...prev, id: newId }));
  };

  const handleAddManager = (e) => {
    e.preventDefault();
    const { id, name, email, phone, siloId, password, status } = formData;
    if (!id || !name || !email || !phone || !siloId || !password || !status) {
      setAlerts({ error: "Please fill in all required fields.", success: "" });
      return;
    }
    if (managers.find((m) => m.id === id)) {
      setAlerts({ error: "Manager ID already exists.", success: "" });
      return;
    }
    setManagers((prev) => [...prev, { ...formData }]);
    setAlerts({ success: "Manager added successfully!", error: "" });
    setFormData({
      id: "",
      name: "",
      email: "",
      phone: "",
      siloId: "",
      password: "",
      status: "active",
    });
    generateManagerId();
  };

  const handleRemoveManager = () => {
    if (!removeId) {
      setAlerts({ error: "Please enter a valid Manager ID.", success: "" });
      return;
    }
    if (!managers.find((m) => m.id === removeId)) {
      setAlerts({ error: "Manager ID not found.", success: "" });
      return;
    }
    setIdToRemove(removeId);
    setModalVisible(true);
  };

  const confirmRemove = () => {
    setManagers((prev) => prev.filter((m) => m.id !== idToRemove));
    setAlerts({ success: `Manager ${idToRemove} removed successfully!`, error: "" });
    setRemoveId("");
    setModalVisible(false);
  };

  const cancelRemove = () => {
    setModalVisible(false);
    setIdToRemove("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7f5] to-[#f2fdfb] font-poppins p-6 pt-28 md:pt-24 text-gray-800 flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-tr from-teal-600 to-teal-800 text-white flex items-center justify-between px-6 shadow z-20">
        <h1 className="flex items-center gap-3 text-lg font-semibold">
          <i className="fas fa-user-tie"></i> GrainZillow - Managers Management
        </h1>
        <button className="bg-white text-teal-700 rounded px-4 py-1 font-semibold hover:bg-gray-100">Logout</button>
      </header>

      {/* Tabs */}
      <section className="bg-white rounded-lg shadow p-6 flex-grow">
        <h2 className="text-2xl font-semibold text-teal-700 mb-6">Managers Management System</h2>

        <div className="flex gap-4 mb-6 border-b-2 border-gray-200">
          {[
            { id: "view-managers", label: "View All Managers" },
            { id: "add-manager", label: "Add New Manager" },
            { id: "remove-manager", label: "Remove Manager" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`tab-btn py-3 px-6 border-b-4 font-semibold ${
                activeTab === id ? "border-teal-600 text-teal-600" : "border-transparent text-gray-700 hover:text-teal-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {alerts.error && (
          <div className="alert alert-error mb-4 flex items-center gap-2 text-red-700 bg-red-100 p-2 rounded">
            <i className="fas fa-exclamation-circle"></i> {alerts.error}
          </div>
        )}
        {alerts.success && (
          <div className="alert alert-success mb-4 flex items-center gap-2 text-green-700 bg-green-100 p-2 rounded">
            <i className="fas fa-check-circle"></i> {alerts.success}
          </div>
        )}

        {/* View Managers */}
        {activeTab === "view-managers" && (
          <div>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by Manager ID or Silo ID or Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <button
                onClick={() => {} /* filtering is automatic */}
                className="btn bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded font-semibold"
              >
                <i className="fas fa-search mr-2"></i> Search
              </button>
              <button
                onClick={() => setSearchTerm("")}
                className="btn bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded font-semibold"
              >
                <i className="fas fa-redo mr-2"></i> Reset
              </button>
            </div>
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-teal-100 text-teal-900 font-semibold sticky top-0">
                <tr>
                  <th className="border border-gray-300 p-3">Manager ID</th>
                  <th className="border border-gray-300 p-3">Name</th>
                  <th className="border border-gray-300 p-3">Contact</th>
                  <th className="border border-gray-300 p-3">Assigned Silo</th>
                  <th className="border border-gray-300 p-3">Status</th>
                  <th className="border border-gray-300 p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredManagers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-6 text-gray-500">
                      No managers found.
                    </td>
                  </tr>
                ) : (
                  filteredManagers.map((manager) => (
                    <tr key={manager.id} className="border border-gray-200 hover:bg-gray-50">
                      <td className="border p-3 font-semibold">{manager.id}</td>
                      <td className="border p-3">{manager.name}</td>
                      <td className="border p-3">
                        <div>{manager.email}</div>
                        <div className="text-sm text-gray-600">{manager.phone}</div>
                      </td>
                      <td className="border p-3">{manager.siloId}</td>
                      <td className="border p-3">
                        <span
                          className={`status-badge ${
                            manager.status === "active" ? "status-active" : "status-inactive"
                          }`}
                        >
                          {manager.status.charAt(0).toUpperCase() + manager.status.slice(1)}
                        </span>
                      </td>
                      <td className="border p-3">
                        <button
                          className="btn btn-small btn-danger mr-2"
                          onClick={() => {
                            setRemoveId(manager.id);
                            setActiveTab("remove-manager");
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

        {/* Add Manager */}
        {activeTab === "add-manager" && (
          <form onSubmit={handleAddManager} className="space-y-6 max-w-3xl">
            <div className="form-row flex gap-6">
              <div className="form-group flex-grow">
                <label htmlFor="id" className="block mb-2 font-semibold text-gray-700">Manager ID *</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    id="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-secondary bg-teal-500 text-white px-4 rounded"
                    onClick={generateManagerId}
                  >
                    <i className="fas fa-sync-alt mr-1"></i> Generate
                  </button>
                </div>
              </div>
              <Input label="Full Name *" id="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-row flex gap-6">
              <Input label="Email Address *" id="email" type="email" value={formData.email} onChange={handleInputChange} required />
              <Input label="Phone Number *" id="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
            </div>
            <div className="form-row flex gap-6">
              <Select label="Assign Silo *" id="siloId" value={formData.siloId} onChange={handleInputChange} options={availableSilos} required />
              <Select label="Status *" id="status" value={formData.status} onChange={handleInputChange} options={["active", "inactive"]} required />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">Password *</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
                required
              />
            </div>
            <button type="submit" className="btn btn-success bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 font-semibold">
              <i className="fas fa-save mr-2"></i> Add Manager to System
            </button>
          </form>
        )}

        {/* Remove Manager */}
        {activeTab === "remove-manager" && (
          <div>
            <label htmlFor="removeManagerId" className="block mb-2 font-semibold text-gray-700">Manager ID to Remove *</label>
            <input
              type="text"
              id="removeManagerId"
              value={removeId}
              onChange={(e) => setRemoveId(e.target.value.toUpperCase())}
              placeholder="Enter Manager ID (e.g., MGR001)"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 mb-4"
            />
            {removeId && (
              <ManagerPreview manager={managers.find((m) => m.id === removeId)} />
            )}
            <button
              className="btn btn-danger bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 font-semibold"
              onClick={() => {
                if (!removeId || !managers.find((m) => m.id === removeId)) {
                  setAlerts({ success: "", error: "Please enter a valid Manager ID." });
                  return;
                }
                if (window.confirm(`Are you sure you want to remove manager ${removeId}? This action cannot be undone.`)) {
                  setManagers((prev) => prev.filter((m) => m.id !== removeId));
                  setRemoveId("");
                  setAlerts({ success: `Manager ${removeId} removed successfully!`, error: "" });
                }
              }}
            >
              <i className="fas fa-trash mr-2"></i> Remove Manager
            </button>
          </div>
        )}
      </section>

      <footer className="bg-[#004D40] text-white text-center py-3 text-sm rounded-t-lg mt-auto">
        © 2025 GrainZillow | Smart Grain Storage Monitoring System
      </footer>
    </div>
  );
}

function Input({ label, id, value, onChange, type = "text", required = false }) {
  return (
    <div className="form-group flex-grow">
      <label htmlFor={id} className="block mb-2 font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
        required={required}
      />
    </div>
  );
}

function Select({ label, id, value, onChange, options, required = false }) {
  return (
    <div className="form-group flex-grow">
      <label htmlFor={id} className="block mb-2 font-semibold text-gray-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ManagerPreview({ manager }) {
  if (!manager) return <p className="text-red-600 mb-4">No matching manager found.</p>;
  return (
    <div className="bg-gray-100 p-4 rounded mb-4">
      <h4 className="font-semibold mb-2">Manager Details:</h4>
      <p><strong>Name:</strong> {manager.name}</p>
      <p><strong>Email:</strong> {manager.email}</p>
      <p><strong>Phone:</strong> {manager.phone}</p>
      <p><strong>Assigned Silo:</strong> {manager.siloId}</p>
      <p><strong>Status:</strong> {manager.status.charAt(0).toUpperCase() + manager.status.slice(1)}</p>
    </div>
  );
}
