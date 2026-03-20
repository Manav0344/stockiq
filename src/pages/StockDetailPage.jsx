import React, { useState } from 'react';
import Icon from '../components/Icon';
import StockChart from '../components/StockChart';
import Modal from '../components/Modal';
import { STOCKS } from '../utils/mockData';
import { useApp } from '../context/AppContext';

export default function StockDetailPage({ symbol, setPage }) {
  const { isWatching, toggleWatchlist, addAlert, addHolding } = useApp();
  const [chartFilter, setChartFilter] = useState("1M");
  const [compareMode, setCompareMode] = useState(false);
  const [compareStock, setCompareStock] = useState("MSFT");
  const [showAlertModal, setShowAlertModal]   = useState(false);
  const [showBuyModal,   setShowBuyModal]     = useState(false);
  const [alertPrice, setAlertPrice] = useState("");
  const [buyForm,    setBuyForm]    = useState({ qty: "", buyPrice: "" });

  const stock    = STOCKS[symbol];
  const watching = isWatching(symbol);

  if (!stock) return (
    <div className="page">
      <button className="btn btn-outline" onClick={() => setPage("dashboard")} style={{ marginBottom: 20 }}><Icon name="back" size={15} /> Back</button>
      <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Stock not found: {symbol}</div>
    </div>
  );

  const handleAddAlert = () => {
    if (!alertPrice) return;
    addAlert({ symbol, price: +alertPrice, condition: +alertPrice > stock.price ? "above" : "below" });
    setShowAlertModal(false);
    setAlertPrice("");
  };

  const handleBuy = () => {
    if (!buyForm.qty || !buyForm.buyPrice) return;
    addHolding({ symbol, qty: +buyForm.qty, buyPrice: +buyForm.buyPrice, date: new Date().toLocaleDateString() });
    setShowBuyModal(false);
    setBuyForm({ qty: "", buyPrice: "" });
  };

  return (
    <div className="page">
      <button className="btn btn-outline" onClick={() => setPage("dashboard")} style={{ marginBottom: 20 }}>
        <Icon name="back" size={15} /> Dashboard
      </button>

      {/* Stock header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ width: 54, height: 54, borderRadius: 12, background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "var(--text-secondary)", border: "1px solid var(--border)", flexShrink: 0 }}>
          {symbol.slice(0, 2)}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>{symbol}</div>
            <span className="badge badge-blue">{stock.sector}</span>
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 10 }}>{stock.name}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <div className="mono" style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1 }}>${stock.price}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: stock.changePct >= 0 ? "var(--green)" : "var(--red)" }}>
              {stock.changePct >= 0 ? "+" : ""}{stock.change} ({stock.changePct >= 0 ? "+" : ""}{stock.changePct}%)
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flexShrink: 0 }}>
          <button className={`btn ${watching ? "btn-primary" : "btn-outline"}`} onClick={() => toggleWatchlist(symbol)}>
            <Icon name="star" size={15} fill={watching ? "currentColor" : "none"} />
            {watching ? "Watching" : "Watch"}
          </button>
          <button className="btn btn-outline" onClick={() => setShowAlertModal(true)}>
            <Icon name="bell" size={15} /> Alert
          </button>
          <button className="btn btn-primary" onClick={() => { setBuyForm({ qty: "", buyPrice: stock.price }); setShowBuyModal(true); }}>
            <Icon name="plus" size={15} /> Add to Portfolio
          </button>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid-4" style={{ marginBottom: 16 }}>
        {[["Volume", stock.volume], ["Mkt Cap", stock.mktCap], ["P/E Ratio", stock.pe], ["52W Range", "$" + stock.low52 + " – $" + stock.high52]].map(([l, v]) => (
          <div key={l} className="stat-card">
            <div className="stat-label">{l}</div>
            <div className="mono" style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">{symbol} Price Chart</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)", cursor: "pointer" }}>
              <input type="checkbox" checked={compareMode} onChange={e => setCompareMode(e.target.checked)} style={{ accentColor: "var(--green)", width: 13, height: 13 }} />
              Compare
            </label>
            {compareMode && (
              <select className="select" style={{ width: "auto", padding: "4px 10px", fontSize: 12 }} value={compareStock} onChange={e => setCompareStock(e.target.value)}>
                {Object.keys(STOCKS).filter(s => s !== symbol).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
            <div className="filter-tabs">
              {["1D", "1W", "1M", "3M", "1Y", "MAX"].map(f => (
                <button key={f} className={`filter-tab${chartFilter === f ? " active" : ""}`} onClick={() => setChartFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="card-body">
          <StockChart symbol={symbol} filter={chartFilter} height={300} compareSymbols={compareMode ? [compareStock] : []} />
        </div>
      </div>

      {/* About */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><div className="card-title">About {stock.name}</div></div>
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
          {[
            ["Sector",       stock.sector],
            ["Market Cap",   stock.mktCap],
            ["P/E Ratio",    stock.pe],
            ["52W High",     "$" + stock.high52],
            ["52W Low",      "$" + stock.low52],
            ["Volume",       stock.volume],
          ].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{l}</div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert modal */}
      <Modal open={showAlertModal} onClose={() => setShowAlertModal(false)} title={`Set Price Alert — ${symbol}`}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowAlertModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddAlert}><Icon name="bell" size={14} /> Set Alert</button>
          </>
        }
      >
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
          Current price: <strong style={{ color: "var(--text-primary)" }}>${stock.price}</strong>
          <br />Alert fires when price goes {alertPrice && +alertPrice > stock.price ? "above" : "below"} your target.
        </div>
        <div className="form-group">
          <label className="form-label">Target Price (USD)</label>
          <input className="input" type="number" step="0.01" placeholder={`e.g. ${(stock.price + 10).toFixed(2)}`} value={alertPrice} onChange={e => setAlertPrice(e.target.value)} autoFocus />
        </div>
      </Modal>

      {/* Buy / Add to portfolio modal */}
      <Modal open={showBuyModal} onClose={() => setShowBuyModal(false)} title={`Add ${symbol} to Portfolio`}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowBuyModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleBuy}><Icon name="plus" size={14} /> Add Holding</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Quantity</label>
          <input className="input" type="number" min="1" placeholder="e.g. 10" value={buyForm.qty} onChange={e => setBuyForm(f => ({ ...f, qty: e.target.value }))} autoFocus />
        </div>
        <div className="form-group">
          <label className="form-label">Buy Price</label>
          <input className="input" type="number" step="0.01" value={buyForm.buyPrice} onChange={e => setBuyForm(f => ({ ...f, buyPrice: e.target.value }))} />
        </div>
        {buyForm.qty && buyForm.buyPrice && (
          <div style={{ padding: "10px 14px", background: "var(--bg-base)", borderRadius: 8, fontSize: 13 }}>
            Total: <strong className="mono">${(+buyForm.qty * +buyForm.buyPrice).toFixed(2)}</strong>
          </div>
        )}
      </Modal>
    </div>
  );
}
