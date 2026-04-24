import OpenAI from "openai";

export const runtime = "nodejs";

/* =========================
   GET (OPTIONAL)
========================= */
export async function GET() {
  return Response.json({
    status: "OK",
    message: "API ready. Use POST.",
  });
}

/* =========================
   POST (AI)
========================= */
export async function POST(req: Request) {
  try {
    // 🔥 pindahkan ke sini (bukan di atas)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY not set");
    }

    const { titles } = await req.json();

    if (!titles || titles.length === 0) {
      return Response.json(
        { error: "No titles provided" },
        { status: 400 }
      );
    }

    console.log("✅ OPENAI CALLED");

    const prompt = `
You are a crypto analyst.

Analyze these headlines:
${titles.join("\n")}

Give short summary (max 2 sentences) + sentiment.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0]?.message?.content;

    return Response.json({ summary: text });

  } catch (err: any) {
    console.error("❌ ERROR:", err.message);

    return Response.json(
      {
        error: "AI FAILED",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}