"use client";

import { useEffect, useState } from "react";

export default function AISummary({ articles }: any) {
  const [summary, setSummary] = useState("⏳ Loading AI...");
  const [mode, setMode] = useState("loading");

  useEffect(() => {
    if (!articles || articles.length === 0) return;

    async function runAI() {
      try {
        const titles = articles.slice(0, 5).map((a: any) => a.title);

        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titles }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "AI error");
        }

        setMode(data.mode || "ai");

        setSummary(
          `${data.sentiment || "Neutral"}\n${data.summary || ""}`
        );

      } catch (err: any) {
        setMode("fallback");

        setSummary(
          "Neutral\nAI fallback active (system safe mode)"
        );
      }
    }

    runAI();
  }, [articles]);

  return (
    <div style={{ background: "#1a1a1a", padding: 16, borderRadius: 12 }}>
      
      <div style={{ fontSize: 11, color: "#888" }}>
        🧠 AI MARKET ({mode})
      </div>

      <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5 }}>
        {summary}
      </div>

    </div>
  );
}