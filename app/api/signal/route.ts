import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

/* =========================
   FALLBACK SIGNAL
========================= */
function fallbackSignal(text: string) {
  let score = 0;

  const buy = ["rise", "surge", "bull", "adoption", "etf"];
  const sell = ["crash", "hack", "ban", "fear", "drop"];

  buy.forEach(w => text.includes(w) && score++);
  sell.forEach(w => text.includes(w) && score--);

  let signal = "HOLD";
  if (score > 1) signal = "BUY";
  if (score < -1) signal = "SELL";

  return {
    signal,
    confidence: 55,
    mode: "fallback"
  };
}

/* =========================
   POST SIGNAL
========================= */
export async function POST(req: Request) {
  try {
    const { headlines } = await req.json();

    const text = headlines.join(" ").toLowerCase();

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const prompt = `
Analyze crypto news and return ONLY JSON:

{
  "signal": "BUY | SELL | HOLD",
  "confidence": 0-100
}

News:
${headlines.join("\n")}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const raw = response.text();

      let parsed;

      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = fallbackSignal(text);
      }

      return Response.json({
        ...parsed,
        mode: "gemini"
      });

    } catch (err) {
      return Response.json(fallbackSignal(text));
    }

  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}