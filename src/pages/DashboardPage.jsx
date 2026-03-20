import React, { useState } from 'react';
import Icon from '../components/Icon';
import StockChart from '../components/StockChart';
import Sparkline from '../components/Sparkline';
import { STOCKS, INDICES, generatePriceData } from '../utils/mockData';
import { useApp } from '../context/AppContext';

export default function DashboardPage({ setPage, setSelectedStock }) {
  const { watchlist, portfolio } = useApp();
  const [chartFilter,  setChartFilter]  = useState("1M");
  const [compareMode,  setCompareMode]  = useState(false);
  const [compareStock, setCompareStock] = useState("MSFT");

  const gainers = Object.entries(STOCKS).filter(([, s]) => s.changePct > 0).sort((a, b) => b[1].changePct - a[1].changePct).slice(0, 5);
  const losers  = Object.entries(STOCKS).filter(([, s]) => s.changePct < 0).sort((a, b) => a[1].changePct - b[1].changePct).slice(0, 5);

  const portfolioValue = portfolio.reduce((sum, p) => {
    const cur = STOCKS[p.symbol]?.price || p.buyPrice;
    return sum + cur * p.qty;
  }, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Market Dashboard</div>
        <div className="page-subtitle">
          Live overview · {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: "NIFTY 50",       value: "22,419",                                 change: "+0.64%", positive: true  },
          { label: "SENSEX",         value: "73,961",                                 change: "+0.67%", positive: true  },
          { label: "S&P 500",        value: "5,308",                                  change: "-0.24%", positive: false },
          { label: "Portfolio Value", value: portfolioValue > 0 ? "$" + portfolioValue.toFixed(0) : "—", change: "Add stocks ↗", positive: true  },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-change ${s.positive ? "positive" : "negative"}`}>
              <Icon name={s.positive ? "arrowUp" : "arrowDown"} size={12} />
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main chart + Indices */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ flex: "2 1 480px", minWidth: 0 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Price Chart</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>AAPL — Interactive</div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)", cursor: "pointer" }}>
                  <input type="checkbox" checked={compareMode} onChange={e => setCompareMode(e.target.checked)} style={{ accentColor: "var(--green)", width: 14, height: 14 }} />
                  Compare
                </label>
                {compareMode && (
                  <select className="select" style={{ width: "auto", padding: "4px 10px", fontSize: 12 }} value={compareStock} onChange={e => setCompareStock(e.target.value)}>
                    {Object.keys(STOCKS).filter(s => s !== "AAPL").map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
                <div className="filter-tabs">
                  {["1D", "1W", "1M", "1Y", "MAX"].map(f => (
                    <button key={f} className={`filter-tab${chartFilter === f ? " active" : ""}`} onClick={() => setChartFilter(f)}>{f}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-body">
              <StockChart symbol="AAPL" filter={chartFilter} height={240} compareSymbols={compareMode ? [compareStock] : []} />
            </div>
          </div>
        </div>

        {/* Indices panel */}
        <div style={{ flex: "1 1 220px", minWidth: 0 }}>
          <div className="card" style={{ height: "100%" }}>
            <div className="card-header"><div className="card-title">Indices</div></div>
            <div>
              {INDICES.map(idx => (
                <div key={idx.name} style={{ padding: "11px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{idx.name}</div>
                    <div className="mono" style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{idx.value}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: idx.positive ? "var(--green)" : "var(--red)" }}>{idx.pct}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{idx.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gainers & Losers */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        {[
          { title: "Top Gainers 🚀", data: gainers, positive: true  },
          { title: "Top Losers  📉", data: losers,  positive: false },
        ].map(({ title, data, positive }) => (
          <div key={title} className="card">
            <div className="card-header"><div className="card-title">{title}</div></div>
            <div className="card-body" style={{ padding: "8px 20px" }}>
              {data.map(([sym, s]) => {
                const spark = generatePriceData(s.price, 12, 0.01);
                return (
                  <div key={sym} onClick={() => { setSelectedStock(sym); setPage("stock"); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, color: "var(--text-secondary)", flexShrink: 0 }}>{sym.slice(0, 2)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{sym}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.sector}</div>
                    </div>
                    <Sparkline data={spark} positive={positive} width={56} height={26} />
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>${s.price}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: positive ? "var(--green)" : "var(--red)" }}>
                        {positive ? "+" : ""}{s.changePct}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Watchlist preview */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Watchlist</div>
          <button className="btn btn-outline" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setPage("watchlist")}>
            View All <Icon name="arrowRight" size={13} />
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Symbol</th><th>Company</th><th>Price</th><th>Change</th><th>Volume</th><th>Mkt Cap</th><th>7D</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.slice(0, 6).map(sym => {
                const s = STOCKS[sym];
                if (!s) return null;
                return (
                  <tr key={sym} onClick={() => { setSelectedStock(sym); setPage("stock"); }} style={{ cursor: "pointer" }}>
                    <td><span className="ticker-badge">{sym}</span></td>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td className="mono" style={{ fontWeight: 600 }}>${s.price}</td>
                    <td>
                      <span className={`badge ${s.changePct >= 0 ? "badge-green" : "badge-red"}`}>
                        {s.changePct >= 0 ? "+" : ""}{s.changePct}%
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{s.volume}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{s.mktCap}</td>
                    <td><Sparkline data={generatePriceData(s.price, 12, 0.01)} positive={s.changePct >= 0} width={70} height={28} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
