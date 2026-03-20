import React from 'react';
import Icon from './Icon';

const NAV = [
  { id: "dashboard", label: "Dashboard",    icon: "dashboard" },
  { id: "watchlist", label: "Watchlist",    icon: "watchlist" },
  { id: "portfolio", label: "Portfolio",    icon: "portfolio" },
  { id: "ipo",       label: "IPO Listings", icon: "ipo",      badge: "6" },
  { id: "news",      label: "Market News",  icon: "news" },
  { id: "settings",  label: "Settings",     icon: "settings" },
];

export default function Sidebar({ page, setPage, open, setOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99, display: "none" }}
          className="sidebar-overlay"
        />
      )}

      <aside className={`sidebar${open ? " open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">S</div>
          <div className="logo-text">Stock<span>IQ</span></div>
        </div>

        {/* Nav */}
        <nav className="nav">
          <div className="nav-section">Main</div>
          {NAV.slice(0, 4).map(item => (
            <div
              key={item.id}
              className={`nav-item${page === item.id ? " active" : ""}`}
              onClick={() => { setPage(item.id); setOpen(false); }}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </div>
          ))}
          <div className="nav-section">More</div>
          {NAV.slice(4).map(item => (
            <div
              key={item.id}
              className={`nav-item${page === item.id ? " active" : ""}`}
              onClick={() => { setPage(item.id); setOpen(false); }}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Market: <span style={{ color: "var(--green)", fontWeight: 600 }}>● OPEN</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: "var(--text-muted)" }}>
            NSE / BSE · 9:15 AM – 3:30 PM IST
          </div>
        </div>
      </aside>
    </>
  );
}
