"use client";

import { useEffect, useState } from "react";

export default function AISummary({ articles }: any) {
  const [summary, setSummary] = useState("⏳ Loading AI...");

  useEffect(() => {
    if (!articles || articles.length === 0) return;

    async function fetchAI() {
      const titles = articles.slice(0, 5).map((a: any) => a.title);

      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titles }),
      });

      const data = await res.json();

      console.log("AI RESULT:", data);

      setSummary(
        `(${data.mode}) ${data.sentiment} - ${data.summary}`
      );
    }

    fetchAI();
  }, [articles]);

  return (
    <div style={{ background: "#1a1a1a", padding: 16, borderRadius: 12 }}>
      <div style={{ fontSize: 11, color: "#888" }}>
        🧠 GEMINI HYBRID AI
      </div>

      <div style={{ marginTop: 6, fontSize: 13, color: "#fff" }}>
        {summary}
      </div>
    </div>
  );
}