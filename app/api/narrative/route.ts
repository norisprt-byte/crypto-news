import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

/* =========================
   MARKET FLOW CALC
========================= */
function computeFlow(titles: string[], market: any) {
  const text = titles.join(" ").toLowerCase();

  const riskOn = ["etf", "adoption", "rally", "bull", "rate cut", "institution"];
  const riskOff = ["hack", "ban", "lawsuit", "inflation", "sell", "crash"];

  let on = 0;
  let off = 0;

  riskOn.forEach(w => (text.includes(w) ? on++ : null));
  riskOff.forEach(w => (text.includes(w) ? off++ : null));

  const priceMomentum = (market.btc_change + market.eth_change) / 2;

  const volumeSpike = market.total_volume ? market.total_volume / 1e12 : 0;

  const flowScore = on - off + priceMomentum + volumeSpike;

  let regime = "Neutral";

  if (flowScore > 3) regime = "Risk-On";
  if (flowScore < -3) regime = "Risk-Off";

  let whale = "Retail Flow Dominant";

  if (volumeSpike > 1.5 || text.includes("blackrock") || text.includes("etf")) {
    whale = "Institutional Flow Detected";
  }

  return {
    regime,
    flowScore: Number(flowScore.toFixed(2)),
    whale,
    riskOn,
    riskOff,
    momentum: priceMomentum,
  };
}

/* =========================
   MARKET DATA (REAL)
========================= */
async function getMarket() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/global"
    );

    const data = await res.json();

    return {
      total_volume: data.data.total_volume.usd,
    };
  } catch {
    return { total_volume: 0 };
  }
}

/* =========================
   MAIN API v5
========================= */
export async function POST(req: Request) {
  try {
    const { titles } = await req.json();

    if (!titles?.length) {
      return Response.json({ error: "no data" }, { status: 400 });
    }

    const market = await getMarket();
    const flow = computeFlow(titles, market);

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const prompt = `
You are an institutional macro trading desk.

Classify crypto market using FLOW + NARRATIVE.

DATA:
Regime: ${flow.regime}
FlowScore: ${flow.flowScore}
Whale: ${flow.whale}
Momentum: ${flow.momentum}

News:
${titles.join("\n")}

Return ONLY JSON:
{
  "market_regime": "Risk-On | Risk-Off | Neutral",
  "institutional_bias": "Bullish | Bearish | Neutral",
  "narrative": "core dominant narrative in market",
  "emerging_flow": "new emerging trend if any",
  "risk_assessment": "1 sentence risk summary"
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      let parsed;

      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = {
          market_regime: flow.regime,
          institutional_bias: "Neutral",
          narrative: "Fallback narrative mode",
          emerging_flow: null,
          risk_assessment: "System degraded mode",
        };
      }

      return Response.json({
        ...parsed,
        flow,
        mode: "hedge_fund_v5",
      });

    } catch {
      return Response.json({
        ...flow,
        mode: "fallback_flow_engine",
      });
    }

  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}