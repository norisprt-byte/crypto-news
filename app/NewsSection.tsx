"use client";

/* =========================
   🔹 TAG DETECTOR
========================= */
function getTag(title: string) {
  const t = title.toLowerCase();

  if (t.includes("bitcoin") || t.includes("btc")) return "Bitcoin";
  if (t.includes("ethereum") || t.includes("eth")) return "Ethereum";
  if (t.includes("solana") || t.includes("sol")) return "Solana";
  if (t.includes("bnb")) return "BNB";
  if (t.includes("sec") || t.includes("regulat")) return "Regulation";
  if (t.includes("etf")) return "ETF";
  if (t.includes("defi")) return "DeFi";

  return "Market";
}

/* =========================
   🔹 FALLBACK IMAGE
========================= */
function getFallbackImage(source: string) {
  if (source === "CoinDesk")
    return "https://static.coindesk.com/wp-content/uploads/2021/03/coindesk-og-image.jpg";

  if (source === "CoinTelegraph")
    return "https://cointelegraph.com/assets/img/ct-logo.png";

  if (source === "Decrypt")
    return "https://decrypt.co/static/img/decrypt-logo.png";

  return "https://via.placeholder.com/300x200";
}

/* =========================
   🔹 CLEAN QUERY FOR X
========================= */
function getSearchQuery(title: string) {
  const priority = ["bitcoin", "ethereum", "solana", "bnb", "etf", "sec"];

  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .split(" ");

  // ambil keyword penting dulu
  const picked = words.filter((w) => priority.includes(w));

  if (picked.length > 0) {
    return picked.slice(0, 3).join(" ");
  }

  // fallback ambil kata inti
  return words
    .filter((w) => w.length > 3)
    .slice(0, 5)
    .join(" ");
}

/* =========================
   🔹 COMPONENT
========================= */
export default function NewsSection({ articles }: any) {
  if (!articles || articles.length === 0) {
    return <div style={{ padding: "20px" }}>Loading news...</div>;
  }

  const hero = articles[0];
  const rest = articles.slice(1);

  const heroImg =
    hero.thumbnail && hero.thumbnail !== ""
      ? hero.thumbnail
      : getFallbackImage(hero.source);

  return (
    <section>
      {/* =========================
          🔥 HERO NEWS
      ========================= */}
      <div
        style={{
          marginBottom: "16px",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={heroImg}
          style={{
            width: "100%",
            height: "260px",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            padding: "16px",
            background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
            width: "100%",
          }}
        >
          {/* TAG + SOURCE */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
            <span
              style={{
                fontSize: "10px",
                background: "#f7931a20",
                color: "#f7931a",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              {getTag(hero.title)}
            </span>

            <span style={{ fontSize: "10px", color: "#ccc" }}>
              {hero.source}
            </span>
          </div>

          {/* TITLE */}
          <a
            href={hero.link}
            target="_blank"
            style={{
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
              display: "block",
            }}
          >
            {hero.title}
          </a>

          {/* 🔥 DISCUSS */}
          <div style={{ marginTop: "8px" }}>
            <a
              href={`https://twitter.com/search?q=${encodeURIComponent(
                getSearchQuery(hero.title)
              )}&f=live`}
              target="_blank"
              style={{
                fontSize: "11px",
                color: "#1da1f2",
                textDecoration: "none",
              }}
            >
              Discuss on X →
            </a>
          </div>
        </div>
      </div>

      {/* =========================
          📰 NEWS LIST
      ========================= */}
      {rest.map((a: any, i: number) => {
        const img =
          a.thumbnail && a.thumbnail !== ""
            ? a.thumbnail
            : getFallbackImage(a.source);

        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "12px",
              background: "#1a1a1a",
              padding: "10px",
              borderRadius: "10px",
              alignItems: "center",
            }}
          >
            {/* IMAGE */}
            <img
              src={img}
              style={{
                width: "80px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />

            {/* TEXT */}
            <div style={{ flex: 1 }}>
              {/* TAG + SOURCE */}
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  marginBottom: "4px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    color: "#f7931a",
                    background: "#f7931a20",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {getTag(a.title)}
                </span>

                <span style={{ fontSize: "10px", color: "#888" }}>
                  {a.source}
                </span>
              </div>

              {/* TITLE */}
              <a
                href={a.link}
                target="_blank"
                style={{
                  color: "#fff",
                  fontSize: "13px",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                {a.title}
              </a>

              {/* 🔥 DISCUSS */}
              <div>
                <a
                  href={`https://twitter.com/search?q=${encodeURIComponent(
                    getSearchQuery(a.title)
                  )}&f=live`}
                  target="_blank"
                  style={{
                    fontSize: "10px",
                    color: "#1da1f2",
                    textDecoration: "none",
                  }}
                >
                  Discuss →
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}