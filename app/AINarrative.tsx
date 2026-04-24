"use client";

import { useEffect, useState } from "react";

export default function AINarrative({ articles }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!articles || articles.length === 0) return;

    async function run() {
      try {
        setLoading(true);

        const titles = articles
          .slice(0, 15)
          .map((a: any) => a?.title || "")
          .filter(Boolean);

        const res = await fetch("/api/narrative", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titles }),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result?.error || "AI failed");
        }

        setData(result);
      } catch (err) {
        console.error("AI ERROR:", err);

        // 🛡️ SAFE FALLBACK (INSTITUTIONAL STYLE)
        setData({
          regime: "Neutral",
          bias: "NEUTRAL",
          confidence: 50,
          quant_score: 50,
          liquidity: "Flat",
          risk: "Medium",
          smart_money: "No Edge Detected",
          retail_sentiment: "Mixed",
          dominant_theme: "Market structure unclear",
          emerging_theme: null,
          market_view: "Quant fallback mode active - no clear edge",
          implication: "Wait for confirmation signal",
          conviction: "Low",
          mode: "fallback_v3",
        });
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [articles]);

  const biasColor = (bias: string) => {
    if (bias === "LONG" || bias === "BULLISH") return "#22c55e";
    if (bias === "SHORT" || bias === "BEARISH") return "#ef4444";
    return "#fbbf24";
  };

  const regimeColor = (regime: string) => {
    if (regime === "Risk-On") return "#22c55e";
    if (regime === "Risk-Off") return "#ef4444";
    return "#38bdf8";
  };

  const riskColor = (risk: string) => {
    if (risk === "High") return "#ef4444";
    if (risk === "Medium") return "#fbbf24";
    return "#22c55e";
  };

  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid #1f1f1f",
        padding: 14,
        borderRadius: 12,
        fontFamily: "system-ui",
      }}
    >
      {/* HEADER */}
      <div style={{ fontSize: 11, color: "#888" }}>
        📊 QUANT DESK — INSTITUTIONAL FLOW ENGINE
      </div>

      {/* LOADING */}
      {loading && (
        <div style={{ marginTop: 8, color: "#aaa" }}>
          Running quant models...
        </div>
      )}

      {/* DATA */}
      {!loading && data && (
        <div style={{ marginTop: 10 }}>

          {/* REGIME */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: regimeColor(data?.regime),
            }}
          >
            Market Regime: {data?.regime || "Neutral"}
          </div>

          {/* SCORE */}
          <div style={{ marginTop: 6, fontSize: 13, color: "#f7931a" }}>
            Quant Score: {data?.quant_score ?? 50} / 100
          </div>

          {/* BIAS */}
          <div
            style={{
              marginTop: 6,
              fontSize: 13,
              fontWeight: 600,
              color: biasColor(data?.bias),
            }}
          >
            Signal Bias: {data?.bias || "NEUTRAL"} ({data?.confidence ?? 50}%)
          </div>

          {/* RISK */}
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              fontWeight: 600,
              color: riskColor(data?.risk),
            }}
          >
            ⚠️ Risk Level: {data?.risk || "Medium"}
          </div>

          {/* CONVICTION */}
          <div style={{ marginTop: 4, fontSize: 12, color: "#a78bfa" }}>
            Conviction: {data?.conviction || "Low"}
          </div>

          {/* LIQUIDITY */}
          <div style={{ marginTop: 4, fontSize: 12, color: "#38bdf8" }}>
            Liquidity State: {data?.liquidity || "Unknown"}
          </div>

          {/* SMART MONEY */}
          <div style={{ marginTop: 6, fontSize: 12, color: "#22c55e" }}>
            🐋 Smart Money: {data?.smart_money || "No Data"}
          </div>

          {/* RETAIL */}
          <div style={{ marginTop: 4, fontSize: 12, color: "#fbbf24" }}>
            👥 Retail Sentiment: {data?.retail_sentiment || "Mixed"}
          </div>

          {/* DOMINANT */}
          <div style={{ marginTop: 10, fontWeight: 600 }}>
            {data?.dominant_theme}
          </div>

          {/* EMERGING */}
          {data?.emerging_theme && (
            <div style={{ marginTop: 4, color: "#22c55e" }}>
              🧠 Emerging Narrative: {data.emerging_theme}
            </div>
          )}

          {/* VIEW */}
          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "#aaa",
              lineHeight: 1.4,
            }}
          >
            {data?.market_view}
          </div>

          {/* IMPACT */}
          <div
            style={{
              marginTop: 6,
              fontSize: 11,
              color: "#666",
            }}
          >
            {data?.implication}
          </div>

          {/* ENGINE */}
          <div
            style={{
              marginTop: 10,
              fontSize: 10,
              color: "#444",
            }}
          >
            engine: {data?.mode}
          </div>

        </div>
      )}
    </div>
  );
}