import React, { useState } from 'react';
import Icon from '../components/Icon';
import IPOCard from '../components/IPOCard';
import { useApp } from '../context/AppContext';

export default function IPOPage({ setPage, setSelectedIPO }) {
  const { ipos } = useApp();
  const [filter,       setFilter]       = useState("ALL");
  const [showBookmark, setShowBookmark] = useState(false);

  const filtered = ipos.filter(ipo => {
    if (showBookmark && !ipo.bookmarked) return false;
    if (filter === "ALL") return true;
    return ipo.status === filter.toLowerCase();
  });

  const counts = { upcoming: ipos.filter(i => i.status === "upcoming").length, ongoing: ipos.filter(i => i.status === "ongoing").length, listed: ipos.filter(i => i.status === "listed").length };

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="page-title">IPO Listings</div>
          <div className="page-subtitle">{ipos.length} IPOs tracked · Upcoming, Ongoing & Recently Listed</div>
        </div>
        <button
          className={`btn ${showBookmark ? "btn-primary" : "btn-outline"}`}
          style={{ fontSize: 12, padding: "7px 14px" }}
          onClick={() => setShowBookmark(b => !b)}
        >
          <Icon name="bookmark" size={14} fill={showBookmark ? "currentColor" : "none"} />
          {showBookmark ? "All IPOs" : "Bookmarked"}
        </button>
      </div>

      {/* Stat mini cards */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        {[
          { label: "Upcoming IPOs", value: counts.upcoming, color: "var(--blue)" },
          { label: "Ongoing IPOs",  value: counts.ongoing,  color: "var(--green)" },
          { label: "Recently Listed", value: counts.listed, color: "var(--amber)" },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ padding: "14px 18px" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "var(--mono)" }}>{s.value}</div>
            <div className="stat-label" style={{ marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="filter-tabs" style={{ marginBottom: 20 }}>
        {[
          { key: "ALL",      label: `All (${ipos.length})` },
          { key: "UPCOMING", label: `Upcoming (${counts.upcoming})` },
          { key: "ONGOING",  label: `Ongoing (${counts.ongoing})` },
          { key: "LISTED",   label: `Listed (${counts.listed})` },
        ].map(f => (
          <button key={f.key} className={`filter-tab${filter === f.key ? " active" : ""}`} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>No IPOs found</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Try a different filter or check back soon</div>
        </div>
      ) : (
        <div className="grid-2">
          {filtered.map(ipo => (
            <IPOCard key={ipo.id} ipo={ipo} onClick={() => { setSelectedIPO(ipo.id); setPage("ipoDetail"); }} />
          ))}
        </div>
      )}
    </div>
  );
}
