import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import { STOCKS } from '../utils/mockData';
import { useApp } from '../context/AppContext';

const COLORS = ["#00e5a0", "#3b82f6", "#f59e0b", "#a855f7", "#ec4899", "#14b8a6", "#f97316", "#ef4444"];

export default function PortfolioPage() {
  const { portfolio, addHolding, removeHolding } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ symbol: "AAPL", qty: "", buyPrice: "", date: "" });
  const [formErr, setFormErr] = useState({});
  const donutRef   = useRef(null);
  const chartRef   = useRef(null);
  const lineRef    = useRef(null);
  const lineChartR = useRef(null);

  const calc = portfolio.map(p => {
    const cur      = STOCKS[p.symbol]?.price || p.buyPrice;
    const invested = p.buyPrice * p.qty;
    const current  = cur * p.qty;
    return { ...p, cur, invested, current, pl: current - invested, plPct: ((current - invested) / invested) * 100 };
  });

  const totalInvested = calc.reduce((s, p) => s + p.invested, 0);
  const totalCurrent  = calc.reduce((s, p) => s + p.current, 0);
  const totalPL       = totalCurrent - totalInvested;
  const totalPLPct    = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

  // Donut chart
  useEffect(() => {
    if (!donutRef.current || !window.Chart || calc.length === 0) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    chartRef.current = new window.Chart(donutRef.current, {
      type: "doughnut",
      data: {
        labels:   calc.map(p => p.symbol),
        datasets: [{ data: calc.map(p => p.current), backgroundColor: COLORS.slice(0, calc.length), borderWidth: 0, hoverOffset: 4 }],
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: "68%", plugins: { legend: { display: false }, tooltip: { backgroundColor: "#1a2235", titleColor: "#e2e8f0", bodyColor: "#a0aec0" } } },
    });
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [portfolio]);

  // Line chart (P&L over time - simulated)
  useEffect(() => {
    if (!lineRef.current || !window.Chart || calc.length === 0) return;
    if (lineChartR.current) { lineChartR.current.destroy(); lineChartR.current = null; }
    const labels = Array.from({ length: 30 }, (_, i) => i + 1);
    const values = labels.map((_, i) => totalPL * (0.3 + (i / 29) * 0.7) + (Math.random() - 0.48) * Math.abs(totalPL) * 0.15);
    lineChartR.current = new window.Chart(lineRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "P&L", data: values,
          borderColor: totalPL >= 0 ? "#00e5a0" : "#ff4d4d",
          backgroundColor: totalPL >= 0 ? "rgba(0,229,160,0.06)" : "rgba(255,77,77,0.06)",
          borderWidth: 1.5, pointRadius: 0, tension: 0.4, fill: true,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: "#1a2235", titleColor: "#e2e8f0", bodyColor: "#a0aec0", callbacks: { label: ctx => ` P&L: $${ctx.parsed.y.toFixed(2)}` } } },
        scales: { x: { display: false }, y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#5a687a", font: { size: 11 }, callback: v => "$" + v.toFixed(0) } } },
      },
    });
    return () => { if (lineChartR.current) { lineChartR.current.destroy(); lineChartR.current = null; } };
  }, [portfolio]);

  const validate = () => {
    const e = {};
    if (!form.symbol) e.symbol = "Required";
    if (!form.qty || isNaN(form.qty) || +form.qty <= 0) e.qty = "Enter valid quantity";
    if (!form.buyPrice || isNaN(form.buyPrice) || +form.buyPrice <= 0) e.buyPrice = "Enter valid price";
    return e;
  };

  const handleAdd = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErr(errs); return; }
    addHolding({ symbol: form.symbol, qty: +form.qty, buyPrice: +form.buyPrice, date: form.date || new Date().toLocaleDateString() });
    setShowModal(false);
    setForm({ symbol: "AAPL", qty: "", buyPrice: "", date: "" });
    setFormErr({});
  };

  const F = k => v => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="page-title">Portfolio</div>
          <div className="page-subtitle">Track your investments and P&L in real time</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Icon name="plus" size={15} /> Add Holding
        </button>
      </div>

      {/* Summary */}
      <div className="grid-3" style={{ marginBottom: 16 }}>
        {[
          { label: "Total Invested",  value: "$" + totalInvested.toFixed(2), color: "var(--text-primary)" },
          { label: "Current Value",   value: "$" + totalCurrent.toFixed(2),  color: "var(--text-primary)" },
          { label: "Total P&L",       value: (totalPL >= 0 ? "+" : "") + "$" + totalPL.toFixed(2) + "  (" + totalPLPct.toFixed(2) + "%)", color: totalPL >= 0 ? "var(--green)" : "var(--red)" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="mono" style={{ fontSize: 22, fontWeight: 800, marginTop: 6, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {portfolio.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>📈</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No holdings yet</div>
          <div style={{ fontSize: 13, marginBottom: 24 }}>Add your first investment to start tracking performance</div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Icon name="plus" size={15} /> Add First Holding</button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {/* Charts column */}
          <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <div className="card-header"><div className="card-title">Allocation</div></div>
              <div className="card-body">
                <div style={{ position: "relative", width: "100%", height: 200 }}>
                  <canvas ref={donutRef} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                  {calc.map((p, i) => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-secondary)" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      {p.symbol} ({totalCurrent > 0 ? ((p.current / totalCurrent) * 100).toFixed(1) : 0}%)
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><div className="card-title">P&L Trend (30d)</div></div>
              <div className="card-body">
                <div style={{ position: "relative", width: "100%", height: 140 }}>
                  <canvas ref={lineRef} />
                </div>
              </div>
            </div>
          </div>

          {/* Holdings table */}
          <div style={{ flex: "2 1 380px" }}>
            <div className="card">
              <div className="card-header"><div className="card-title">Holdings ({calc.length})</div></div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Symbol</th><th>Qty</th><th>Buy Price</th><th>Current</th><th>Invested</th><th>P&L</th><th></th></tr>
                  </thead>
                  <tbody>
                    {calc.map((p, i) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                            <span className="ticker-badge">{p.symbol}</span>
                          </div>
                        </td>
                        <td className="mono">{p.qty}</td>
                        <td className="mono">${p.buyPrice.toFixed(2)}</td>
                        <td className="mono">${p.cur.toFixed(2)}</td>
                        <td className="mono">${p.invested.toFixed(2)}</td>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: 13, color: p.pl >= 0 ? "var(--green)" : "var(--red)" }}>
                            {p.pl >= 0 ? "+" : ""}${p.pl.toFixed(2)}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            {p.plPct >= 0 ? "+" : ""}{p.plPct.toFixed(2)}%
                          </div>
                        </td>
                        <td>
                          <button className="btn btn-danger" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => removeHolding(p.id)}>
                            <Icon name="trash" size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setFormErr({}); }} title="Add Investment"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => { setShowModal(false); setFormErr({}); }}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}><Icon name="plus" size={14} /> Add Holding</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Stock Symbol</label>
          <select className="select" value={form.symbol} onChange={e => F("symbol")(e.target.value)}>
            {Object.entries(STOCKS).map(([s, d]) => <option key={s} value={s}>{s} — {d.name}</option>)}
          </select>
        </div>
        {form.symbol && STOCKS[form.symbol] && (
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14, padding: "8px 12px", background: "var(--bg-base)", borderRadius: 8 }}>
            Current price: <strong style={{ color: "var(--text-primary)" }}>${STOCKS[form.symbol].price}</strong> &nbsp;|&nbsp; Change: <strong style={{ color: STOCKS[form.symbol].changePct >= 0 ? "var(--green)" : "var(--red)" }}>{STOCKS[form.symbol].changePct >= 0 ? "+" : ""}{STOCKS[form.symbol].changePct}%</strong>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Quantity (shares)</label>
          <input className={`input${formErr.qty ? " input-error" : ""}`} type="number" min="1" placeholder="e.g. 10" value={form.qty} onChange={e => F("qty")(e.target.value)} />
          {formErr.qty && <div className="field-error">{formErr.qty}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Buy Price (USD)</label>
          <input className={`input${formErr.buyPrice ? " input-error" : ""}`} type="number" min="0" step="0.01" placeholder="e.g. 175.50" value={form.buyPrice} onChange={e => F("buyPrice")(e.target.value)} />
          {formErr.buyPrice && <div className="field-error">{formErr.buyPrice}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Purchase Date (optional)</label>
          <input className="input" type="date" value={form.date} onChange={e => F("date")(e.target.value)} />
        </div>
        {form.qty && form.buyPrice && (
          <div style={{ padding: "10px 14px", background: "var(--bg-base)", borderRadius: 8, fontSize: 13 }}>
            Total invested: <strong className="mono">${(+form.qty * +form.buyPrice).toFixed(2)}</strong>
          </div>
        )}
      </Modal>
    </div>
  );
}
