"use client";

import { useEffect, useState } from "react";

/* =========================
   REALTIME MARKET HOOK
========================= */
export function useMarketStream() {
  const [data, setData] = useState<any>(null);

  async function fetchMarket() {
    try {
      const res = await fetch("/api/market", {
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Market fetch failed");
      }

      setData(json);
    } catch (err) {
      console.error("Market Stream Error:", err);
      setData(null);
    }
  }

  useEffect(() => {
    fetchMarket();

    // ⚡ safe interval (hindari rate limit)
    const interval = setInterval(fetchMarket, 30000);

    return () => clearInterval(interval);
  }, []);

  return data;
}