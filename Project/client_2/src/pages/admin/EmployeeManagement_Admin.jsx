import React, { useState, useEffect } from "react";

const initialEmployees = [
  {
    id: "EMP001",
    name: "Rahul Sharma",
    position: "Silo Operator",
    email: "rahul.sharma@grainzillow.com",
    phone: "+91 9876543201",
    siloId: "SILO-A1",
    manager: "Rajesh Kumar",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "EMP002",
    name: "Priya Singh",
    position: "Maintenance Technician",
    email: "priya.singh@grainzillow.com",
    phone: "+91 9876543202",
    siloId: "SILO-B2",
    manager: "Priya Singh",
    status: "active",
    joinDate: "2024-02-20",
  },
  {
    id: "EMP003",
    name: "Vikram Patel",
    position: "Quality Inspector",
    email: "vikram.patel@grainzillow.com",
    phone: "+91 9876543203",
    siloId: "SILO-C1",
    manager: "Amit Sharma",
    status: "active",
    joinDate: "2024-01-10",
  },
  {
    id: "EMP004",
    name: "Anjali Verma",
    position: "Safety Officer",
    email: "anjali.verma@grainzillow.com",
    phone: "+91 9876543204",
    siloId: "SILO-D2",
    manager: "Neha Patel",
    status: "active",
    joinDate: "2024-03-05",
  },
  {
    id: "EMP005",
    name: "Sanjay Kumar",
    position: "Silo Operator",
    email: "sanjay.kumar@grainzillow.com",
    phone: "+91 9876543205",
    siloId: "SILO-A2",
    manager: "Rajesh Kumar",
    status: "on-leave",
    joinDate: "2024-02-28",
  },
  {
    id: "EMP006",
    name: "Meera Joshi",
    position: "Maintenance Technician",
    email: "meera.joshi@grainzillow.com",
    phone: "+91 9876543206",
    siloId: "SILO-B1",
    manager: "Priya Singh",
    status: "active",
    joinDate: "2024-01-22",
  },
  {
    id: "EMP007",
    name: "Arun Malhotra",
    position: "Quality Inspector",
    email: "arun.malhotra@grainzillow.com",
    phone: "+91 9876543207",
    siloId: "SILO-C2",
    manager: "Amit Sharma",
    status: "inactive",
    joinDate: "2024-02-15",
  },
  {
    id: "EMP008",
    name: "Sneha Reddy",
    position: "Safety Officer",
    email: "sneha.reddy@grainzillow.com",
    phone: "+91 9876543208",
    siloId: "SILO-D1",
    manager: "Neha Patel",
    status: "active",
    joinDate: "2024-03-12",
  },
  {
    id: "EMP009",
    name: "Rohit Gupta",
    position: "Silo Operator",
    email: "rohit.gupta@grainzillow.com",
    phone: "+91 9876543209",
    siloId: "SILO-B3",
    manager: "Priya Singh",
    status: "active",
    joinDate: "2024-02-05",
  },
  {
    id: "EMP010",
    name: "Pooja Mehta",
    position: "Maintenance Technician",
    email: "pooja.mehta@grainzillow.com",
    phone: "+91 9876543210",
    siloId: "SILO-D3",
    manager: "Neha Patel",
    status: "on-leave",
    joinDate: "2024-01-30",
  },
];

