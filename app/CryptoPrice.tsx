"use client";

import { useEffect, useState } from "react";

type Prices = {
  bitcoin: { price: number; change: number };
  ethereum: { price: number; change: number };
  solana: { price: number; change: number };
  binancecoin: { price: number; change: number };
};

export default function CryptoPrice() {
  const [prices, setPrices] = useState<Prices | null>(null);
  const [prevPrices, setPrevPrices] = useState<Prices | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchPrices() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=usd&include_24hr_change=true",
          { cache: "no-store" }
        );

        const data = await res.json();

        const newPrices: Prices = {
          bitcoin: {
            price: data.bitcoin?.usd || 0,
            change: data.bitcoin?.usd_24h_change || 0,
          },
          ethereum: {
            price: data.ethereum?.usd || 0,
            change: data.ethereum?.usd_24h_change || 0,
          },
          solana: {
            price: data.solana?.usd || 0,
            change: data.solana?.usd_24h_change || 0,
          },
          binancecoin: {
            price: data.binancecoin?.usd || 0,
            change: data.binancecoin?.usd_24h_change || 0,
          },
        };

        if (isMounted) {
          setPrevPrices((prev) => prices || prev);
          setPrices(newPrices);
          setError(false);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  function format(n: number) {
    return "$" + n.toLocaleString();
  }

  function formatPercent(n: number) {
    return n.toFixed(2) + "%";
  }

  function getColor(change: number) {
    if (change > 0) return "#22c55e"; // hijau
    if (change < 0) return "#ef4444"; // merah
    return "#aaa";
  }

  function getArrow(change: number) {
    if (change > 0) return " 🔼";
    if (change < 0) return " 🔽";
    return "";
  }

  function renderItem(label: string, key: keyof Prices, icon: string) {
    if (!prices) return null;

    const item = prices[key];

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          <span>{icon}</span>
          <span>{label}</span>
        </div>

        <div
          style={{
            fontWeight: 600,
            color: "#fff",
          }}
        >
          {format(item.price)}
        </div>

        <div
          style={{
            fontSize: "11px",
            color: getColor(item.change),
          }}
        >
          {formatPercent(item.change)}
          {getArrow(item.change)}
        </div>
      </div>
    );
  }

  // LOADING
  if (!prices && !error) {
    return (
      <div style={{ padding: "12px", background: "#1a1a1a", borderRadius: "12px" }}>
        Loading market data...
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div style={{ padding: "12px", background: "#1a1a1a", borderRadius: "12px", color: "#ef4444" }}>
        Failed to load prices
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "12px",
        background: "#1a1a1a",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        fontSize: "13px",
      }}
    >
      {renderItem("BTC", "bitcoin", "₿")}
      {renderItem("ETH", "ethereum", "Ξ")}
      {renderItem("SOL", "solana", "◎")}
      {renderItem("BNB", "binancecoin", "🟡")}
    </div>
  );
}