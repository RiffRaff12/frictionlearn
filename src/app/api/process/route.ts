import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { chunkTextIntoGroups, pickClozeTargetsFromChunk, ProcessResponseBody } from "@/lib/textProcessing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = (body?.text ?? "").toString();
    const clozePerParagraph: number = Number(body?.clozePerParagraph ?? 2);
    const sentencesPerChunk: number = Number(body?.sentencesPerChunk ?? 2);

    if (!text || text.trim().length < 5) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const chunks = chunkTextIntoGroups(text, sentencesPerChunk);

    let response: ProcessResponseBody = {
      chunks: chunks.map((c) => ({ text: c, clozeTargets: pickClozeTargetsFromChunk(c, clozePerParagraph) })),
    };

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const client = new OpenAI({ apiKey });
        const system = "You extract 1-3 key terms (nouns, dates, named entities) from each chunk of text for cloze deletion. Respond ONLY as JSON array of arrays of strings, aligned to input chunks order.";
        const user = `Chunks:\n${response.chunks.map((c, i) => `${i + 1}. ${c.text}`).join("\n")}`;
        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.2,
        });
        const content = completion.choices?.[0]?.message?.content ?? "";
        try {
          const parsed = JSON.parse(content) as string[][];
          response = {
            chunks: response.chunks.map((c, idx) => ({
              text: c.text,
              clozeTargets: Array.isArray(parsed?.[idx]) && parsed[idx].length ? parsed[idx].slice(0, 3) : c.clozeTargets,
            })),
          };
        } catch {
          // keep fallback
        }
      } catch {
        // ignore AI failure and use fallback results
      }
    }

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Failed to process text" }, { status: 500 });
  }
} 