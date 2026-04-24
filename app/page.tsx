"use client";

import { useEffect, useState } from "react";

import FearIndex from "./FearIndex";
import NewsSection from "./NewsSection";
import CryptoPrice from "./CryptoPrice";
import AISummary from "./AISummary";
import AISignal from "./AISignal";
import AINarrative from "./AINarrative";
export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchFeeds() {
    try {
      setLoading(true);

      const feeds = [
        "https://feeds.feedburner.com/CoinDesk",
        "https://cointelegraph.com/rss",
        "https://decrypt.co/feed",
      ];

      let results: any[] = [];

      for (const url of feeds) {
        const res = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=" +
            encodeURIComponent(url)
        );

        const data = await res.json();

        if (data?.items) {
          data.items.slice(0, 4).forEach((item: any) => {
            results.push({
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              source: url.includes("coindesk")
                ? "CoinDesk"
                : url.includes("cointelegraph")
                ? "CoinTelegraph"
                : "Decrypt",
              thumbnail: item.thumbnail || "",
            });
          });
        }
      }

      results.sort(
        (a, b) =>
          new Date(b.pubDate).getTime() -
          new Date(a.pubDate).getTime()
      );

      setArticles(results.slice(0, 12));
    } catch (err) {
      console.error("NEWS ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeeds();

    // 🔥 AUTO REFRESH (SAFE)
    const interval = setInterval(fetchFeeds, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main
      style={{
        background: "#0f0f0f",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      {/* HEADER */}
      <header
  style={{
    padding: "16px 24px",
    borderBottom: "1px solid #222",
    background: "linear-gradient(90deg, #0f0f0f, #151515, #0f0f0f)",
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(10px)",
  }}
>
  <div
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    {/* LEFT - BRAND */}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      
      {/* LOGO DOT */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#f7931a",
          boxShadow: "0 0 10px #f7931a",
        }}
      />

      <h1
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 1,
          margin: 0,
        }}
      >
        Crypto<span style={{ color: "#f7931a" }}>Bro</span>
      </h1>

      {/* LIVE BADGE */}
      <span
        style={{
          fontSize: 10,
          background: "#22c55e20",
          color: "#22c55e",
          padding: "2px 8px",
          borderRadius: 999,
          border: "1px solid #22c55e40",
        }}
      >
        ● LIVE MARKET
      </span>
    </div>

    {/* RIGHT - STATUS */}
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      
      <span style={{ fontSize: 11, color: "#888" }}>
        AI Terminal
      </span>

      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#22c55e",
          boxShadow: "0 0 8px #22c55e",
        }}
      />
    </div>
  </div>
</header>

      {/* PRICE PANEL */}
      <div style={{ margin: "16px 24px" }}>
        <CryptoPrice />
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* LOADING STATE */}
        {loading && (
          <div style={{ padding: 10, color: "#aaa" }}>
            Loading market + news...
          </div>
        )}

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          
          {/* LEFT - NEWS */}
          <div style={{ flex: "2 1 650px" }}>
            <NewsSection articles={articles} />
          </div>

          {/* RIGHT - AI PANEL */}
          <div
            style={{
              flex: "1 1 320px",
              position: "sticky",
              top: 80,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <AISummary articles={articles} />

            {/* 🔥 AI SIGNAL (NEW) */}
            <AISignal articles={articles} />
            <AINarrative articles={articles} />
            <FearIndex />
          </div>
        </div>
      </div>
    </main>
  );
}