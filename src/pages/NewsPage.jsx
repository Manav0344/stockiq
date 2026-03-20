import React, { useState } from 'react';
import { NEWS_DATA } from '../utils/mockData';

const TAGS = ["ALL", "Macro", "Earnings", "India", "Auto", "Regulation", "Tech"];

export default function NewsPage() {
  const [activeTag, setActiveTag] = useState("ALL");
  const filtered = activeTag === "ALL" ? NEWS_DATA : NEWS_DATA.filter(n => n.tag === activeTag);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Market News</div>
        <div className="page-subtitle">Latest financial news and market-moving events</div>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 24 }}>
        {TAGS.map(t => (
          <button key={t} className={`filter-tab${activeTag === t ? " active" : ""}`} onClick={() => setActiveTag(t)}>{t}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(news => (
          <div
            key={news.id}
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px 20px", display: "flex", gap: 16, cursor: "pointer", transition: "background 0.18s, border-color 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.borderColor = "var(--border-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-card)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <div style={{ width: 52, height: 52, borderRadius: "var(--radius)", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
              {news.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                <span className="badge badge-blue">{news.tag}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{news.source} · {news.time}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, marginBottom: 6 }}>{news.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{news.summary}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
