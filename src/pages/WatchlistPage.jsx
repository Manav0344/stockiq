import React, { useState } from 'react';
import Icon from '../components/Icon';
import Sparkline from '../components/Sparkline';
import { STOCKS, generatePriceData } from '../utils/mockData';
import { useApp } from '../context/AppContext';

export default function WatchlistPage({ setPage, setSelectedStock }) {
  const { watchlist, toggleWatchlist } = useApp();
  const [filter, setFilter] = useState("ALL");

  const filtered = watchlist.filter(sym => {
    const s = STOCKS[sym];
    if (!s) return false;
    if (filter === "GAINERS") return s.changePct > 0;
    if (filter === "LOSERS")  return s.changePct < 0;
    return true;
  });

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="page-title">Watchlist</div>
          <div className="page-subtitle">{watchlist.length} stocks being tracked</div>
        </div>
        <div className="filter-tabs">
          {["ALL", "GAINERS", "LOSERS"].map(f => (
            <button key={f} className={`filter-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👁</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Nothing here</div>
          <div style={{ fontSize: 13 }}>Search stocks and click ★ to add them to your watchlist</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(sym => {
            const s = STOCKS[sym];
            if (!s) return null;
            const spark = generatePriceData(s.price, 20, 0.015);
            return (
              <div key={sym} className="card" style={{ transition: "border-color 0.18s" }}>
                <div
                  style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", cursor: "pointer" }}
                  onClick={() => { setSelectedStock(sym); setPage("stock"); }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "var(--text-secondary)", border: "1px solid var(--border)", flexShrink: 0 }}>
                    {sym.slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{sym} <span style={{ fontWeight: 400, fontSize: 13, color: "var(--text-muted)" }}>{s.name}</span></div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{s.sector} · Vol {s.volume}</div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 90, flexShrink: 0 }}>
                    <div className="mono" style={{ fontSize: 20, fontWeight: 800 }}>${s.price}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.changePct >= 0 ? "var(--green)" : "var(--red)" }}>
                      {s.changePct >= 0 ? "+" : ""}{s.changePct}% ({s.changePct >= 0 ? "+" : ""}{s.change})
                    </div>
                  </div>
                  <Sparkline data={spark} positive={s.changePct >= 0} width={100} height={40} />
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                    <button className="btn btn-outline" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => { setSelectedStock(sym); setPage("stock"); }}>
                      Details
                    </button>
                    <button className="btn btn-danger" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => toggleWatchlist(sym)}>
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: "10px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 28, flexWrap: "wrap" }}>
                  {[["Mkt Cap", s.mktCap], ["P/E", s.pe], ["52W High", "$" + s.high52], ["52W Low", "$" + s.low52]].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{l}</div>
                      <div className="mono" style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
