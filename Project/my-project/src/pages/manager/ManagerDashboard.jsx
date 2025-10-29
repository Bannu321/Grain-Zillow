import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// export default function GrainZillowDashboard() {
//   const [sidebarExpanded, setSidebarExpanded] = useState(false);
//   const fanSwitchRef = useRef(null);
//   const fanStatusRef = useRef(null);

//   const tempGaugeRef = useRef(null);
//   const humGaugeRef = useRef(null);
//   const mq2GaugeRef = useRef(null);
//   const mq135GaugeRef = useRef(null);

//   // Helper to get color and status
//   const getColorAndStatus = (value, thresholds) => {
//     if (value >= thresholds.danger) return { color: "#ef4444", status: "DANGER" };
//     if (value >= thresholds.warning) return { color: "#f59e0b", status: "WARNING" };
//     return { color: "#10b981", status: "SAFE" };
//   };

//   // Create gauge chart or update if exists
//   const createOrUpdateGauge = (ref, value, max, thresholds, unit) => {
//     if (!ref.current) return null;

//     if (ref.current.chart) {
//       ref.current.chart.data.datasets[0].data = [value, max - value];
//       const { color, status } = getColorAndStatus(value, thresholds);
//       ref.current.chart.data.datasets[0].backgroundColor = [color, "#f3f4f6"];
//       ref.current.chart.update();
//       return status;
//     } else {
//       const { color, status } = getColorAndStatus(value, thresholds);
//       ref.current.chart = new Chart(ref.current, {
//         type: "doughnut",
//         data: {
//           datasets: [
//             {
//               data: [value, max - value],
//               backgroundColor: [color, "#f3f4f6"],
//               borderWidth: 0,
//             },
//           ],
//         },
//         options: {
//           rotation: -90,
//           circumference: 180,
//           cutout: "75%",
//           plugins: { 
//             legend: { display: false }, 
//             tooltip: { enabled: false } 
//           },
//           responsive: true,
//           maintainAspectRatio: false,
//         },
//       });
//       return status;
//     }
//   };

//   // State for gauge values and statuses
//   const [gauges, setGauges] = useState({
//     temp: 34,
//     hum: 70,
//     mq2: 950,
//     mq135: 1450,
//   });

//   const [statuses, setStatuses] = useState({
//     temp: "SAFE",
//     hum: "SAFE",
//     mq2: "SAFE",
//     mq135: "SAFE",
//   });

//   useEffect(() => {
//     setStatuses({
//       temp: createOrUpdateGauge(tempGaugeRef, gauges.temp, 100, { warning: 35, danger: 45 }, "°C"),
//       hum: createOrUpdateGauge(humGaugeRef, gauges.hum, 100, { warning: 75, danger: 85 }, "%"),
//       mq2: createOrUpdateGauge(mq2GaugeRef, gauges.mq2, 2000, { warning: 1200, danger: 1600 }, ""),
//       mq135: createOrUpdateGauge(mq135GaugeRef, gauges.mq135, 2000, { warning: 1300, danger: 1700 }, ""),
//     });
//   }, [gauges]);

//   const toggleSidebar = () => {
//     setSidebarExpanded(!sidebarExpanded);
//   };

//   const handleFanToggle = () => {
//     if (!fanStatusRef.current || !fanSwitchRef.current) return;
//     if (fanSwitchRef.current.checked) {
//       fanStatusRef.current.textContent = "Fan is ON";
//       fanStatusRef.current.className = "mt-4 text-lg font-semibold text-green-600 px-4 py-2 rounded-lg bg-green-50 border border-green-200";
//     } else {
//       fanStatusRef.current.textContent = "Fan is OFF";
//       fanStatusRef.current.className = "mt-4 text-lg font-semibold text-red-600 px-4 py-2 rounded-lg bg-red-50 border border-red-200";
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "DANGER": return "text-red-600 bg-red-50 border-red-200";
//       case "WARNING": return "text-amber-600 bg-amber-50 border-amber-200";
//       case "SAFE": return "text-green-600 bg-green-50 border-green-200";
//       default: return "text-gray-600 bg-gray-50 border-gray-200";
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Header - Fixed at top */}
//       <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-between px-6 shadow-lg z-50">
//         <button
//           className="p-2 hover:bg-teal-600 rounded-lg transition-colors duration-200"
//           onClick={toggleSidebar}
//           aria-label="Toggle Sidebar"
//         >
//           <i className="fas fa-bars text-xl"></i>
//         </button>
        
//         <div className="flex items-center space-x-3">
//           <i className="fas fa-seedling text-2xl text-teal-200"></i>
//           <h1 className="text-xl font-bold text-white">GrainZillow</h1>
//         </div>
        
//         <button className="bg-white text-teal-700 px-4 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-all duration-200 shadow-sm hover:shadow-md">
//           Logout
//         </button>
//       </header>

