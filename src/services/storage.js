// ─── KEYS ─────────────────────────────────────────────────────────────────────
const KEYS = {
  SESSION:   "stockiq_session",
  USERS:     "stockiq_users",
  WATCHLIST: "stockiq_watchlist",
  PORTFOLIO: "stockiq_portfolio",
  ALERTS:    "stockiq_alerts",
  IPOS:      "stockiq_ipos",
  THEME:     "stockiq_theme",
};

// ─── GENERIC ──────────────────────────────────────────────────────────────────
function get(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function set(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
function remove(key) {
  try { localStorage.removeItem(key); } catch {}
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const getSession   = ()       => get(KEYS.SESSION, null);
export const saveSession  = (user)   => set(KEYS.SESSION, user);
export const clearSession = ()       => remove(KEYS.SESSION);

export const getUsers  = ()      => get(KEYS.USERS, []);
export const saveUsers = (users) => set(KEYS.USERS, users);

// ─── APP DATA ─────────────────────────────────────────────────────────────────
export const getWatchlist  = (def)   => get(KEYS.WATCHLIST, def);
export const saveWatchlist = (list)  => set(KEYS.WATCHLIST, list);

export const getPortfolio  = ()      => get(KEYS.PORTFOLIO, []);
export const savePortfolio = (data)  => set(KEYS.PORTFOLIO, data);

export const getAlerts  = ()      => get(KEYS.ALERTS, []);
export const saveAlerts = (data)  => set(KEYS.ALERTS, data);

export const getIPOs  = (def)  => get(KEYS.IPOS, def);
export const saveIPOs = (data) => set(KEYS.IPOS, data);

export const getTheme  = ()      => get(KEYS.THEME, "dark");
export const saveTheme = (theme) => set(KEYS.THEME, theme);
