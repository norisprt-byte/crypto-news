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
  const map: any = {
    CoinDesk:
      "https://static.coindesk.com/wp-content/uploads/2021/03/coindesk-og-image.jpg",
    CoinTelegraph:
      "https://cointelegraph.com/assets/img/ct-logo.png",
    Decrypt:
      "https://decrypt.co/static/img/decrypt-logo.png",
  };

  return map[source] || "https://via.placeholder.com/300x200";
}

/* =========================
   🔹 TIME AGO (ENGLISH)
========================= */
function timeAgo(dateString: string) {
  const now = new Date().getTime();
  const past = new Date(dateString).getTime();

  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

  return `${Math.floor(diff / 86400)} days ago`;
}

/* =========================
   🔹 X SEARCH QUERY CLEANER
========================= */
function getSearchQuery(title: string) {
  const priority = ["bitcoin", "ethereum", "solana", "bnb", "etf", "sec"];

  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .split(" ");

  const picked = words.filter((w) => priority.includes(w));

  if (picked.length > 0) {
    return picked.slice(0, 3).join(" ");
  }

  return words.filter((w) => w.length > 3).slice(0, 5).join(" ");
}

/* =========================
   🔹 COMPONENT
========================= */
export default function NewsSection({ articles }: any) {
  if (!articles?.length) {
    return (
      <div style={{ padding: 20, color: "#aaa" }}>
        Loading news...
      </div>
    );
  }

  const hero = articles[0];
  const rest = articles.slice(1, 10);

  const heroImg = hero.thumbnail
    ? hero.thumbnail
    : getFallbackImage(hero.source);

  return (
    <section>

      {/* =========================
          🔥 HERO NEWS
      ========================= */}
      <div
        style={{
          marginBottom: 16,
          borderRadius: 12,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={heroImg}
          style={{
            width: "100%",
            height: 260,
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            padding: 16,
            width: "100%",
            background:
              "linear-gradient(transparent, rgba(0,0,0,0.9))",
          }}
        >
          {/* TAG + SOURCE + TIME */}
          <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            
            <span
              style={{
                fontSize: 10,
                background: "#f7931a20",
                color: "#f7931a",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              {getTag(hero.title)}
            </span>

            <span style={{ fontSize: 10, color: "#ccc" }}>
              {hero.source}
            </span>

            <span style={{ fontSize: 10, color: "#888" }}>
              {timeAgo(hero.pubDate)}
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

          {/* DISCUSS */}
          <a
            href={`https://twitter.com/search?q=${encodeURIComponent(
              getSearchQuery(hero.title)
            )}&f=live`}
            target="_blank"
            style={{
              fontSize: 11,
              color: "#1da1f2",
              textDecoration: "none",
              marginTop: 8,
              display: "inline-block",
            }}
          >
            Discuss on X →
          </a>
        </div>
      </div>

      {/* =========================
          📰 LIST NEWS
      ========================= */}
      {rest.map((a: any, i: number) => {
        const img = a.thumbnail
          ? a.thumbnail
          : getFallbackImage(a.source);

        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 12,
              background: "#1a1a1a",
              padding: 10,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            {/* IMAGE */}
            <img
              src={img}
              style={{
                width: 80,
                height: 60,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />

            {/* TEXT */}
            <div style={{ flex: 1 }}>

              {/* TAG + SOURCE + TIME */}
              <div style={{ display: "flex", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                
                <span
                  style={{
                    fontSize: 10,
                    color: "#f7931a",
                    background: "#f7931a20",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  {getTag(a.title)}
                </span>

                <span style={{ fontSize: 10, color: "#888" }}>
                  {a.source}
                </span>

                <span style={{ fontSize: 10, color: "#666" }}>
                  {timeAgo(a.pubDate)}
                </span>
              </div>

              {/* TITLE */}
              <a
                href={a.link}
                target="_blank"
                style={{
                  color: "#fff",
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                {a.title}
              </a>

              {/* DISCUSS */}
              <div>
                <a
                  href={`https://twitter.com/search?q=${encodeURIComponent(
                    getSearchQuery(a.title)
                  )}&f=live`}
                  target="_blank"
                  style={{
                    fontSize: 10,
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