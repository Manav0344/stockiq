// Password strength checker
export function checkPasswordStrength(pwd) {
  const checks = {
    length:    pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number:    /[0-9]/.test(pwd),
    special:   /[^A-Za-z0-9]/.test(pwd),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const label = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"][score];
  const color = ["", "#ff4d4d", "#ff8c42", "#f59e0b", "#00e5a0", "#00e5a0"][score];
  return { score, label, color, checks };
}

// Generate OTP
export function genOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Format timer MM:SS
export function fmtTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// Format currency
export function formatCurrency(val, symbol = "$") {
  if (val >= 1e12) return symbol + (val / 1e12).toFixed(2) + "T";
  if (val >= 1e9)  return symbol + (val / 1e9).toFixed(2) + "B";
  if (val >= 1e6)  return symbol + (val / 1e6).toFixed(2) + "M";
  return symbol + val.toFixed(2);
}

// Format large numbers
export function formatNumber(val) {
  return new Intl.NumberFormat("en-IN").format(val);
}

// Debounce
export function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

// Date helpers
export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}
export function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " · " + d.toLocaleDateString("en-IN");
}

// Role helpers
export const ROLE_META = {
  admin:   { label: "Admin",          cls: "role-admin",   color: "#f5a623" },
  premium: { label: "Premium Trader", cls: "role-premium", color: "#7eb3ff" },
  user:    { label: "Retail Investor", cls: "role-user",   color: "#00e5a0" },
};

export const FEATURE_ACCESS = {
  "View Dashboard":      ["user", "premium", "admin"],
  "Watchlist":           ["user", "premium", "admin"],
  "Portfolio Analytics": ["premium", "admin"],
  "Advanced Charts":     ["premium", "admin"],
  "IPO Bookmarks":       ["premium", "admin"],
  "Price Alerts":        ["user", "premium", "admin"],
  "Export Data":         ["premium", "admin"],
  "Market News":         ["user", "premium", "admin"],
  "Admin Panel":         ["admin"],
  "API Access":          ["admin"],
};

export function hasAccess(role, feature) {
  return (FEATURE_ACCESS[feature] || []).includes(role);
}
