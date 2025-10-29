import React, { useState, useEffect } from "react";

const grainsData = [
  // Your data as provided
  {
    id: "SILO-A1",
    name: "North Storage A1",
    area: "Northern Zone",
    capacity: 1500,
    grains: { wheat: 450, corn: 320, rice: 280, barley: 150 },
  },
  // ... other silos
];

const grainColors = {
  wheat: "bg-yellow-300 text-yellow-900",
  corn: "bg-yellow-200 text-yellow-900",
  rice: "bg-green-200 text-green-900",
  barley: "bg-gray-300 text-gray-800",
};

const capacityFillColors = {
  low: "bg-green-600",
  medium: "bg-yellow-400",
  high: "bg-red-600",
};

function computeCapacityClass(percentage) {
  if (percentage > 80) return capacityFillColors.high;
  if (percentage > 60) return capacityFillColors.medium;
  return capacityFillColors.low;
}

export default function GrainsInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSilos, setFilteredSilos] = useState(grainsData);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSilos(grainsData);
    } else {
      const term = searchTerm.trim().toLowerCase();
      const filtered = grainsData.filter((silo) =>
        silo.id.toLowerCase().includes(term)
      );
      setFilteredSilos(filtered);
    }
  }, [searchTerm]);

  const totals = filteredSilos.reduce(
    (acc, silo) => {
      acc.wheat += silo.grains.wheat;
      acc.corn += silo.grains.corn;
      acc.rice += silo.grains.rice;
      acc.barley += silo.grains.barley;
      return acc;
    },
    { wheat: 0, corn: 0, rice: 0, barley: 0 }
  );

  totals.totalGrains =
    totals.wheat + totals.corn + totals.rice + totals.barley;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7f5] to-[#f2fdfb] font-poppins text-gray-800 p-6 pt-28 md:pt-24">
      <header className="fixed top-0 left-0 w-full h-16 bg-gradient-to-tr from-teal-600 to-teal-800 text-white flex items-center justify-between px-6 shadow z-20">
        <div className="flex items-center gap-3">
          <i className="fas fa-seedling text-yellow-300 text-2xl"></i>
          <h1 className="text-lg font-semibold">GrainZillow - Grains Inventory</h1>
        </div>
        <button className="bg-white text-teal-700 rounded px-4 py-1 font-semibold hover:bg-gray-100">
          Logout
        </button>
      </header>

      <section className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-teal-700 mb-6 flex items-center gap-2">
          <i className="fas fa-wheat-alt"></i> Grains Inventory Management
        </h2>

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter Silo ID (e.g., SILO-A1) or leave blank for all"
            className="flex-grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          />
          <button
            className="btn bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded font-semibold"
            onClick={() => {
              if (!searchTerm.trim()) setFilteredSilos(grainsData);
              else
                setFilteredSilos(
                  grainsData.filter((silo) =>
                    silo.id.toLowerCase().includes(searchTerm.trim().toLowerCase())
                  )
                );
            }}
          >
            <i className="fas fa-search mr-2"></i>Search
          </button>
          <button
            className="btn bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded font-semibold"
            onClick={() => {
              setSearchTerm("");
              setFilteredSilos(grainsData);
            }}
          >
            <i className="fas fa-redo mr-2"></i>Reset
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <SummaryCard
            label="Total Wheat"
            value={`${totals.wheat} tons`}
            twClass={grainColors.wheat}
            icon="fa-bread-slice"
          />
          <SummaryCard
            label="Total Corn"
            value={`${totals.corn} tons`}
            twClass={grainColors.corn}
            icon="fa-corn"
          />
          <SummaryCard
            label="Total Rice"
            value={`${totals.rice} tons`}
            twClass={grainColors.rice}
            icon="fa-rice"
          />
          <SummaryCard
            label="Total Barley"
            value={`${totals.barley} tons`}
            twClass={grainColors.barley}
            icon="fa-beer"
          />
          <SummaryCard
            label="Total Grains"
            value={`${totals.totalGrains} tons`}
            twClass="bg-teal-600 text-white"
            icon="fa-weight-hanging"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-teal-100 text-teal-900">
              <tr>
                <th className="py-3 px-4 text-left" style={{ width: "15%" }}>
                  Silo Information
                </th>
                <th className="py-3 px-4 text-center" style={{ width: "15%" }}>
                  Wheat (tons)
                </th>
                <th className="py-3 px-4 text-center" style={{ width: "15%" }}>
                  Corn (tons)
                </th>
                <th className="py-3 px-4 text-center" style={{ width: "15%" }}>
                  Rice (tons)
                </th>
                <th className="py-3 px-4 text-center" style={{ width: "15%" }}>
                  Barley (tons)
                </th>
                <th className="py-3 px-4 text-center" style={{ width: "15%" }}>
                  Total Grains
                </th>
                <th className="py-3 px-4 text-center" style={{ width: "10%" }}>
                  Capacity
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSilos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500 text-lg">
                    <i className="fas fa-search mb-2"></i>
                    <br />
                    No silos match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredSilos.map((silo) => {
                  const totalGrains = Object.values(silo.grains).reduce(
                    (a, b) => a + b,
                    0
                  );
                  const capacityPercent = (totalGrains / silo.capacity) * 100;
                  let capacityClass = computeCapacityClass(capacityPercent);
                  return (
                    <tr
                      key={silo.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-left">
                        <div className="font-semibold text-gray-800">{silo.id}</div>
                        <div className="text-gray-600">{silo.name}</div>
                        <div className="text-gray-500 text-sm">{silo.area}</div>
                      </td>
                      <td className="py-3 px-4 text-center">{silo.grains.wheat}</td>
                      <td className="py-3 px-4 text-center">{silo.grains.corn}</td>
                      <td className="py-3 px-4 text-center">{silo.grains.rice}</td>
                      <td className="py-3 px-4 text-center">{silo.grains.barley}</td>
                      <td className="py-3 px-4 text-center font-semibold">{totalGrains}</td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`${capacityClass} h-3`}
                            style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {totalGrains}/{silo.capacity} tons
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, twClass, icon }) {
  return (
    <div
      className={`summary-card flex flex-col items-center justify-center ${twClass}`}
    >
      <i className={`fas ${icon} text-3xl mb-2`}></i>
      <div className="summary-value">{value}</div>
      <div className="summary-label">{label}</div>
    </div>
  );
}
