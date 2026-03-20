import React from 'react';
import { INDICES, STOCKS } from '../utils/mockData';

export default function TickerBar({ setPage, setSelectedStock }) {
  return (
    <div className="ticker-row">
      <div className="ticker-scroll">
        {INDICES.map(idx => (
          <div key={idx.name} className="ticker-item">
            <span className="ticker-name">{idx.name}</span>
            <span className="ticker-val">{idx.value}</span>
            <span className={`ticker-chg ${idx.positive ? "positive" : "negative"}`}>
              {idx.change} ({idx.pct})
            </span>
          </div>
        ))}
        <span style={{ width: 1, background: "var(--border)", alignSelf: "stretch", margin: "4px 0" }} />
        {Object.entries(STOCKS).slice(0, 6).map(([sym, s]) => (
          <div
            key={sym}
            className="ticker-item"
            onClick={() => { setSelectedStock(sym); setPage("stock"); }}
            style={{ cursor: "pointer" }}
          >
            <span className="ticker-name">{sym}</span>
            <span className="ticker-val mono">${s.price}</span>
            <span className={`ticker-chg ${s.changePct >= 0 ? "positive" : "negative"}`}>
              {s.changePct >= 0 ? "+" : ""}{s.changePct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
