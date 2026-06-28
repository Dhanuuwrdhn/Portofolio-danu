import { NextRequest, NextResponse } from "next/server";
import { predefinedQuestions } from "@/app/data/chatbots";
import { getSiteOrigin } from "@/lib/site";

export const maxDuration = 20;

// Build system prompt with Danu's context
const SYSTEM_PROMPT = `You are Karen, a friendly and professional AI assistant on Syahrial Danu's portfolio website.

Your role is to answer questions about Danu based on the following information:

ABOUT DANU:
- Full name: Syahrial Danu
- Role: Fullstack Developer from Indonesia
- Education: Informatics degree from Universitas Budiluhur, specializing in Expert Programming
- Current Position: Mid Software Engineer (Fullstack) at Sprout Digital Labs (since Feb 2025)
- Previous: Technical Leader at PT Global Innovation Technology (Dec 2023 - Feb 2025), managing 8 projects
- Started as Mobile Developer intern at PT Media Kreasi Abadi

TECH STACK:
- Current: Flutter, Next.js, NestJS, Express.js
- Experience with: React Native, Spring Boot, Laravel, Golang, Python, Grafana, AI integrations (Faiss, LLM)
- Comfortable across mobile, web, and backend development

NOTABLE PROJECTS:
- SentralPart.com (automotive parts e-commerce)
- UMKM App (mobile POS with inventory management)
- E-statement FDR (motorcycle parts management)
- KejarTugas (project management tool)
- AI-Powered Grafana Monitoring System
- Tukerin (C2C marketplace)
- OCR System

CONTACT:
- Email: Dhanuwardhan12@gmail.com
- LinkedIn: linkedin.com/in/dhanuwardhana
- GitHub: github.com/Dhanuuwrdhn
- Open for freelance, remote work, and business collaborations

INSTRUCTIONS:
- Answer in the same language as the user's question (Indonesian or English)
- When answering in Indonesian, use natural conversational Indonesian (like how a real Indonesian person talks), avoid literal translations from English. For example, say "Danu menguasai..." not "Danu dikuasai..."
- Be friendly, warm, and conversational — like chatting with a friend
- If the question is unrelated to Danu, politely redirect to topics about Danu
- Keep answers under 150 words
- Use emoji sparingly to keep it friendly
- Refer to Danu in third person (he/dia)`;

// Free models to try in order (fallback chain)
const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-coder:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "meta-llama/llama-3.2-3b-instruct:free",
];

const MAX_MESSAGE_LENGTH = 500;
const MODEL_TIMEOUT_MS = 10_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const SITE_ORIGIN = getSiteOrigin();

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "anonymous";
}

function isRateLimited(clientKey: string) {
  const now = Date.now();
  const existingEntry = rateLimitStore.get(clientKey);

  if (!existingEntry || now > existingEntry.resetAt) {
    rateLimitStore.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (existingEntry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existingEntry.count += 1;
  return false;
}

async function callOpenRouterModel(
  apiKey: string,
  model: string,
  message: string
): Promise<{ success: boolean; response?: string; error?: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), MODEL_TIMEOUT_MS);

  try {
    const res = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": SITE_ORIGIN,
          "X-Title": "Danu Portfolio ChatBot",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: message },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.warn(`Model ${model} failed (${res.status}):`, errorText);
      return { success: false, error: errorText };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      return { success: true, response: content };
    }
    return { success: false, error: "No content in response" };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.warn(`Model ${model} timed out after ${MODEL_TIMEOUT_MS}ms`);
      return { success: false, error: "Request timed out" };
    }

    console.warn(`Model ${model} threw error:`, err);
    return { success: false, error: String(err) };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const clientKey = getClientKey(request);

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Message is too long. Maximum length is ${MAX_MESSAGE_LENGTH} characters.`,
        },
        { status: 413 }
      );
    }

    if (isRateLimited(clientKey)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        {
          status: 429,
          headers: {
            "Retry-After": String(RATE_LIMIT_WINDOW_MS / 1000),
          },
        }
      );
    }

    // Check predefined questions first for instant response
    const predefined = predefinedQuestions.find(
      (item) => item.question.toLowerCase() === trimmedMessage.toLowerCase()
    );
    if (predefined) {
      return NextResponse.json({ response: predefined.answer });
    }

    // Get API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not set");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    // Try each model in the fallback chain
    for (const model of FREE_MODELS) {
      console.log(`Trying model: ${model}`);
      const result = await callOpenRouterModel(apiKey, model, trimmedMessage);
      if (result.success && result.response) {
        console.log(`Success with model: ${model}`);
        return NextResponse.json({ response: result.response });
      }
    }

    // All models failed
    console.error("All models failed");
    return NextResponse.json(
      { error: "All AI models are currently unavailable. Please try again later." },
      { status: 502 }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
