import React from 'react';
import { Link } from 'react-router-dom';



const adminMenuItems = [
  { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Dashboard", path: "/admin" },
  { icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", label: "Silo List", path: "/silo-list" },
  { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", label: "Silo Management", path: "/silo-management" },
  { icon: "M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z", label: "Grains Inventory", path: "/grains-inventory" },
  { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", label: "Managers Management", path: "/managers-management" },
  { icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z", label: "Employee Management", path: "/employee-management" },
  { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", label: "Contact Management", path: "/contact-management" },
  { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Message Centre", path: "/message-centre" },
  { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", label: "My Profile", path: "/my-profile" }
];

export default function Sidebar({ sidebarExpanded, currentPage, variant = "default" }) {
  const menuItems = variant === "admin" ? adminMenuItems : adminMenuItems;
  const isAdmin = variant === "admin";

  return (
    <nav style={{
      position: 'fixed',
      left: 0,
      top: '70px',
      height: 'calc(100vh - 70px)',
      width: sidebarExpanded ? '260px' : '80px',
      background: 'white',
      boxShadow: '4px 0 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'width 0.3s',
      zIndex: 40,
      overflowY: 'auto',
      borderRight: '1px solid #e5e7eb'
    }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: '24px 12px' }}>
        {menuItems.map(({ icon, label, path }) => {
          const active = currentPage === label;
          return (
            <li key={label} style={{ marginBottom: '8px' }}>
              <Link
                to={path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: isAdmin ? '14px 16px' : '12px',
                  borderRadius: isAdmin ? '8px' : '12px',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  border: isAdmin ? 'none' : '2px solid',
                  borderLeft: isAdmin && active ? '5px solid #0f766e' : 'none',
                  borderColor: !isAdmin && active ? '#99f6e4' : 'transparent',
                  background: active 
                    ? (isAdmin ? '#e0f7f5' : 'linear-gradient(to right, #ccfbf1, #99f6e4)')
                    : 'transparent',
                  color: active ? '#0f766e' : '#6b7280',
                  fontWeight: active ? '600' : '500',
                  fontSize: isAdmin ? '17px' : '14px',
                  justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                  gap: sidebarExpanded ? '14px' : '0'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = isAdmin ? '#f2fdfb' : '#f0fdfa';
                    e.currentTarget.style.color = '#0f766e';
                    if (!isAdmin) {
                      e.currentTarget.style.borderColor = '#99f6e4';
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                    if (!isAdmin) {
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }
                }}
              >
                <svg style={{ 
                  width: isAdmin ? '22px' : '20px', 
                  height: isAdmin ? '22px' : '20px',
                  flexShrink: 0 
                }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
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