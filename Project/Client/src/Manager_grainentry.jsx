import React, { useState, useEffect, useRef } from "react";

const initialGrainStorage = {
  wheat: { current: 1250, capacity: 3000 },
  corn: { current: 1800, capacity: 3000 },
  rice: { current: 800, capacity: 2000 },
  barley: { current: 1200, capacity: 2000 }
};

const totalCapacity = 10000;

const initialTransactions = [
  { date: "2025-01-15", type: "in", grain: "wheat", quantity: 500, customer: "John Smith", client: "AgriCorp Ltd." },
  { date: "2025-01-14", type: "out", grain: "corn", quantity: 300, customer: "Green Valley Farms", client: "FoodPro Inc." },
  { date: "2025-01-13", type: "in", grain: "rice", quantity: 350, customer: "Robert Johnson", client: "Rice Distributors" },
  { date: "2025-01-12", type: "out", grain: "barley", quantity: 200, customer: "Brew Masters Co.", client: "Beverage Partners" }
];

export default function ManualGrainEntry() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [grainStorage, setGrainStorage] = useState(initialGrainStorage);
  const [transactionHistory, setTransactionHistory] = useState(initialTransactions);

  // Form state
  const [form, setForm] = useState({
    transactionType: "",
    grainType: "",
    quantity: "",
    date: new Date().toISOString().split("T")[0],
    customerName: "",
    clientName: "",
    notes: ""
  });

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);

  // Compute utilization percent
  const totalGrains = Object.values(grainStorage).reduce((sum, g) => sum + g.current, 0);
  const availableSpace = totalCapacity - totalGrains;
  const utilizationPercent = totalCapacity ? ((totalGrains / totalCapacity) * 100).toFixed(1) : 0;

  // Handles form input changes
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Resets the form inputs
  const resetForm = () => {
    setForm({
      transactionType: "",
      grainType: "",
      quantity: "",
      date: new Date().toISOString().split("T")[0],
      customerName: "",
      clientName: "",
      notes: ""
    });
  };

  // Update storage quantities and history on submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const { transactionType, grainType, quantity, date, customerName, clientName } = form;
    const qty = parseInt(quantity, 10);

    if (!transactionType || !grainType || !quantity || !date || !customerName || !clientName) {
      alert("Please fill all required fields.");
      return;
    }
    if (qty <= 0) {
      alert("Quantity must be positive.");
      return;
    }

    if (transactionType === "out" && qty > grainStorage[grainType].current) {
      alert(`Cannot remove ${qty} kg of ${grainType}. Only ${grainStorage[grainType].current} kg available.`);
      return;
    }

    if (transactionType === "in") {
      if (qty + totalGrains > totalCapacity) {
        alert(`Adding ${qty} kg exceeds total capacity (${totalCapacity} kg).`);
        return;
      }
      if (qty + grainStorage[grainType].current > grainStorage[grainType].capacity) {
        alert(`Adding ${qty} kg exceeds ${grainType} capacity (${grainStorage[grainType].capacity} kg).`);
        return;
      }
    }

    // Update storage state
    setGrainStorage(prev => {
      const updated = { ...prev };
      updated[grainType].current = transactionType === "in"
        ? prev[grainType].current + qty
        : prev[grainType].current - qty;
      return updated;
    });

    // Add to transaction history
    setTransactionHistory(prev => [
      {
        date,
        type: transactionType,
        grain: grainType,
        quantity: qty,
        customer: customerName,
        client: clientName,
        notes: form.notes
      },
      ...prev
    ]);

    alert(`Transaction recorded successfully!
Type: ${transactionType === "in" ? "Grain In" : "Grain Out"}
Grain: ${grainType.charAt(0).toUpperCase() + grainType.slice(1)}
Quantity: ${qty} kg
Customer: ${customerName}
Client: ${clientName}`);

    resetForm();
  };

  // Returns color class for capacity bar
  const getCapacityColor = (percentage) => {
    if (percentage < 60) return "bg-green-500";
    if (percentage < 85) return "bg-yellow-400";
    return "bg-red-600";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f2fdfb] to-[#e6f4f1] text-gray-800">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between h-[70px] bg-gradient-to-r from-teal-700 to-teal-900 text-white px-6 shadow-md z-50">
        <button onClick={toggleSidebar} className="text-2xl focus:outline-none">
          <i className="fas fa-ellipsis-v"></i>
        </button>
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <i className="fas fa-seedling text-2xl"></i>
          <h1>GrainZillow</h1>
        </div>
        <button className="bg-white text-teal-700 font-semibold rounded-md px-4 py-2 hover:bg-gray-100 transition">Logout</button>
      </header>

      {/* SIDEBAR */}
      <nav className={`${sidebarExpanded ? "w-56" : "w-16"} fixed top-0 left-0 h-full bg-white shadow-lg pt-[70px] transition-all duration-300 overflow-hidden z-40`}>
        <ul className="flex flex-col text-gray-700">
          {[
            { icon: "fas fa-home", label: "Dashboard" },
            { icon: "fas fa-users", label: "Employee Management" },
            { icon: "fas fa-tasks", label: "Task Assignment" },
            { icon: "fas fa-comments", label: "Message Centre" },
            { icon: "fas fa-history", label: "History Logs" },
            { icon: "fas fa-pen", label: "Manual Grain Entry", active: true },
            { icon: "fas fa-user", label: "My Profile" },
            { icon: "fas fa-info-circle", label: "About Us" },
            { icon: "fas fa-question-circle", label: "FAQs" },
            { icon: "fas fa-phone", label: "Contact Us" }
          ].map(({ icon, label, active }) => (
            <li key={label}>
              <a
                href="#"
                className={`flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:bg-teal-100 hover:text-teal-900 transition ${
                  active ? "bg-teal-100 border-teal-700 text-teal-900 font-semibold" : ""
                }`}
              >
                <i className={`${icon} w-6 text-center`}></i>
                <span className={`${sidebarExpanded ? "opacity-100" : "opacity-0"} transition-opacity whitespace-nowrap`}>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className={`${sidebarExpanded ? "ml-56" : "ml-16"} flex-1 pt-[70px] px-10 pb-8 transition-all duration-300`}>

        {/* Welcome */}
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 mb-10 text-center">
          <h1 className="text-teal-700 text-3xl font-bold mb-2">Manual Grain Entry</h1>
          <p>Manage grain storage, track inventory, and record transactions for your assigned silo</p>
        </div>

        {/* Total Storage Overview */}
        <section className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-teal-700 text-2xl font-semibold mb-5 flex items-center gap-2">
            <i className="fas fa-chart-pie"></i> Overall Storage Capacity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-100 p-4 rounded shadow flex flex-col items-center border-l-4 border-teal-700">
              <h4 className="text-gray-600 mb-2 text-sm font-semibold">Total Grains Stored</h4>
              <div className="text-xl font-bold text-teal-700">{totalGrains.toLocaleString()} kg</div>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow flex flex-col items-center border-l-4 border-teal-700">
              <h4 className="text-gray-600 mb-2 text-sm font-semibold">Maximum Capacity</h4>
              <div className="text-xl font-bold text-teal-700">{totalCapacity.toLocaleString()} kg</div>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow flex flex-col items-center border-l-4 border-teal-700">
              <h4 className="text-gray-600 mb-2 text-sm font-semibold">Available Space</h4>
              <div className="text-xl font-bold text-teal-700">{availableSpace.toLocaleString()} kg</div>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow flex flex-col items-center border-l-4 border-teal-700">
              <h4 className="text-gray-600 mb-2 text-sm font-semibold">Utilization</h4>
              <div className="text-xl font-bold text-teal-700">{utilizationPercent}%</div>
            </div>
          </div>

          <div className="w-full h-4 bg-gray-300 rounded overflow-hidden">
            <div
              className="h-full rounded bg-gradient-to-r from-green-500 via-yellow-400 to-red-600 transition-width duration-500"
              style={{ width: `${utilizationPercent}%` }}
            ></div>
          </div>
        </section>

        {/* Current Grain Storage */}
        <section className="max-w-7xl mx-auto mb-10">
          <h2 className="text-teal-700 text-2xl font-semibold mb-5">Current Grain Storage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(grainStorage).map(([grain, { current, capacity }]) => {
              const percent = (current / capacity) * 100;
              const barColor = getCapacityColor(percent);
              const iconMap = {
                wheat: "fas fa-wheat",
                corn: "fas fa-corn",
                rice: "fas fa-rice",
                barley: "fas fa-seedling"
              };
              return (
                <div key={grain} className="bg-white rounded-lg shadow-md p-5 hover:-translate-y-1 transition-transform">
                  <h3 className="flex items-center gap-3 text-teal-700 text-xl font-semibold mb-4">
                    <i className={`${iconMap[grain]} text-yellow-500`}></i>
                    {grain.charAt(0).toUpperCase() + grain.slice(1)} Storage
                  </h3>
                  <div className="flex justify-between mb-1 text-gray-600 font-semibold">
                    <span>Current Quantity:</span>
                    <span>{current.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between mb-1 text-gray-600 font-semibold">
                    <span>Capacity:</span>
                    <span>{capacity.toLocaleString()} kg</span>
                  </div>
                  <div className="w-full h-3 bg-gray-300 rounded">
                    <div className={`${barColor} h-full rounded transition-all`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Grain Transaction Entry Form */}
        <section className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-teal-700 text-2xl font-semibold mb-5">Grain Transaction Entry</h2>

          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <h4 className="flex items-center gap-2 text-green-700 font-semibold mb-1">
              <i className="fas fa-info-circle"></i>
              Assigned Silo
            </h4>
            <p>All transactions will be recorded for your assigned silo: <strong>Main Storage Facility</strong></p>
          </div>

          <form onSubmit={handleSubmit} onReset={resetForm}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col">
                <label htmlFor="transactionType" className="font-semibold mb-2 text-gray-700">Transaction Type</label>
                <select
                  id="transactionType"
                  name="transactionType"
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-700"
                  value={form.transactionType}
                  onChange={onInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="in">Grain In (Addition)</option>
                  <option value="out">Grain Out (Removal)</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="grainType" className="font-semibold mb-2 text-gray-700">Grain Type</label>
                <select
                  id="grainType"
                  name="grainType"
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-700"
                  value={form.grainType}
                  onChange={onInputChange}
                  required
                >
                  <option value="">Select Grain</option>
                  <option value="wheat">Wheat</option>
                  <option value="corn">Corn</option>
                  <option value="rice">Rice</option>
                  <option value="barley">Barley</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="quantity" className="font-semibold mb-2 text-gray-700">Quantity (kg)</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  placeholder="Enter quantity in kg"
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-700"
                  value={form.quantity}
                  onChange={onInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col">
                <label htmlFor="date" className="font-semibold mb-2 text-gray-700">Transaction Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-700"
                  value={form.date}
                  onChange={onInputChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="customerName" className="font-semibold mb-2 text-gray-700">Customer/Farmer Name</label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  placeholder="Enter customer name"
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-700"
                  value={form.customerName}
                  onChange={onInputChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="clientName" className="font-semibold mb-2 text-gray-700">Client/Company Name</label>
                <input
                  id="clientName"
                  name="clientName"
                  type="text"
                  placeholder="Enter client/company name"
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-700"
                  value={form.clientName}
                  onChange={onInputChange}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="notes" className="font-semibold mb-2 block text-gray-700">Notes (Optional)</label>
              <input
                id="notes"
                name="notes"
                type="text"
                placeholder="Additional notes about this transaction"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-700"
                value={form.notes}
                onChange={onInputChange}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button type="submit" className="btn bg-teal-700 hover:bg-teal-900 text-white px-6 py-3 rounded inline-flex items-center gap-2 font-semibold">
                <i className="fas fa-save"></i> Save Transaction
              </button>
              <button type="reset" className="btn bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded inline-flex items-center gap-2 font-semibold">
                <i className="fas fa-redo"></i> Reset Form
              </button>
            </div>
          </form>
        </section>

        {/* Transaction History */}
        <section className="max-w-7xl mx-auto mb-10">
          <h2 className="text-teal-700 text-2xl font-semibold mb-5">Transaction History</h2>
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full border-collapse text-gray-700">
              <thead>
                <tr className="bg-teal-700 text-white font-semibold text-left">
                  <th className="p-4">Date</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Grain Type</th>
                  <th className="p-4">Quantity (kg)</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Client</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.map((t, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="p-4">{t.date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        t.type === "in" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {t.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">{t.grain.charAt(0).toUpperCase() + t.grain.slice(1)}</td>
                    <td className="p-4">{t.quantity}</td>
                    <td className="p-4">{t.customer}</td>
                    <td className="p-4">{t.client}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination - just UI here */}
          <div className="flex justify-center mt-6 space-x-2">
            {["1","2","3","4","5","Next"].map(label => (
              <button
                key={label}
                className={`px-4 py-2 rounded border border-gray-300 hover:bg-gray-200 transition ${
                  label === "1" ? "bg-teal-700 text-white border-teal-700" : "text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-teal-900 text-white text-center py-3 mt-auto">
        © 2025 GrainZillow — Smart Grain Storage Monitoring System
      </footer>
    </div>
  );
}
