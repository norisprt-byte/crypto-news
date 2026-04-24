import OpenAI from "openai";

export const runtime = "nodejs"; // wajib untuk Vercel

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   🔹 GET (OPTIONAL TEST)
========================= */
export async function GET() {
  return Response.json({
    status: "OK",
    message: "API summary aktif. Gunakan POST untuk AI.",
  });
}

/* =========================
   🔹 POST (MAIN AI LOGIC)
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const titles: string[] = body.titles;

    // VALIDASI
    if (!titles || titles.length === 0) {
      return Response.json(
        { error: "No titles provided" },
        { status: 400 }
      );
    }

    console.log("✅ OPENAI CALLED");
    console.log("Titles:", titles);

    /* =========================
       🔹 PROMPT AI
    ========================= */
    const prompt = `
You are a professional crypto market analyst.

Analyze the sentiment of the following crypto news headlines:

${titles.join("\n")}

Rules:
- Maximum 2 sentences
- Mention sentiment: bullish / bearish / neutral
- Keep it concise and clear
- No emojis
`;

    /* =========================
       🔹 CALL OPENAI
    ========================= */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = completion.choices[0]?.message?.content;

    // VALIDASI HASIL
    if (!result) {
      console.error("❌ EMPTY RESPONSE FROM AI");
      return Response.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }

    /* =========================
       🔹 RESPONSE SUCCESS
    ========================= */
    return Response.json({
      success: true,
      summary: result,
    });

  } catch (err: any) {
    console.error("❌ OPENAI ERROR:", err?.message || err);

    /* =========================
       🔹 ERROR RESPONSE (JELAS)
    ========================= */
    return Response.json(
      {
        success: false,
        error: "AI FAILED",
        detail: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}