import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp }   from './context/AppContext';

import AuthLayout      from './pages/auth/AuthLayout';
import Sidebar         from './components/Sidebar';
import Header          from './components/Header';
import TickerBar       from './components/TickerBar';
import DashboardPage   from './pages/DashboardPage';
import WatchlistPage   from './pages/WatchlistPage';
import PortfolioPage   from './pages/PortfolioPage';
import IPOPage         from './pages/IPOPage';
import IPODetailPage   from './pages/IPODetailPage';
import NewsPage        from './pages/NewsPage';
import StockDetailPage from './pages/StockDetailPage';
import SettingsPage    from './pages/SettingsPage';

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  :root {
    --bg-base:        #0d1117;
    --bg-surface:     #161b27;
    --bg-card:        #1a2235;
    --bg-hover:       #1e2a3a;
    --green:          #00d395;
    --green-dim:      rgba(0,211,149,0.12);
    --red:            #ff4d4d;
    --red-dim:        rgba(255,77,77,0.12);
    --blue:           #3b82f6;
    --amber:          #f59e0b;
    --purple:         #a855f7;
    --text-primary:   #e8edf5;
    --text-secondary: #8b97a8;
    --text-muted:     #4a5568;
    --border:         rgba(255,255,255,0.07);
    --border-hover:   rgba(255,255,255,0.14);
    --shadow:         0 4px 24px rgba(0,0,0,0.4);
    --sidebar-w:      220px;
    --header-h:       60px;
    --font:           'Space Grotesk', sans-serif;
    --mono:           'JetBrains Mono', monospace;
    --radius:         10px;
    --radius-lg:      14px;
    --transition:     0.18s ease;
  }
  .light-mode {
    --bg-base:        #f0f2f7;
    --bg-surface:     #ffffff;
    --bg-card:        #ffffff;
    --bg-hover:       #f5f7fa;
    --green:          #00a67d;
    --green-dim:      rgba(0,166,125,0.1);
    --red:            #dc2626;
    --red-dim:        rgba(220,38,38,0.1);
    --blue:           #2563eb;
    --amber:          #d97706;
    --text-primary:   #0f172a;
    --text-secondary: #475569;
    --text-muted:     #94a3b8;
    --border:         rgba(0,0,0,0.08);
    --border-hover:   rgba(0,0,0,0.16);
    --shadow:         0 4px 24px rgba(0,0,0,0.1);
  }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes shimmer  { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* ── App Shell ── */
  .app { font-family: var(--font); background: var(--bg-base); color: var(--text-primary); min-height: 100vh; display: flex; flex-direction: column; }

  /* ── Sidebar ── */
  .sidebar { width: var(--sidebar-w); background: var(--bg-surface); border-right: 1px solid var(--border); position: fixed; top: 0; left: 0; height: 100vh; display: flex; flex-direction: column; z-index: 100; transition: transform var(--transition); }
  .sidebar-logo { height: var(--header-h); display: flex; align-items: center; gap: 10px; padding: 0 20px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .logo-icon { width: 30px; height: 30px; background: var(--green); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: #0d1117; }
  .logo-text { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }
  .logo-text span { color: var(--green); }
  .nav { flex: 1; padding: 10px 0; overflow-y: auto; }
  .nav-section { padding: 4px 12px 2px; font-size: 10px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text-muted); margin-top: 14px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 20px; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: background var(--transition), color var(--transition); color: var(--text-secondary); user-select: none; position: relative; }
  .nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
  .nav-item.active { color: var(--green); background: rgba(0,211,149,0.1); }
  .nav-item.active::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--green); border-radius: 0 2px 2px 0; }
  .nav-badge { margin-left: auto; background: var(--green); color: #0d1117; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
  .sidebar-footer { padding: 16px; border-top: 1px solid var(--border); font-size: 12px; flex-shrink: 0; }

  /* ── Header ── */
  .header { height: var(--header-h); background: var(--bg-surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 24px; gap: 14px; position: fixed; top: 0; left: var(--sidebar-w); right: 0; z-index: 90; transition: left var(--transition); }
  .header-search { flex: 1; max-width: 400px; position: relative; }
  .search-input { width: 100%; background: var(--bg-base); border: 1px solid var(--border); border-radius: var(--radius); padding: 8px 14px 8px 36px; font-size: 13.5px; font-family: var(--font); color: var(--text-primary); outline: none; transition: border var(--transition); }
  .search-input:focus { border-color: var(--green); }
  .search-input::placeholder { color: var(--text-muted); }
  .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
  .search-results { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); z-index: 200; }
  .search-result-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; cursor: pointer; transition: background var(--transition); }
  .search-result-item:hover { background: var(--bg-hover); }
  .header-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .icon-btn { width: 36px; height: 36px; border: 1px solid var(--border); border-radius: var(--radius); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: all var(--transition); }
  .icon-btn:hover { background: var(--bg-hover); color: var(--text-primary); border-color: var(--border-hover); }
  .avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #00d395, #3b82f6); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; cursor: pointer; flex-shrink: 0; }
  .dropdown-panel { position: absolute; top: calc(100% + 8px); background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow); z-index: 200; overflow: hidden; min-width: 180px; }
  .dropdown-header { padding: 14px 16px; border-bottom: 1px solid var(--border); }
  .dropdown-item { display: flex; align-items: center; gap: 10px; padding: 11px 16px; font-size: 13px; cursor: pointer; color: var(--text-secondary); transition: background var(--transition); }
  .dropdown-item:hover { background: var(--bg-hover); color: var(--text-primary); }

  /* ── Ticker ── */
  .ticker-row { background: var(--bg-surface); border-bottom: 1px solid var(--border); }
  .ticker-scroll { display: flex; gap: 28px; padding: 9px 24px; overflow-x: auto; scrollbar-width: none; white-space: nowrap; }
  .ticker-scroll::-webkit-scrollbar { display: none; }
  .ticker-item { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
  .ticker-name { font-size: 12px; font-weight: 700; }
  .ticker-val  { font-size: 12px; font-family: var(--mono); color: var(--text-secondary); }
  .ticker-chg  { font-size: 11px; font-weight: 700; }

  /* ── Main ── */
  .main { margin-left: var(--sidebar-w); margin-top: var(--header-h); flex: 1; overflow-y: auto; }
  .page { padding: 24px; max-width: 1400px; margin: 0 auto; }
  .page-header { margin-bottom: 22px; }
  .page-title { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
  .page-subtitle { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }

  /* ── Cards ── */
  .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); }
  .card-header { padding: 14px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .card-title { font-size: 14px; font-weight: 600; }
  .card-body { padding: 16px 20px; }
  .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px 20px; }
  .stat-label { font-size: 11px; color: var(--text-muted); font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; margin-bottom: 6px; }
  .stat-value { font-size: 24px; font-weight: 700; letter-spacing: -0.5px; font-family: var(--mono); }
  .stat-change { font-size: 12px; margin-top: 4px; display: flex; align-items: center; gap: 4px; }

  /* ── Grids ── */
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

  /* ── Table ── */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border); white-space: nowrap; }
  td { padding: 12px 16px; font-size: 13.5px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--bg-hover); }

  /* ── Buttons ── */
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--radius); font-family: var(--font); font-size: 13px; font-weight: 500; cursor: pointer; transition: all var(--transition); border: 1px solid transparent; }
  .btn-primary { background: var(--green); color: #0d1117; }
  .btn-primary:hover { opacity: 0.88; }
  .btn-outline { background: transparent; border-color: var(--border); color: var(--text-secondary); }
  .btn-outline:hover { background: var(--bg-hover); color: var(--text-primary); border-color: var(--border-hover); }
  .btn-danger { background: var(--red-dim); color: var(--red); border-color: transparent; }
  .btn-danger:hover { opacity: 0.8; }

  /* ── Badges ── */
  .badge        { display: inline-block; padding: 3px 9px; border-radius: 6px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .badge-green  { background: var(--green-dim); color: var(--green); }
  .badge-red    { background: var(--red-dim);   color: var(--red); }
  .badge-blue   { background: rgba(59,130,246,0.12); color: #3b82f6; }
  .badge-amber  { background: rgba(245,158,11,0.12);  color: #f59e0b; }
  .ticker-badge { font-family: var(--mono); font-size: 11px; font-weight: 500; background: rgba(0,211,149,0.1); color: var(--green); padding: 3px 7px; border-radius: 5px; white-space: nowrap; }

  /* ── Filter tabs ── */
  .filter-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
  .filter-tab  { padding: 5px 12px; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid var(--border); background: transparent; color: var(--text-secondary); transition: all var(--transition); font-family: var(--font); white-space: nowrap; }
  .filter-tab.active { background: var(--green); color: #0d1117; border-color: var(--green); }
  .filter-tab:hover:not(.active) { background: var(--bg-hover); color: var(--text-primary); }

  /* ── Utility ── */
  .positive { color: var(--green); }
  .negative { color: var(--red); }
  .mono { font-family: var(--mono); }

  /* ── Form ── */
  .input { background: var(--bg-base); border: 1px solid var(--border); border-radius: var(--radius); padding: 9px 14px; font-size: 13.5px; font-family: var(--font); color: var(--text-primary); outline: none; width: 100%; transition: border var(--transition); }
  .input:focus { border-color: var(--green); }
  .input::placeholder { color: var(--text-muted); }
  .input.input-error { border-color: rgba(255,77,77,0.5); }
  .select { background: var(--bg-base); border: 1px solid var(--border); border-radius: var(--radius); padding: 9px 14px; font-size: 13.5px; font-family: var(--font); color: var(--text-primary); outline: none; width: 100%; cursor: pointer; }
  .form-label  { font-size: 11px; font-weight: 600; color: var(--text-secondary); margin-bottom: 7px; display: block; letter-spacing: 0.4px; text-transform: uppercase; }
  .form-group  { margin-bottom: 16px; }
  .form-row    { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .field-error { font-size: 11.5px; color: var(--red); margin-top: 5px; display: flex; align-items: center; gap: 4px; }

  /* ── Modal ── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-lg); width: 100%; max-width: 480px; box-shadow: var(--shadow); max-height: 90vh; overflow-y: auto; }
  .modal-header { padding: 18px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: var(--bg-surface); z-index: 1; }
  .modal-body   { padding: 22px; }
  .modal-footer { padding: 14px 22px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }

  /* ── Skeleton ── */
  .skeleton { background: linear-gradient(90deg, var(--bg-card) 25%, var(--bg-hover) 50%, var(--bg-card) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }

  /* ── Role badges ── */
  .role-badge    { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; }
  .role-admin    { background: rgba(245,158,11,0.15); color: #f5a623; }
  .role-premium  { background: rgba(59,130,246,0.12);  color: #7eb3ff; }
  .role-user     { background: rgba(0,211,149,0.12);   color: var(--green); }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .grid-4 { grid-template-columns: repeat(2,1fr); }
    .grid-3 { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
    .header { left: 0; }
    .main { margin-left: 0; }
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .page { padding: 16px; }
    .header-search { max-width: 180px; }
    #menu-btn { display: flex !important; }
  }
`;

// ─── CHART.JS LOADER ──────────────────────────────────────────────────────────
function useChartJS() {
  const [ready, setReady] = useState(!!window.Chart);
  useEffect(() => {
    if (window.Chart) { setReady(true); return; }
    const s   = document.createElement('script');
    s.src     = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    s.onload  = () => setReady(true);
    s.onerror = () => console.warn('Chart.js failed to load');
    document.head.appendChild(s);
  }, []);
  return ready;
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight:'100vh', background:'#0d1117', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:20, fontFamily:"'Space Grotesk',sans-serif" }}>
      <div style={{ width:44, height:44, background:'#00d395', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:18, color:'#0d1117', boxShadow:'0 0 24px rgba(0,211,149,0.35)' }}>S</div>
      <div style={{ color:'#8b97a8', fontSize:14 }}>Loading StockIQ…</div>
    </div>
  );
}

// ─── DASHBOARD SHELL (uses AppContext) ────────────────────────────────────────
function DashboardShellInner() {
  const { theme, toggleTheme } = useApp();
  const [page,          setPage]          = useState('dashboard');
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [selectedIPO,   setSelectedIPO]   = useState(null);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);

  useChartJS();

  const renderPage = () => {
    switch (page) {
      case 'dashboard':  return <DashboardPage   setPage={setPage} setSelectedStock={setSelectedStock} />;
      case 'watchlist':  return <WatchlistPage   setPage={setPage} setSelectedStock={setSelectedStock} />;
      case 'portfolio':  return <PortfolioPage />;
      case 'ipo':        return <IPOPage         setPage={setPage} setSelectedIPO={setSelectedIPO} />;
      case 'ipoDetail':  return <IPODetailPage   ipoId={selectedIPO} setPage={setPage} />;
      case 'news':       return <NewsPage />;
      case 'stock':      return <StockDetailPage symbol={selectedStock} setPage={setPage} />;
      case 'settings':   return <SettingsPage    toggleTheme={toggleTheme} />;
      default:           return <DashboardPage   setPage={setPage} setSelectedStock={setSelectedStock} />;
    }
  };

  return (
    <div className={`app${theme === 'light' ? ' light-mode' : ''}`}>
      <Sidebar page={page} setPage={setPage} open={sidebarOpen} setOpen={setSidebarOpen} />
      <Header  setPage={setPage} setSelectedStock={setSelectedStock} setSidebarOpen={setSidebarOpen} />
      <div className="main">
        <TickerBar setPage={setPage} setSelectedStock={setSelectedStock} />
        {renderPage()}
      </div>
    </div>
  );
}

function DashboardShell() {
  return (
    <AppProvider>
      <DashboardShellInner />
    </AppProvider>
  );
}

// ─── AUTH GUARD ───────────────────────────────────────────────────────────────
function AppRoot() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user)   return <AuthLayout />;
  return <DashboardShell />;
}

// ─── EXPORTED ROOT ────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <AuthProvider>
        <AppRoot />
      </AuthProvider>
    </>
  );
}
