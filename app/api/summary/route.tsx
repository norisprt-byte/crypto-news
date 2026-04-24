import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

/* =========================
   GET CHECK
========================= */
export async function GET() {
  return Response.json({
    status: "OK",
    message: "Gemini Hybrid AI is running",
  });
}

/* =========================
   RULE BASED FALLBACK
========================= */
function ruleBasedAI(titles: string[]) {
  const text = titles.join(" ").toLowerCase();

  let bullish = 0;
  let bearish = 0;

  const bullishWords = [
    "rise",
    "surge",
    "bull",
    "gain",
    "approval",
    "etf",
    "growth",
    "adoption",
  ];

  const bearishWords = [
    "drop",
    "fall",
    "crash",
    "hack",
    "fear",
    "lawsuit",
    "ban",
    "sell",
  ];

  bullishWords.forEach((w) => {
    if (text.includes(w)) bullish++;
  });

  bearishWords.forEach((w) => {
    if (text.includes(w)) bearish++;
  });

  let sentiment = "Neutral";

  if (bullish > bearish) sentiment = "Bullish";
  if (bearish > bullish) sentiment = "Bearish";

  return {
    summary: `Market appears ${sentiment.toLowerCase()} based on keyword analysis.`,
    sentiment,
    source: "rule-based fallback",
  };
}

/* =========================
   GEMINI AI
========================= */
async function geminiAI(titles: string[]) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const prompt = `
You are a crypto analyst.

Analyze these headlines:

${titles.join("\n")}

Return JSON only:
{
  "summary": "...",
  "sentiment": "Bullish | Bearish | Neutral",
  "reason": "..."
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return {
    ...JSON.parse(text),
    source: "gemini",
  };
}

/* =========================
   POST
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const titles: string[] = body?.titles;

    if (!Array.isArray(titles) || titles.length === 0) {
      return Response.json(
        { error: "titles required" },
        { status: 400 }
      );
    }

    // 🔥 TRY GEMINI FIRST
    try {
      const ai = await geminiAI(titles);

      return Response.json({
        success: true,
        mode: "gemini",
        ...ai,
      });

    } catch (err) {
      console.log("⚠️ Gemini failed, using fallback");

      // 🔥 FALLBACK RULE-BASED
      const fallback = ruleBasedAI(titles);

      return Response.json({
        success: true,
        mode: "fallback",
        ...fallback,
      });
    }

  } catch (err: any) {
    return Response.json(
      {
        error: "AI FAILED",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}