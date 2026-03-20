import React from 'react';
import Icon from '../components/Icon';
import { useApp } from '../context/AppContext';

export default function IPODetailPage({ ipoId, setPage }) {
  const { ipos, toggleIPOBookmark } = useApp();
  const ipo = ipos.find(i => i.id === ipoId);

  if (!ipo) return (
    <div className="page">
      <button className="btn btn-outline" onClick={() => setPage("ipo")} style={{ marginBottom: 20 }}><Icon name="back" size={15} /> Back</button>
      <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>IPO not found.</div>
    </div>
  );

  const statusColor = { upcoming: "badge-blue", ongoing: "badge-green", listed: "badge-amber" };
  const gmpPositive = ipo.gmp?.startsWith("+");

  let listingGain = null;
  if (ipo.listingPrice && ipo.currentPrice) {
    const lp = parseFloat(ipo.listingPrice.replace("₹", ""));
    const cp = parseFloat(ipo.currentPrice.replace("₹", ""));
    listingGain = ((cp - lp) / lp * 100).toFixed(1);
  }

  return (
    <div className="page">
      <button className="btn btn-outline" onClick={() => setPage("ipo")} style={{ marginBottom: 20 }}>
        <Icon name="back" size={15} /> Back to IPOs
      </button>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
            <div className="page-title" style={{ marginBottom: 0 }}>{ipo.company}</div>
            <span className={`badge ${statusColor[ipo.status]}`}>{ipo.status}</span>
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 8 }}>{ipo.sector} · NSE: {ipo.symbol}</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 520, lineHeight: 1.6 }}>{ipo.desc}</div>
        </div>
        <button className={`btn ${ipo.bookmarked ? "btn-primary" : "btn-outline"}`} onClick={() => toggleIPOBookmark(ipo.id)}>
          <Icon name="bookmark" size={15} fill={ipo.bookmarked ? "currentColor" : "none"} />
          {ipo.bookmarked ? "Bookmarked" : "Bookmark"}
        </button>
      </div>

      {/* Key stats */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: "Issue Price",  value: ipo.issuePrice },
          { label: "Lot Size",     value: ipo.lotSize + " shares" },
          { label: "Issue Size",   value: ipo.size },
          { label: "GMP",          value: ipo.gmp, color: gmpPositive ? "var(--green)" : "var(--red)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6, color: s.color || "var(--text-primary)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Timeline & Subscription */}
        <div className="card">
          <div className="card-header"><div className="card-title">Timeline & Subscription</div></div>
          <div className="card-body" style={{ padding: "8px 20px" }}>
            {[
              ["Open Date",    ipo.openDate],
              ["Close Date",   ipo.closeDate],
              ["Listing Date", ipo.listingDate],
              ["Subscription", ipo.subscribed || "Not yet open"],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{l}</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: l === "Subscription" && ipo.subscribed ? "var(--blue)" : "var(--text-primary)" }}>{v}</span>
              </div>
            ))}
            {ipo.subscribed && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Subscription level</div>
                <div style={{ height: 8, background: "var(--bg-hover)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: Math.min(parseFloat(ipo.subscribed) * 4, 100) + "%", background: "var(--blue)", borderRadius: 4, transition: "width 1s ease" }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{ipo.subscribed} times oversubscribed</div>
              </div>
            )}
          </div>
        </div>

        {/* Financials */}
        <div className="card">
          <div className="card-header"><div className="card-title">Company Financials</div></div>
          <div className="card-body" style={{ padding: "8px 20px" }}>
            {[
              ["Revenue (FY23)",  ipo.revenue],
              ["Net Profit (FY23)", ipo.profit],
              ["Listing Price",  ipo.listingPrice || "TBD"],
              ["Current Price",  ipo.currentPrice || "TBD"],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{l}</span>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{v}</span>
              </div>
            ))}
            {listingGain !== null && (
              <div style={{ marginTop: 16, padding: 14, background: "var(--green-dim)", borderRadius: "var(--radius)", border: "1px solid rgba(0,229,160,0.2)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Total Listing Gain</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--green)", marginTop: 4 }}>+{listingGain}%</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>From listing price to current price</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GMP Tracker */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><div className="card-title">Grey Market Premium (GMP)</div></div>
        <div className="card-body">
          <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Current GMP</div>
              <div style={{ fontSize: 38, fontWeight: 900, color: gmpPositive ? "var(--green)" : "var(--red)", fontFamily: "var(--mono)" }}>{ipo.gmp}</div>
            </div>
            <div style={{ flex: 1, minWidth: 220, padding: 16, background: "var(--bg-base)", borderRadius: "var(--radius)", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
              <Icon name="info" size={14} style={{ marginRight: 6, color: "var(--blue)" }} />
              <strong>Disclaimer:</strong> GMP is an unofficial, unregulated market indicator. It reflects grey-market sentiment only and should <em>not</em> be the sole basis for investment decisions. Always conduct thorough due diligence before applying to any IPO.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
