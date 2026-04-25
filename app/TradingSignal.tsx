"use client";

import { useEffect, useState } from "react";

export default function TradingSignal({ articles }: any) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!articles?.length) return;

    async function run() {
      const titles = articles
        .slice(0, 10)
        .map((a: any) => a.title);

      const res = await fetch("/api/narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titles }),
      });

      const result = await res.json();
      setData(result);
    }

    run();
  }, [articles]);

  const color = (b: string) => {
    if (b === "LONG") return "#22c55e";
    if (b === "SHORT") return "#ef4444";
    return "#fbbf24";
  };

  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid #222",
        padding: 12,
        borderRadius: 10,
      }}
    >
      <div style={{ fontSize: 11, color: "#888" }}>
        📊 TRADING SIGNAL ENGINE v6
      </div>

      {!data ? (
        <div style={{ marginTop: 6, color: "#aaa" }}>
          Generating trading signal...
        </div>
      ) : (
        <div style={{ marginTop: 8 }}>

          {/* BIAS */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: color(data.trade_bias),
            }}
          >
            {data.trade_bias}
          </div>

          {/* CONFIDENCE */}
          <div style={{ color: "#f7931a", marginTop: 4 }}>
            Confidence: {data.entry_confidence ?? data.confidence}%
          </div>

          {/* BREAKOUT */}
          <div style={{ color: "#38bdf8", marginTop: 4 }}>
            Breakout: {data.breakout ? "YES 🚀" : "NO"}
          </div>

          {/* WHALE */}
          <div style={{ color: "#a78bfa", marginTop: 4 }}>
            Flow: {data.whale_flow}
          </div>

          {/* CONTEXT */}
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: "#aaa",
              lineHeight: 1.4,
            }}
          >
            {data.market_context}
          </div>

          {/* DRIVER */}
          <div style={{ marginTop: 6, fontSize: 11, color: "#666" }}>
            Driver: {data.key_driver}
          </div>

          {/* RISK */}
          <div style={{ marginTop: 6, fontSize: 11, color: "#666" }}>
            Risk: {data.risk_note}
          </div>

        </div>
      )}
    </div>
  );
}