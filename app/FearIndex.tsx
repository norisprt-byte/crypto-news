"use client";

import { useEffect, useState } from "react";

function getFearColor(value: number) {
  if (value <= 25) return { bg: "#ef444420", color: "#ef4444", label: "Extreme Fear" };
  if (value <= 45) return { bg: "#f9731620", color: "#f97316", label: "Fear" };
  if (value <= 55) return { bg: "#eab30820", color: "#eab308", label: "Neutral" };
  if (value <= 75) return { bg: "#22c55e20", color: "#22c55e", label: "Greed" };
  return { bg: "#16a34a20", color: "#16a34a", label: "Extreme Greed" };
}

function FearGauge({ value }: { value: number }) {
  const { color } = getFearColor(value);
  const angle = (value / 100) * 180 - 90;
  const needleRad = (angle * Math.PI) / 180;
  const cx = 80, cy = 80, r = 60;
  const nx = cx + r * 0.75 * Math.cos(needleRad);
  const ny = cy + r * 0.75 * Math.sin(needleRad);

  const segments = [
    { start: -180, end: -144, color: "#ef4444" },
    { start: -144, end: -108, color: "#f97316" },
    { start: -108, end: -72, color: "#eab308" },
    { start: -72, end: -36, color: "#84cc16" },
    { start: -36, end: 0, color: "#22c55e" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <svg width="160" height="90" viewBox="0 0 160 90">
        {segments.map((seg, i) => {
          const s = (seg.start * Math.PI) / 180;
          const e = (seg.end * Math.PI) / 180;
          const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
          const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
          const ix1 = cx + (r - 12) * Math.cos(s), iy1 = cy + (r - 12) * Math.sin(s);
          const ix2 = cx + (r - 12) * Math.cos(e), iy2 = cy + (r - 12) * Math.sin(e);
          return (
            <path key={i}
              d={`M ${ix1} ${iy1} A ${r - 12} ${r - 12} 0 0 1 ${ix2} ${iy2} L ${x2} ${y2} A ${r} ${r} 0 0 0 ${x1} ${y1} Z`}
              fill={seg.color} opacity="0.8"
            />
          );
        })}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill="#fff" />
      </svg>
      <div style={{ fontSize: "32px", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

export default function FearIndex() {
  const [data, setData] = useState<{ value: number; label: string; yesterday: number; lastWeek: number } | null>(null);

  useEffect(() => {
    fetch("https://api.alternative.me/fng/?limit=7")
      .then((r) => r.json())
      .then((json) => {
        const results = json.data;
        setData({
          value: parseInt(results[0].value),
          label: results[0].value_classification,
          yesterday: parseInt(results[1].value),
          lastWeek: parseInt(results[6].value),
        });
      })
      .catch(() => {
        setData({ value: 46, label: "Fear", yesterday: 32, lastWeek: 23 });
      });
  }, []);

  if (!data) {
    return (
      <div style={{ textAlign: "center", padding: "32px", color: "#555", fontSize: "13px", background: "#111", borderRadius: "16px", marginBottom: "32px" }}>
        Loading Fear & Greed Index...
      </div>
    );
  }

  const { bg: bgNow, color: colorNow } = getFearColor(data.value);
  const { color: colorYest } = getFearColor(data.yesterday);
  const { color: colorWeek } = getFearColor(data.lastWeek);

  return (
    <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "24px", marginBottom: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#555", letterSpacing: "0.1em", margin: "0 0 4px" }}>FEAR & GREED INDEX</p>
          <p style={{ fontSize: "11px", color: "#444", margin: 0 }}>by alternative.me · live data</p>
        </div>
        <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "11px", color: "#555", textDecoration: "none" }}>
          View full index →
        </a>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", flexWrap: "wrap", gap: "16px" }}>
        <FearGauge value={data.value} />
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ fontSize: "12px", color: colorNow, fontWeight: 700, marginBottom: "4px" }}>{data.label}</div>
          {[
            { label: "Now", value: data.value, color: colorNow },
            { label: "Yesterday", value: data.yesterday, color: colorYest },
            { label: "Last week", value: data.lastWeek, color: colorWeek },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "12px", color: "#555", minWidth: "72px" }}>{item.label}</span>
              <div style={{ width: "80px", height: "4px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: item.value + "%", height: "100%", background: item.color, borderRadius: "2px" }} />
              </div>
              <span style={{ fontSize: "13px", fontWeight: 700, color: item.color, minWidth: "28px" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "16px", padding: "10px 14px", background: bgNow, borderRadius: "8px", fontSize: "11px", color: colorNow, lineHeight: 1.6 }}>
        {data.value <= 45
          ? "Extreme fear can be a sign investors are too worried — historically a buying opportunity."
          : data.value <= 55
          ? "Market sentiment is neutral. Watch for directional signals before making moves."
          : "Investors are getting greedy — market may be due for a correction soon."}
      </div>
    </div>
  );
}
