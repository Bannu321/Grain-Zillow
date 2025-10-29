import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const siloDatabase = {
  "SILO-A1": {
    name: "North Storage A1",
    area: "Northern Zone",
    code: "GZ-NA1",
    manager: "Rajesh Kumar",
    sensors: {
      temperature: { value: 32, status: "warning" },
      humidity: { value: 68, status: "safe" },
      mq2: { value: 850, status: "safe" },
      mq135: { value: 1200, status: "safe" },
    },
    overallStatus: "warning",
  },
  // Add other silos similarly
  "SILO-A2": {
    name: "North Storage A2",
    area: "Northern Zone",
    code: "GZ-NA2",
    manager: "Rajesh Kumar",
    sensors: {
      temperature: { value: 28, status: "safe" },
      humidity: { value: 65, status: "safe" },
      mq2: { value: 780, status: "safe" },
      mq135: { value: 1100, status: "safe" },
    },
    overallStatus: "safe",
  },
  // ...add all other silos
};

function getStatusClass(status) {
  switch (status) {
    case "safe":
      return "bg-green-100 text-green-700";
    case "warning":
      return "bg-yellow-100 text-yellow-700";
    case "danger":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function SiloList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSilos, setFilteredSilos] = useState(Object.entries(siloDatabase));
  const [selectedSiloId, setSelectedSiloId] = useState(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSilos(Object.entries(siloDatabase));
    } else {
      const term = searchTerm.trim().toUpperCase();
      const filtered = Object.entries(siloDatabase).filter(
        ([id, silo]) =>
          id.includes(term) ||
          silo.name.toUpperCase().includes(term) ||
          silo.manager.toUpperCase().includes(term)
      );
      setFilteredSilos(filtered);
    }
  }, [searchTerm]);

  const selectedSilo = selectedSiloId ? siloDatabase[selectedSiloId] : null;

  const sendAlert = () => {
    if (!selectedSiloId) {
      alert("Please select a silo to send an alert.");
      return;
    }
    const priority = document.getElementById("alertPriority").value;
    const recipient = document.getElementById("alertRecipient").value;
    const message = document.getElementById("alertMessage").value.trim();

    if (!message) {
      alert("Please enter an alert message.");
      return;
    }

    alert(
      `Alert sent successfully!\n\nSilo: ${selectedSiloId}\nPriority: ${priority}\nRecipient: ${recipient}\n\nMessage: ${message}`
    );

    document.getElementById("alertMessage").value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7f5] to-[#f2fdfb] font-poppins text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-tr from-teal-600 to-teal-800 flex items-center justify-between px-6 text-white shadow z-10">
        <div className="flex items-center gap-3">
          <i className="fas fa-seedling text-yellow-300 text-2xl"></i>
          <h1 className="text-lg font-semibold">GrainZillow - Silo List</h1>
        </div>
        <button className="bg-white text-teal-700 px-4 py-1 rounded hover:bg-gray-100 font-semibold">
          Logout
        </button>
      </header>

      {/* Sidebar */}
      <nav className="fixed top-16 left-0 h-[calc(100vh-64px)] w-16 md:w-56 bg-white shadow p-4 overflow-y-auto">
        <ul className="flex flex-col gap-2">
          {[
            { to: "/", icon: "fa-home", label: "Dashboard" },
            { to: "/silo-list", icon: "fa-list", label: "Silo List", active: true },
            { to: "/silo-management", icon: "fa-warehouse", label: "Silo Management" },
            { to: "/grains-inventory", icon: "fa-seedling", label: "Grains Inventory" },
            { to: "/managers-management", icon: "fa-user-tie", label: "Managers Management" },
            { to: "/employee-management", icon: "fa-users", label: "Employee Management" },
            { to: "/contact-management", icon: "fa-address-book", label: "Contact Management" },
            { to: "/message-centre", icon: "fa-envelope", label: "Message Centre" },
            { to: "/my-profile", icon: "fa-user", label: "My Profile" },
          ].map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className={`flex items-center gap-3 py-2 px-4 rounded hover:bg-teal-100 ${
                  item.active ? "bg-teal-200 font-semibold" : "font-normal text-gray-700"
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-center`}></i>
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="ml-16 md:ml-56 pt-20 px-6 pb-8">
        {/* Search section */}
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-teal-700 flex items-center gap-2 mb-4">
            <i className="fas fa-search"></i> Search Silo
          </h2>
          <div className="flex gap-4 items-end">
            <input
              type="text"
              placeholder="Type to filter silos below..."
              className="flex-grow p-3 border border-gray-300 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredSilos.length > 0) {
                  setSelectedSiloId(filteredSilos[0][0]);
                }
              }}
            />
            <button
              onClick={() => {
                if (filteredSilos.length === 1) {
                  setSelectedSiloId(filteredSilos[0][0]);
                } else if (searchTerm.trim()) {
                  alert("Please select a silo from the list.");
                }
              }}
              className="btn bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
            >
              <i className="fas fa-search"></i> Search Silo
            </button>
          </div>
        </section>

        {/* All Silos List */}
        <section className="bg-white rounded-lg shadow p-6 mb-8 max-h-[400px] overflow-auto">
          <h3 className="text-lg font-semibold mb-4">All Silos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSilos.length === 0 ? (
              <p className="col-span-full text-center text-red-500">No silos found.</p>
            ) : (
              filteredSilos.map(([id, silo]) => (
                <div
                  key={id}
                  onClick={() => setSelectedSiloId(id)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") setSelectedSiloId(id); }}
                  className={`cursor-pointer p-4 rounded border ${
                    selectedSiloId === id ? "border-teal-700 shadow-lg" : "border-gray-200"
                  } hover:shadow-lg flex justify-between items-center`}
                  role="button"
                  aria-pressed={selectedSiloId === id}
                >
                  <div>
                    <div className="font-bold text-teal-800">{id}</div>
                    <div className="text-gray-700">{silo.name}</div>
                    <div className="text-gray-600 text-sm mt-1">Manager: {silo.manager}</div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      getStatusClass(silo.overallStatus)
                    }`}
                  >
                    {silo.overallStatus.toUpperCase()}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Silo Details Section */}
        {selectedSilo && (
          <section className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-teal-700 mb-4 flex items-center gap-2">
              <i className="fas fa-info-circle"></i> Silo Details - {selectedSiloId}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="border-l-4 border-teal-600 pl-4">
                <div className="text-sm font-semibold text-gray-600">Silo Name</div>
                <div className="font-bold text-teal-800">{selectedSilo.name}</div>
              </div>
              <div className="border-l-4 border-teal-600 pl-4">
                <div className="text-sm font-semibold text-gray-600">Area</div>
                <div className="font-bold text-teal-800">{selectedSilo.area}</div>
              </div>
              <div className="border-l-4 border-teal-600 pl-4">
                <div className="text-sm font-semibold text-gray-600">Silo Code</div>
                <div className="font-bold text-teal-800">{selectedSilo.code}</div>
              </div>
              <div className="border-l-4 border-teal-600 pl-4">
                <div className="text-sm font-semibold text-gray-600">Assigned Manager</div>
                <div className="font-bold text-teal-800">{selectedSilo.manager}</div>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-teal-700 mb-4 flex items-center gap-2">
              <i className="fas fa-microchip"></i> Sensor Readings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                {
                  key: "temperature",
                  label: "Temperature",
                  unit: "°C",
                  icon: "fa-thermometer-half",
                  statusClass: "bg-pink-600",
                },
                {
                  key: "humidity",
                  label: "Humidity",
                  unit: "%",
                  icon: "fa-tint",
                  statusClass: "bg-blue-700",
                },
                {
                  key: "mq2",
                  label: "MQ2 Gas Level",
                  unit: "",
                  icon: "fa-wind",
                  statusClass: "bg-orange-600",
                },
                {
                  key: "mq135",
                  label: "MQ135 Air Quality",
                  unit: "",
                  icon: "fa-smog",
                  statusClass: "bg-purple-700",
                },
              ].map(({ key, label, unit, icon, statusClass }) => {
                const sensor = selectedSilo.sensors[key];
                return (
                  <div key={key} className="bg-white rounded-lg shadow p-4 text-center">
                    <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center text-white text-xl ${statusClass}`}>
                      <i className={`fas ${icon}`}></i>
                    </div>
                    <div className="text-lg font-bold">{sensor.value}{unit}</div>
                    <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold ${
                      getStatusClass(sensor.status)
                    }`}>
                      {sensor.status.toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-100 p-6 rounded-lg text-center mb-6">
              <div className="text-2xl font-extrabold mb-2">
                {selectedSilo.overallStatus === "safe" && "✅ ALL SYSTEMS NORMAL"}
                {selectedSilo.overallStatus === "warning" && "⚠ NEEDS ATTENTION"}
                {selectedSilo.overallStatus === "danger" && "🚨 CRITICAL ALERT"}
              </div>
              <div className="text-gray-600">
                {selectedSilo.overallStatus === "safe" && "All sensor readings are within safe parameters."}
                {selectedSilo.overallStatus === "warning" && "Some parameters require monitoring and possible intervention."}
                {selectedSilo.overallStatus === "danger" && "Immediate action required! Critical conditions detected."}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
              <h4 className="text-orange-700 font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-bell"></i> Send Alert Message
              </h4>
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="alertPriority" className="block font-semibold mb-1 text-gray-700">
                    Alert Priority
                  </label>
                  <select
                    id="alertPriority"
                    className="w-full border border-gray-300 rounded p-2"
                    defaultValue="low"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="alertRecipient" className="block font-semibold mb-1 text-gray-700">
                    Send To
                  </label>
                  <select
                    id="alertRecipient"
                    className="w-full border border-gray-300 rounded p-2"
                    defaultValue="manager"
                  >
                    <option value="manager">Silo Manager Only</option>
                    <option value="all_managers">All Managers</option>
                    <option value="all_employees">All Employees</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="alertMessage" className="block font-semibold mb-1 text-gray-700">
                  Alert Message
                </label>
                <textarea
                  id="alertMessage"
                  placeholder="Enter your alert message here..."
                  className="w-full border border-gray-300 rounded p-3 min-h-[100px] resize-y"
                />
              </div>
              <button
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
                onClick={() => {
                  const message = document.getElementById("alertMessage").value.trim();
                  if (!message) {
                    alert("Please enter an alert message.");
                    return;
                  }
                  alert("Alert sent successfully!");
                  document.getElementById("alertMessage").value = "";
                }}
              >
                <i className="fas fa-paper-plane mr-2"></i> Send Alert
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-[#004D40] text-white text-center py-3 text-sm rounded-t-lg fixed bottom-0 left-0 right-0">
        © 2025 GrainZillow | Smart Grain Storage Monitoring System
      </footer>
    </div>
  );
}

export default SiloList;
