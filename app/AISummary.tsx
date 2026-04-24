"use client";

export default function AISummary({ articles }: any) {
  if (!articles || articles.length === 0) return null;

  const titles = articles.map((a: any) => a.title.toLowerCase());

  let score = 0;

  titles.forEach((t: string) => {
    if (t.includes("rise") || t.includes("gain")) score++;
    if (t.includes("fall") || t.includes("risk")) score--;
  });

  const sentiment =
    score > 1 ? "Bullish" : score < -1 ? "Bearish" : "Neutral";

  return (
    <div
      style={{
        background: "#1a1a1a",
        padding: "16px",
        borderRadius: "12px",
      }}
    >
      <div style={{ fontSize: "11px", color: "#888" }}>
        AI SUMMARY
      </div>

      <div style={{ fontSize: "13px", marginTop: "6px" }}>
        Market sentiment is <b>{sentiment}</b> based on latest news.
      </div>
    </div>
  );
}