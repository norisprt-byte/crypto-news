"use client";

import { useEffect, useState } from "react";

export default function AISignal({ articles }: any) {
  const [signal, setSignal] = useState("HOLD");

  useEffect(() => {
    if (!articles?.length) return;

    async function run() {
      const headlines = articles.slice(0, 5).map((a: any) => a.title);

      const res = await fetch("/api/signal", {
        method: "POST",
        body: JSON.stringify({ headlines }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      setSignal(`${data.signal} (${data.confidence || 0}%)`);
    }

    run();
  }, [articles]);

  return (
    <div style={{ background: "#111", padding: 12, borderRadius: 12 }}>
      <div style={{ fontSize: 11, color: "#888" }}>⚡ AI SIGNAL</div>
      <div style={{ fontSize: 18, marginTop: 4 }}>
        {signal}
      </div>
    </div>
  );
}