"use client";

import { useEffect, useState } from "react";

type Market = {
  bitcoin: any;
  ethereum: any;
  solana: any;
  binancecoin: any;
};

export default function CryptoPrice() {
  const [data, setData] = useState<Market | null>(null);

  async function fetchMarket() {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin&order=market_cap_desc&sparkline=false&price_change_percentage=24h"
      );

      const json = await res.json();

      const mapped: any = {};
      json.forEach((item: any) => {
        mapped[item.id] = item;
      });

      setData(mapped);
    } catch (err) {
      console.error("Market fetch error:", err);
    }
  }

  useEffect(() => {
    fetchMarket();
    const interval = setInterval(fetchMarket, 15000);
    return () => clearInterval(interval);
  }, []);

  function box(item: any, icon: string, label: string) {
    if (!item) return null;

    return (
      <div
        style={{
          flex: 1,
          minWidth: 140,
          padding: 12,
          borderRadius: 10,
          background: "#0f0f0f",
          border: "1px solid #222",
        }}
      >
        <div style={{ fontSize: 12, color: "#aaa" }}>
          {icon} {label}
        </div>

        <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>
          ${item.current_price.toLocaleString()}
        </div>

        <div
          style={{
            fontSize: 11,
            marginTop: 4,
            color:
              item.price_change_percentage_24h > 0
                ? "#22c55e"
                : "#ef4444",
          }}
        >
          {item.price_change_percentage_24h?.toFixed(2)}%
        </div>

        <div style={{ fontSize: 10, color: "#666", marginTop: 4 }}>
          Vol: ${(item.total_volume / 1e9).toFixed(2)}B
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        style={{
          maxWidth: 1100,
          margin: "20px auto",
          padding: 12,
          background: "#111",
          borderRadius: 12,
          color: "#aaa",
          textAlign: "center",
        }}
      >
        Loading real market data...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "20px auto",
        padding: "0 24px",
      }}
    >
      {/* HEADER LABEL */}
      <div
        style={{
          fontSize: 11,
          color: "#888",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
       
      </div>

      {/* GRID CENTERED */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {box(data.bitcoin, "₿", "BTC")}
        {box(data.ethereum, "Ξ", "ETH")}
        {box(data.solana, "◎", "SOL")}
        {box(data.binancecoin, "🟡", "BNB")}
      </div>
    </div>
  );
}