//       {/* Sidebar - Fixed left */}
//       <div className="flex flex-1 pt-16">
//         <nav
//           className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-xl transition-all duration-300 z-40 ${
//             sidebarExpanded ? "w-64" : "w-16"
//           }`}
//         >
//           <ul className="space-y-1 p-2">
//             {[
//               { icon: "fa-home", label: "Dashboard", active: true },
//               { icon: "fa-users", label: "Employee Management" },
//               { icon: "fa-tasks", label: "Task Assignment" },
//               { icon: "fa-envelope", label: "Message Centre" },
//               { icon: "fa-history", label: "History Logs" },
//               { icon: "fa-pen", label: "Manual Grain Entry" },
//               { icon: "fa-user", label: "My Profile" },
//               { icon: "fa-info-circle", label: "About Us" },
//               { icon: "fa-question-circle", label: "FAQs" },
//               { icon: "fa-phone", label: "Contact Us" },
//             ].map(({ icon, label, active }) => (
//               <li key={label}>
//                 <a
//                   href="#"
//                   className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
//                     active
//                       ? "bg-teal-50 text-teal-700 border-r-4 border-teal-700 font-semibold"
//                       : "text-gray-600 hover:bg-teal-50 hover:text-teal-700 hover:border-r-4 hover:border-teal-500"
//                   } ${!sidebarExpanded ? "justify-center px-2" : ""}`}
//                 >
//                   <i className={`fas ${icon} ${sidebarExpanded ? "w-6" : "w-4"} text-center ${active ? "text-teal-700" : "text-gray-500"}`}></i>
//                   {sidebarExpanded && (
//                     <span className="ml-3 font-medium text-sm">
//                       {label}
//                     </span>
//                   )}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Main Content */}
//         <main
//           className={`flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)] ${
//             sidebarExpanded ? "ml-64" : "ml-16"
//           }`}
//         >
//           <div className="p-6">
//             {/* Welcome Section */}
//             <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-center max-w-4xl mx-auto border border-gray-100">
//               <h1 className="text-2xl font-bold text-teal-700 mb-3">Smart Grain Storage Dashboard</h1>
//               <p className="text-gray-600">Monitor real-time data of your silo — stay informed and take control!</p>
//             </div>

//             {/* Dashboard Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
//               {[
//                 { ref: tempGaugeRef, label: "Temperature (°C)", value: gauges.temp, status: statuses.temp, key: "temp" },
//                 { ref: humGaugeRef, label: "Humidity (%)", value: gauges.hum, status: statuses.hum, key: "hum" },
//                 { ref: mq2GaugeRef, label: "Gas Level (MQ2)", value: gauges.mq2, status: statuses.mq2, key: "mq2" },
//                 { ref: mq135GaugeRef, label: "Gas Level (MQ135)", value: gauges.mq135, status: statuses.mq135, key: "mq135" },
//               ].map(({ ref, label, value, status, key }) => (
//                 <div key={key} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-100">
//                   <h3 className="text-teal-800 font-semibold text-lg mb-4 text-center">{label}</h3>
//                   <div className="h-48 mb-4 flex items-center justify-center">
//                     <canvas ref={ref} className="max-w-full max-h-full" />
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-gray-800 mb-2">{value}</div>
//                     <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(status)}`}>
//                       <span className={`w-2 h-2 rounded-full mr-2 ${
//                         status === "DANGER" ? "bg-red-500" :
//                         status === "WARNING" ? "bg-amber-500" : "bg-green-500"
//                       }`}></span>
//                       {status}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Fan Control Section */}
//             <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto border border-gray-100">
//               <h2 className="text-xl font-bold text-teal-800 mb-6 text-center">Fan Control</h2>
//               <div className="flex flex-col items-center">
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     id="fanSwitch"
//                     ref={fanSwitchRef}
//                     defaultChecked
//                     className="sr-only peer"
//                     onChange={handleFanToggle}
//                   />
//                   <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-600"></div>
//                 </label>
//                 <p 
//                   ref={fanStatusRef} 
//                   className="mt-4 text-lg font-semibold px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200"
//                 >
//                   Fan is ON
//                 </p>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* Footer */}
//       <footer className="bg-teal-900 text-white text-center py-4 text-sm">
//         <div className={`transition-all duration-300 ${sidebarExpanded ? "ml-64" : "ml-16"}`}>
//           &copy; 2025 GrainZillow — Smart Grain Storage Monitoring System
//         </div>
//       </footer>
//     </div>
//   );
// }




export default function GrainZillowDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md mx-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-teal-700 mb-2">CSS is Compiling</h2>
        <p className="text-green-500 mb-4">
          The dashboard styles are being processed. This should only take a moment...

        </p>
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
