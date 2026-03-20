import React from 'react';

export function Skeleton({ width = "100%", height = 16, radius = 6, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <Skeleton height={18} width="40%" radius={6} style={{ marginBottom: 14 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={14} width={i % 2 === 0 ? "80%" : "60%"} radius={5} style={{ marginBottom: 10 }} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i} style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
              <Skeleton height={11} width={50 + i * 10} radius={4} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                <Skeleton height={13} width={40 + (r + c) * 8} radius={4} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
