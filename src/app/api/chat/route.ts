import { NextRequest } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/chatbot-prompt";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIpFromRequest } from "@/lib/client-ip";

export const runtime = "nodejs";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_TOKENS = 500;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(MAX_MESSAGE_LENGTH),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
  locale: z.enum(["en", "ar"]).optional(),
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const clientKey = getClientIpFromRequest(req);
  const { allowed, retryAfterSeconds } = await checkRateLimit(clientKey);

  if (!allowed) {
    return Response.json(
      {
        error:
          "You're sending messages a little too fast — please wait a moment and try again.",
      },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid message format." },
      { status: 400 }
    );
  }

  const { messages, locale } = parsed.data;

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "The assistant is temporarily unavailable." },
      { status: 503 }
    );
  }

  const localeHint =
    locale === "ar"
      ? "\n\nThe visitor is browsing the site in Arabic. Default to replying in Arabic (simple, warm Modern Standard Arabic that any Egyptian reader understands). If they write to you in English, mirror them and reply in English."
      : "\n\nThe visitor is browsing the site in English. Default to replying in English. If they write to you in Arabic, mirror them and reply in Arabic.";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: MAX_TOKENS,
      stream: true,
      messages: [
        { role: "system", content: CHATBOT_SYSTEM_PROMPT + localeHint },
        ...messages,
      ],
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          console.error("Chat stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Chat completion error:", err);
    return Response.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}
