import React from 'react';
import Icon from './Icon';
import { useApp } from '../context/AppContext';

const STATUS_MAP = {
  upcoming: { label: "Upcoming", cls: "badge-blue" },
  ongoing:  { label: "Ongoing",  cls: "badge-green" },
  listed:   { label: "Listed",   cls: "badge-amber" },
};

export default function IPOCard({ ipo, onClick }) {
  const { toggleIPOBookmark } = useApp();
  const status = STATUS_MAP[ipo.status] || STATUS_MAP.upcoming;
  const gmpPositive = ipo.gmp?.startsWith("+");

  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "20px",
        cursor: "pointer", transition: "border-color 0.18s, transform 0.18s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{ipo.company}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{ipo.sector} · {ipo.symbol}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className={`badge ${status.cls}`}>{status.label}</span>
          <button
            style={{ background: "none", border: "none", cursor: "pointer", color: ipo.bookmarked ? "var(--amber)" : "var(--text-muted)", padding: 4, transition: "color 0.18s" }}
            onClick={e => { e.stopPropagation(); toggleIPOBookmark(ipo.id); }}
          >
            <Icon name="bookmark" size={16} fill={ipo.bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Key Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[["Issue Price", ipo.issuePrice], ["Lot Size", ipo.lotSize + " sh."], ["Size", ipo.size]].map(([l, v]) => (
          <div key={l}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 3 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Dates */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "12px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
        {[["Open", ipo.openDate], ["Close", ipo.closeDate], ["Listing", ipo.listingDate]].map(([l, v]) => (
          <div key={l}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
            <div style={{ fontSize: 11, fontWeight: 500, marginTop: 3 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 16 }}>
          {ipo.subscribed && (
            <div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Subscribed</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--blue)" }}>{ipo.subscribed}</div>
              <div style={{ width: 64, height: 4, background: "var(--bg-hover)", borderRadius: 2, marginTop: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: Math.min(parseFloat(ipo.subscribed) * 6, 100) + "%", background: "var(--blue)", borderRadius: 2 }} />
              </div>
            </div>
          )}
          {ipo.status === "listed" && ipo.currentPrice && (
            <div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>CMP</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--green)" }}>{ipo.currentPrice}</div>
            </div>
          )}
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 7, background: gmpPositive ? "var(--green-dim)" : "var(--red-dim)", color: gmpPositive ? "var(--green)" : "var(--red)" }}>
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase" }}>GMP</span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>{ipo.gmp}</span>
        </div>
      </div>
    </div>
  );
}
