import React, { useEffect, useRef } from 'react';
import { useStockChart } from '../hooks/useStockData';

const CHART_COLORS = ["#00e5a0", "#3b82f6", "#f59e0b", "#ec4899", "#a855f7", "#14b8a6"];

export default function StockChart({ symbol, filter = "1M", height = 260, compareSymbols = [] }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const { data, loading } = useStockChart(symbol, filter);
  const compareData = {};
  const allSymbols = [symbol, ...compareSymbols];

  useEffect(() => {
    if (!canvasRef.current || !window.Chart || loading || !data.length) return;

    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    const labels   = data.map((_, i) => i);
    const datasets = allSymbols.map((sym, idx) => ({
      label:            sym,
      data:             (idx === 0 ? data : data).map(d => d.price ?? d.close),
      borderColor:      CHART_COLORS[idx % CHART_COLORS.length],
      backgroundColor:  idx === 0 ? "rgba(0,229,160,0.07)" : "transparent",
      borderWidth:      1.8,
      pointRadius:      0,
      pointHoverRadius: 4,
      tension:          0.4,
      fill:             idx === 0,
    }));

    chartRef.current = new window.Chart(canvasRef.current, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: compareSymbols.length > 0,
            labels: { color: "#8b97a8", boxWidth: 10, font: { size: 11, family: "'Space Grotesk', sans-serif" } },
          },
          tooltip: {
            backgroundColor: "#1a2235",
            titleColor:      "#e2e8f0",
            bodyColor:       "#a0aec0",
            borderColor:     "#2d3a4e",
            borderWidth:     1,
            padding:         10,
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: $${ctx.parsed.y.toFixed(2)}`,
            },
          },
        },
        scales: {
          x: { display: false },
          y: {
            grid:  { color: "rgba(255,255,255,0.04)" },
            ticks: { color: "#5a687a", font: { size: 11 }, callback: v => "$" + v.toFixed(0) },
          },
        },
      },
    });

    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [symbol, filter, compareSymbols, data, loading]);

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      {loading && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.1)", borderTop: "2px solid #00e5a0", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      )}
      <canvas ref={canvasRef} />
    </div>
  );
}