export default function EmployeesManagement() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState(initialEmployees);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
    } else {
      const term = searchTerm.trim().toLowerCase();
      setFilteredEmployees(
        employees.filter(
          (emp) =>
            emp.id.toLowerCase().includes(term) ||
            emp.name.toLowerCase().includes(term) ||
            emp.siloId.toLowerCase().includes(term) ||
            emp.position.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, employees]);

  // Compute stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const silosCovered = new Set(employees.map((e) => e.siloId)).size;
  const technicians = employees.filter((e) => e.position === "Maintenance Technician").length;

  const sendMessage = (name, id) => {
    alert(`Opening message composer for ${name} (${id})\n\nThis would open a messaging interface.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7f5] to-[#f2fdfb] p-6 pt-28 md:pt-24 font-poppins text-gray-800 flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-tr from-teal-600 to-teal-800 text-white shadow px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <i className="fas fa-seedling text-yellow-300 text-2xl"></i> GrainZillow - Employees Management
        </div>
        <button className="bg-white text-teal-700 rounded px-4 py-1 font-semibold hover:bg-gray-100">Logout</button>
      </header>

      <section className="flex-grow bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-teal-700 mb-6">
          <i className="fas fa-user-tie mr-2"></i> Employees Management
        </h2>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-blue-800 flex items-center gap-2">
          <i className="fas fa-info-circle"></i>
          <span>
            Employee management (adding/removing) is handled by respective managers. Admins can view all employees and send messages for coordination.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon="fa-users" label="Total Employees" value={totalEmployees} />
          <StatCard icon="fa-user-check" label="Active Employees" value={activeEmployees} />
          <StatCard icon="fa-warehouse" label="Silos Covered" value={silosCovered} />
          <StatCard icon="fa-tools" label="Technicians" value={technicians} />
        </div>

        <div className="flex gap-4 items-end mb-6">
          <input
            type="text"
            id="searchEmployee"
            className="flex-grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Enter Employee ID, Name, or Silo ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
          />
          <button
            className="btn bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded font-semibold"
            onClick={() => {}}
          >
            <i className="fas fa-search mr-2"></i> Search
          </button>
          <button
            className="btn bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded font-semibold"
            onClick={() => setSearchTerm("")}
          >
            <i className="fas fa-redo mr-2"></i> Reset
          </button>
        </div>

        <table className="employees-table w-full border-collapse border border-gray-200 rounded-lg">
          <thead className="bg-teal-100 text-teal-900 font-semibold sticky top-0">
            <tr>
              <th className="p-3 border border-gray-300">Employee ID</th>
              <th className="p-3 border border-gray-300">Name</th>
              <th className="p-3 border border-gray-300">Position</th>
              <th className="p-3 border border-gray-300">Contact</th>
              <th className="p-3 border border-gray-300">Assigned Silo</th>
              <th className="p-3 border border-gray-300">Manager</th>
              <th className="p-3 border border-gray-300">Status</th>
              <th className="p-3 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-6 text-gray-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border border-gray-200 hover:bg-gray-50">
                  <td className="border p-3 font-semibold">{emp.id}</td>
                  <td className="border p-3">
                    {emp.name}
                    <div className="text-xs text-gray-600">Joined: {new Date(emp.joinDate).toLocaleDateString()}</div>
                  </td>
                  <td className="border p-3">
                    <span className="position-badge">{emp.position}</span>
                  </td>
                  <td className="border p-3">
                    <div>{emp.email}</div>
                    <div className="text-xs text-gray-600">{emp.phone}</div>
                  </td>
                  <td className="border p-3">{emp.siloId}</td>
                  <td className="border p-3">{emp.manager}</td>
                  <td className="border p-3">
                    <span
                      className={`status-badge ${
                        emp.status === "active"
                          ? "status-active"
                          : emp.status === "inactive"
                          ? "status-inactive"
                          : "status-on-leave"
                      }`}
                    >
                      {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                    </span>
                  </td>
                  <td className="border p-3">
                    <button
                      className="btn btn-small bg-teal-600 text-white rounded px-2 hover:bg-teal-700"
                      onClick={() => alert(`Opening message composer for ${emp.name} (${emp.id})`)}
                    >
                      <i className="fas fa-envelope"></i> Message
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <footer className="bg-[#004D40] text-white text-center py-3 text-sm rounded-t-lg mt-auto">
        © 2025 GrainZillow | Smart Grain Storage Monitoring System
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card rounded-lg p-6 bg-white shadow border-t-4 border-teal-600 text-center">
      <i className={`fas ${icon} text-3xl mb-2 text-teal-600`}></i>
      <div className="stat-value text-2xl font-bold">{value}</div>
      <div className="stat-label text-gray-600 mt-1">{label}</div>
    </div>
  );
}
