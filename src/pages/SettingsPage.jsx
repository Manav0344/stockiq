import React, { useState } from 'react';
import Icon from '../components/Icon';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { STOCKS } from '../utils/mockData';
import { FEATURE_ACCESS, hasAccess, ROLE_META } from '../utils/helpers';

function Toggle({ checked, onChange }) {
  return (
    <div onClick={onChange} style={{ position: "relative", width: 40, height: 22, cursor: "pointer", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 11, background: checked ? "var(--green)" : "var(--bg-hover)", border: "1px solid " + (checked ? "var(--green)" : "var(--border)"), transition: "background 0.2s" }} />
      <div style={{ position: "absolute", top: 3, left: 3, width: 14, height: 14, borderRadius: "50%", background: "white", transition: "transform 0.2s", transform: checked ? "translateX(18px)" : "translateX(0)" }} />
    </div>
  );
}

export default function SettingsPage({ toggleTheme }) {
  const { theme, alerts, removeAlert } = useApp();
  const { user, updateProfile, logout } = useAuth();
  const [notif,       setNotif]       = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [currency,    setCurrency]    = useState("USD");
  const [profileForm, setProfileForm] = useState({ firstName: user?.firstName || "", lastName: user?.lastName || "", phone: user?.phone || "" });
  const [saved,       setSaved]       = useState(false);

  const roleMeta = ROLE_META[user?.role] || ROLE_META.user;

  const handleSaveProfile = () => {
    updateProfile({ ...profileForm, name: profileForm.firstName + " " + profileForm.lastName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Settings</div>
        <div className="page-subtitle">Manage your account and preferences</div>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "2 1 380px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Profile */}
          <div className="card">
            <div className="card-header"><div className="card-title">Profile Information</div></div>
            <div className="card-body">
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: 16, background: "var(--bg-base)", borderRadius: "var(--radius)" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, var(--green), var(--blue))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, color: "#0d1117", flexShrink: 0 }}>
                  {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{user?.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{user?.email}</div>
                  <span className={`role-badge ${roleMeta.cls}`} style={{ marginTop: 6, display: "inline-block" }}>{roleMeta.label}</span>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="input" value={profileForm.firstName} onChange={e => setProfileForm(f => ({ ...f, firstName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="input" value={profileForm.lastName} onChange={e => setProfileForm(f => ({ ...f, lastName: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="input" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
              </div>
              <button className="btn btn-primary" onClick={handleSaveProfile} style={{ width: "100%" }}>
                {saved ? <><Icon name="check" size={15} /> Saved!</> : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="card">
            <div className="card-header"><div className="card-title">Appearance & Display</div></div>
            <div className="card-body" style={{ padding: "0 20px" }}>
              {[
                { label: "Dark Mode",    desc: "Toggle dark / light theme",          val: theme === "dark", fn: toggleTheme },
                { label: "Push Alerts",  desc: "Notify when stocks hit target price", val: notif,       fn: () => setNotif(v => !v) },
                { label: "Email Alerts", desc: "Receive alerts in your inbox",       val: emailAlerts,  fn: () => setEmailAlerts(v => !v) },
                { label: "Auto Refresh", desc: "Refresh market data every 30s",      val: autoRefresh,  fn: () => setAutoRefresh(v => !v) },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{s.desc}</div>
                  </div>
                  <Toggle checked={s.val} onChange={s.fn} />
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>Currency</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Display currency for prices</div>
                </div>
                <select className="select" style={{ width: "auto", padding: "6px 12px" }} value={currency} onChange={e => setCurrency(e.target.value)}>
                  <option>USD</option><option>INR</option><option>EUR</option><option>GBP</option><option>JPY</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="card" style={{ border: "1px solid rgba(255,77,77,0.2)" }}>
            <div className="card-header"><div className="card-title" style={{ color: "var(--red)" }}>Danger Zone</div></div>
            <div className="card-body">
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>
                Signing out will clear your local session. Your data (watchlist, portfolio, alerts) remains saved in this browser.
              </div>
              <button className="btn btn-danger" onClick={logout} style={{ width: "100%", justifyContent: "center" }}>
                <Icon name="logout" size={15} /> Sign Out of StockIQ
              </button>
            </div>
          </div>
        </div>

        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Price Alerts */}
          <div className="card">
            <div className="card-header"><div className="card-title">Price Alerts ({alerts.length})</div></div>
            <div className="card-body" style={{ padding: alerts.length ? "8px 20px" : "20px" }}>
              {alerts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "16px 0", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
                  <div style={{ fontSize: 13 }}>No alerts set. Open any stock and click "Alert".</div>
                </div>
              ) : alerts.map(a => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
                  <span className="ticker-badge">{a.symbol}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.condition === "above" ? "↑ Above" : "↓ Below"} ${a.price}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Current: ${STOCKS[a.symbol]?.price ?? "—"}</div>
                  </div>
                  <button className="btn btn-danger" style={{ padding: "4px 8px" }} onClick={() => removeAlert(a.id)}>
                    <Icon name="x" size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Role-based access */}
          <div className="card">
            <div className="card-header"><div className="card-title">Feature Access</div></div>
            <div className="card-body" style={{ padding: "8px 20px" }}>
              <div style={{ marginBottom: 12, fontSize: 12, color: "var(--text-muted)" }}>
                Role: <span className={`role-badge ${roleMeta.cls}`}>{roleMeta.label}</span>
              </div>
              {Object.keys(FEATURE_ACCESS).map(feature => {
                const allowed = hasAccess(user?.role, feature);
                return (
                  <div key={feature} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 12, color: allowed ? "var(--text-primary)" : "var(--text-muted)" }}>{feature}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: allowed ? "var(--green-dim)" : "var(--red-dim)", color: allowed ? "var(--green)" : "var(--red)" }}>
                      {allowed ? "✓" : "✗"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
