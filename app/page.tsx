"use client";

import { useEffect, useState } from "react";

import FearIndex from "./FearIndex";
import NewsSection from "./NewsSection";
import CryptoPrice from "./CryptoPrice";
import AISummary from "./AISummary";

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFeeds() {
      try {
        const results: any[] = [];

        const feeds = [
          { url: "https://feeds.feedburner.com/CoinDesk", source: "CoinDesk" },
          { url: "https://cointelegraph.com/rss", source: "CoinTelegraph" },
          { url: "https://decrypt.co/feed", source: "Decrypt" },
        ];

        for (const feed of feeds) {
          const res = await fetch(
            "https://api.rss2json.com/v1/api.json?rss_url=" +
              encodeURIComponent(feed.url)
          );
          const data = await res.json();

          if (data.items) {
            data.items.slice(0, 4).forEach((item: any) => {
              results.push({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                source: feed.source,
                keyword: item.title,
                thumbnail: item.thumbnail || item.enclosure?.link || "",
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
        console.error(err);
      }
    }

    fetchFeeds();
  }, []);

  return (
    <main style={{ background: "#858585", minHeight: "100vh", color: "#fff" }}>
      
      {/* HEADER */}
      <header style={{ padding: "16px 24px", borderBottom: "1px solid #1a1a1a" }}>
        <h1>CryptoBRO</h1>
      </header>

      {/* PRICE */}
      <div style={{ margin: "16px 24px" }}>
        <CryptoPrice />
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>

          {/* LEFT */}
          <div style={{ flex: "2 1 600px" }}>
            <NewsSection articles={articles} />
          </div>

          {/* RIGHT */}
          <div style={{ flex: "1 1 300px", position: "sticky", top: "80px" }}>
            <AISummary articles={articles} />
            <div style={{ marginTop: "16px" }}>
              <FearIndex />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}