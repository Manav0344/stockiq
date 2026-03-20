import React, { useState, useRef } from 'react';
import Icon from './Icon';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { searchStocks } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';

export default function Header({ setPage, setSelectedStock, setSidebarOpen }) {
  const { theme, toggleTheme, unreadCount, markAllRead, notifications } = useApp();
  const { user, logout } = useAuth();
  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState([]);
  const [showNotif,   setShowNotif]   = useState(false);
  const [showUser,    setShowUser]    = useState(false);
  const debouncedQ    = useDebounce(query, 250);
  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "U";

  // Search
  React.useEffect(() => {
    if (!debouncedQ.trim()) { setResults([]); return; }
    setResults(searchStocks(debouncedQ));
  }, [debouncedQ]);

  const handleSelectStock = (sym) => {
    setSelectedStock(sym);
    setPage("stock");
    setQuery("");
    setResults([]);
  };

  return (
    <header className="header">
      {/* Mobile menu */}
      <button className="icon-btn" style={{ display: "none" }} id="menu-btn" onClick={() => setSidebarOpen(o => !o)}>
        <Icon name="menu" size={18} />
      </button>

      {/* Search */}
      <div className="header-search">
        <span className="search-icon"><Icon name="search" size={15} /></span>
        <input
          className="search-input"
          placeholder="Search stocks, symbols…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onBlur={() => setTimeout(() => setResults([]), 200)}
        />
        {results.length > 0 && (
          <div className="search-results">
            {results.map(stock => (
              <div key={stock.symbol} className="search-result-item" onMouseDown={() => handleSelectStock(stock.symbol)}>
                <span className="ticker-badge">{stock.symbol}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stock.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{stock.sector}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>${stock.price}</div>
                  <div style={{ fontSize: 11, color: stock.changePct >= 0 ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                    {stock.changePct >= 0 ? "+" : ""}{stock.changePct}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="header-actions">
        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button className="icon-btn" onClick={() => { setShowNotif(o => !o); setShowUser(false); markAllRead(); }} style={{ position: "relative" }}>
            <Icon name="bell" size={17} />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, background: "var(--red)", borderRadius: "50%", border: "1.5px solid var(--bg-surface)" }} />
            )}
          </button>
          {showNotif && (
            <div className="dropdown-panel" style={{ width: 300, right: 0, left: "auto" }}>
              <div className="dropdown-header">Notifications</div>
              {notifications.map(n => (
                <div key={n.id} className="dropdown-item">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: n.read ? "var(--text-muted)" : "var(--green)", flexShrink: 0 }} />
                    <div style={{ fontSize: 13 }}>{n.text}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3, paddingLeft: 14 }}>{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button className="icon-btn" onClick={toggleTheme}>
          <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
        </button>

        {/* User menu */}
        <div style={{ position: "relative" }}>
          <div className="avatar" onClick={() => { setShowUser(o => !o); setShowNotif(false); }} style={{ cursor: "pointer" }}>
            {initials}
          </div>
          {showUser && (
            <div className="dropdown-panel" style={{ width: 220, right: 0, left: "auto" }}>
              <div className="dropdown-header" style={{ paddingBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.name || "User"}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{user?.email}</div>
                <span className={`role-badge ${user?.role === "admin" ? "role-admin" : user?.role === "premium" ? "role-premium" : "role-user"}`} style={{ marginTop: 8, display: "inline-block" }}>
                  {user?.role === "admin" ? "Admin" : user?.role === "premium" ? "Premium" : "Retail"}
                </span>
              </div>
              <div className="dropdown-item" onClick={() => { setPage("settings"); setShowUser(false); }}>
                <Icon name="settings" size={14} /> Settings
              </div>
              <div className="dropdown-item" onClick={logout} style={{ color: "var(--red)" }}>
                <Icon name="logout" size={14} /> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
