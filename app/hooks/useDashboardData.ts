"use client";

import { useEffect, useState } from "react";

export function useDashboardData() {
  const [articles, setArticles] = useState<any[]>([]);
  const [prices, setPrices] = useState<any>(null);

  // 📰 NEWS FETCH
  const fetchNews = async () => {
    try {
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

        if (data.items) {
          data.items.slice(0, 3).forEach((item: any) => {
            results.push({
              title: item.title,
              pubDate: item.pubDate,
              source: url,
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
    }
  };

  // 💰 PRICE FETCH (cache ringan)
  const fetchPrices = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=usd&include_24hr_change=true",
        { cache: "no-store" }
      );

      const data = await res.json();
      setPrices(data);
    } catch (err) {
      console.error("PRICE ERROR:", err);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchPrices();

    // 🔥 AUTO REFRESH (PRO FEATURE)
    const interval = setInterval(() => {
      fetchNews();
      fetchPrices();
    }, 60000); // 1 menit

    return () => clearInterval(interval);
  }, []);

  return {
    articles,
    prices,
    refresh: () => {
      fetchNews();
      fetchPrices();
    },
  };
}