import React from "react";
import { Link } from "react-router-dom";

const menuItems = [
  {
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    label: "Dashboard",
    path: "/manager",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    label: "Employee Management",
    path: "/employee-management-mgr",
  },
  {
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    label: "Task Assignment",
    path: "/task-assignment",
  },
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    label: "Message Centre",
    path: "/message-centre-mgr",
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    label: "History Logs",
    path: "/manager-history",
  },
  {
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    label: "Manual Grain Entry",
    path: "/manager-grain-entry",
  },
  {
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    label: "My Profile",
    path: "/manager-profile",
  },
  {
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    label: "About Us",
    path: "/manager-aboutus",
  },
  {
    icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    label: "FAQs",
    path: "/manager-faq",
  },
  {
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    label: "Contact Us",
    path: "/contactus-mgr",
  },
];

export default function Sidebar({ sidebarExpanded, currentPage }) {
  return (
    <nav
      style={{
        position: "fixed",
        left: 0,
        top: "70px",
        height: "calc(100vh - 70px)",
        width: sidebarExpanded ? "260px" : "80px",
        background: "white",
        boxShadow: "4px 0 6px -1px rgba(0, 0, 0, 0.1)",
        transition: "width 0.3s",
        zIndex: 40,
        overflowY: "auto",
        borderRight: "1px solid #e5e7eb",
      }}
    >
      <ul style={{ listStyle: "none", margin: 0, padding: "24px 12px" }}>
        {menuItems.map(({ icon, label, path }) => {
          const active = currentPage === label;
          return (
            <li key={label} style={{ marginBottom: "8px" }}>
              <Link
                to={path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  transition: "all 0.3s",
                  border: "2px solid",
                  borderColor: active ? "#99f6e4" : "transparent",
                  background: active
                    ? "linear-gradient(to right, #ccfbf1, #99f6e4)"
                    : "transparent",
                  color: active ? "#0f766e" : "#6b7280",
                  fontWeight: active ? "600" : "500",
                  fontSize: "14px",
                  justifyContent: sidebarExpanded ? "flex-start" : "center",
                  gap: sidebarExpanded ? "12px" : "0",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "#f0fdfa";
                    e.currentTarget.style.color = "#0f766e";
                    e.currentTarget.style.borderColor = "#99f6e4";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#6b7280";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                <svg
                  style={{ width: "20px", height: "20px", flexShrink: 0 }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={icon}
                  />
                </svg>
                {sidebarExpanded && <span>{label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
