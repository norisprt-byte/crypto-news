"use client";

import { useEffect, useState } from "react";

type Article = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  thumbnail?: string;
};

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 60) return diff + " min ago";
  if (diff < 1440) return Math.floor(diff / 60) + " hr ago";
  return Math.floor(diff / 1440) + " days ago";
}

function getSentiment(title: string) {
  const t = title.toLowerCase();
  if (t.includes("surge") || t.includes("bull") || t.includes("rise")) return "🟢 Bullish";
  if (t.includes("drop") || t.includes("crash") || t.includes("fall")) return "🔴 Bearish";
  return "⚪ Neutral";
}

export default function HeroSlider({ articles }: { articles: Article[] }) {
  const [index, setIndex] = useState(0);

  // auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [articles.length]);

  const item = articles[index];

  return (
    <div style={{ position: "relative", marginBottom: "24px" }}>
      <a href={item.link} target="_blank" style={{ display: "block", borderRadius: "16px", overflow: "hidden" }}>
        <img
          src={item.thumbnail || "https://via.placeholder.com/800x400"}
          style={{ width: "100%", height: "220px", objectFit: "cover" }}
        />

        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)"
        }} />

        <div style={{
          position: "absolute",
          bottom: "16px",
          left: "16px",
          right: "16px",
          color: "#fff"
        }}>
          <div style={{ fontSize: "11px", marginBottom: "6px" }}>
            {item.source} · {timeAgo(item.pubDate)} · {getSentiment(item.title)}
          </div>

          <h2 style={{ fontSize: "18px", margin: 0 }}>
            {item.title}
          </h2>
        </div>
      </a>

      {/* DOT NAV */}
      <div style={{
        position: "absolute",
        bottom: "8px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "6px"
      }}>
        {articles.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: i === index ? "#f7931a" : "#555",
              cursor: "pointer"
            }}
          />
        ))}
      </div>
    </div>
  );
}