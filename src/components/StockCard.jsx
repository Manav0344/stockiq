import React from 'react';
import Icon from './Icon';
import Sparkline from './Sparkline';
import { generatePriceData } from '../utils/mockData';
import { useApp } from '../context/AppContext';

export default function StockCard({ symbol, stock, onClick, compact = false }) {
  const { isWatching, toggleWatchlist } = useApp();
  const watching  = isWatching(symbol);
  const positive  = stock.changePct >= 0;
  const sparkData = generatePriceData(stock.price, 16, 0.012);

  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: compact ? "14px 16px" : "18px 20px",
        cursor: "pointer", transition: "border-color 0.18s, transform 0.18s",
        display: "flex", alignItems: "center", gap: 14,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Logo */}
      <div style={{ width: 38, height: 38, borderRadius: 9, background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "var(--text-secondary)", border: "1px solid var(--border)", flexShrink: 0 }}>
        {symbol.slice(0, 2)}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{symbol}</div>
        {!compact && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stock.name}</div>}
      </div>

      {/* Sparkline */}
      <Sparkline data={sparkData} positive={positive} width={60} height={28} />

      {/* Price */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 700 }}>${stock.price}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: positive ? "var(--green)" : "var(--red)" }}>
          {positive ? "+" : ""}{stock.changePct}%
        </div>
      </div>

      {/* Watch toggle */}
      <button
        onClick={e => { e.stopPropagation(); toggleWatchlist(symbol); }}
        style={{ background: "none", border: "none", cursor: "pointer", color: watching ? "#f59e0b" : "var(--text-muted)", padding: 4, flexShrink: 0, transition: "color 0.18s" }}
      >
        <Icon name="star" size={15} fill={watching ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
