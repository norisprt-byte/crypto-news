"use client";

import { useEffect, useState } from "react";

export default function AISummary({ articles }: any) {
  const [summary, setSummary] = useState("⏳ Loading AI...");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!articles || articles.length === 0) return;

    async function fetchSummary() {
      try {
        const titles = articles.slice(0, 5).map((a: any) => a.title);

        const res = await fetch("/api/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ titles }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        console.log("AI RESPONSE:", data);

        setSummary(data.summary);
      } catch (err) {
        console.error(err);
        setError(true);
        setSummary("❌ AI NOT ACTIVE");
      }
    }

    fetchSummary();
  }, [articles]);

  return (
    <div
      style={{
        background: "#1a1a1a",
        padding: "16px",
        borderRadius: "12px",
      }}
    >
      <div style={{ fontSize: "11px", color: "#888" }}>
        🧠 AI MARKET SUMMARY
      </div>

      <div
        style={{
          fontSize: "13px",
          marginTop: "6px",
          lineHeight: 1.6,
          color: error ? "#f87171" : "#fff",
        }}
      >
        {summary}
      </div>
    </div>
  );
}