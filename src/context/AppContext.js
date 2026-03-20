import { createContext, useContext, useState, useEffect } from 'react';
import {
  getWatchlist, saveWatchlist,
  getPortfolio, savePortfolio,
  getAlerts,    saveAlerts,
  getIPOs,      saveIPOs,
  getTheme,     saveTheme,
} from '../services/storage';
import { IPOS_DATA } from '../utils/mockData';

const AppContext = createContext(null);

const DEFAULT_WATCHLIST = ["AAPL", "MSFT", "NVDA", "RELIANCE", "TCS"];

export function AppProvider({ children }) {
  const [theme,     setThemeState] = useState(() => getTheme());
  const [watchlist, setWatchlist]  = useState(() => getWatchlist(DEFAULT_WATCHLIST));
  const [portfolio, setPortfolio]  = useState(() => getPortfolio());
  const [alerts,    setAlerts]     = useState(() => getAlerts());
  const [ipos,      setIpos]       = useState(() => getIPOs(IPOS_DATA));
  const [notifications, setNotifications] = useState([
    { id: 1, text: "AAPL crossed $189 — target hit!", time: "10m ago", read: false },
    { id: 2, text: "NVDA up 2.6% today on AI demand", time: "1h ago", read: false },
    { id: 3, text: "AgroFinance IPO subscribed 7.83x", time: "2h ago", read: true  },
  ]);

  // Persist side effects
  useEffect(() => { saveWatchlist(watchlist); }, [watchlist]);
  useEffect(() => { savePortfolio(portfolio); }, [portfolio]);
  useEffect(() => { saveAlerts(alerts); },       [alerts]);
  useEffect(() => { saveIPOs(ipos); },           [ipos]);

  // Theme
  const toggleTheme = () => {
    setThemeState(t => { const n = t === "dark" ? "light" : "dark"; saveTheme(n); return n; });
  };

  // Watchlist
  const toggleWatchlist = (sym) => {
    setWatchlist(w => w.includes(sym) ? w.filter(s => s !== sym) : [...w, sym]);
  };
  const isWatching = (sym) => watchlist.includes(sym);

  // Portfolio
  const addHolding = (entry) => {
    setPortfolio(p => [...p, { ...entry, id: Date.now() }]);
  };
  const removeHolding = (id) => {
    setPortfolio(p => p.filter(x => x.id !== id));
  };
  const updateHolding = (id, updates) => {
    setPortfolio(p => p.map(x => x.id === id ? { ...x, ...updates } : x));
  };

  // Alerts
  const addAlert = (alert) => {
    setAlerts(a => [...a, { ...alert, id: Date.now(), createdAt: new Date().toISOString() }]);
  };
  const removeAlert = (id) => {
    setAlerts(a => a.filter(x => x.id !== id));
  };

  // IPOs
  const toggleIPOBookmark = (id) => {
    setIpos(prev => prev.map(ipo => ipo.id === id ? { ...ipo, bookmarked: !ipo.bookmarked } : ipo));
  };

  // Notifications
  const markAllRead = () => {
    setNotifications(n => n.map(x => ({ ...x, read: true })));
  };
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      watchlist, toggleWatchlist, isWatching,
      portfolio, addHolding, removeHolding, updateHolding,
      alerts, addAlert, removeAlert,
      ipos, toggleIPOBookmark,
      notifications, markAllRead, unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
