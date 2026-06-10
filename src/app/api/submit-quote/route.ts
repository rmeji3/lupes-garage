import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting (IP -> timestamp of last submission)
const submissionLog = new Map<string, number>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const lastSubmission = submissionLog.get(ip);
  if (!lastSubmission) return false;
  if (Date.now() - lastSubmission < RATE_LIMIT_WINDOW) return true;
  return false;
}

function recordSubmission(ip: string) {
  submissionLog.set(ip, Date.now());
}

// Spam detection patterns
const spamPatterns = [
  /viagra|cialis|casino|lottery|prize|click here|free money|bitcoin|crypto/i,
  /href=|<script|<iframe|onclick|javascript:/i,
  /\[\[|www\.|http|\.com|\.net|\.org|\.ru|\.cn/i, // Multiple URLs
];

function containsSpam(text: string): boolean {
  return spamPatterns.some((pattern) => pattern.test(text));
}

function validateInput(
  name: string,
  phone: string,
  message: string
): { valid: boolean; error?: string } {
  // Name validation
  if (!name || name.trim().length < 2) {
    return { valid: false, error: "Name is too short" };
  }
  if (name.length > 100) {
    return { valid: false, error: "Name is too long" };
  }
  if (containsSpam(name)) {
    return { valid: false, error: "Name contains invalid content" };
  }

  // Phone validation (basic)
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    return { valid: false, error: "Phone number is invalid" };
  }

  // Message validation
  if (message && message.length > 2000) {
    return { valid: false, error: "Message is too long" };
  }
  if (message && containsSpam(message)) {
    return { valid: false, error: "Message contains spam content" };
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    // Rate limiting check (disabled in development for easier testing)
    const isDev = process.env.NODE_ENV === "development";
    if (!isDev && isRateLimited(clientIP)) {
      return NextResponse.json(
        {
          error: "Too many submissions. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, phone, message, lang, website } = body;

    // Honeypot field: if the "website" field is filled, it's a bot
    if (website) {
      // Silently fail (don't reveal honeypot to attacker)
      recordSubmission(clientIP);
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    // Validate input
    const validation = validateInput(name, phone, message || "");
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "Invalid input" },
        { status: 400 }
      );
    }

    // Email text in the submitted language
    const isSpanish = lang === "es";
    const subject = isSpanish
      ? "Nueva solicitud de cotización — Lupe's Garage Doors"
      : "New quote request — Lupe's Garage Doors";

    const emailBody = `
${isSpanish ? "Nueva solicitud de cotización" : "New Quote Request"}

${isSpanish ? "Nombre:" : "Name:"} ${name}
${isSpanish ? "Teléfono:" : "Phone:"} ${phone}
${isSpanish ? "Mensaje:" : "Message:"} ${message || "(none)"}
    `.trim();

    // Send email to your business email
    const result = await resend.emails.send({
      from: "Lupe's Garage Doors <onboarding@resend.dev>",
      to: process.env.BUSINESS_EMAIL || "contact@example.com",
      subject,
      text: emailBody,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again or call us directly." },
        { status: 500 }
      );
    }

    // Record successful submission for rate limiting
    recordSubmission(clientIP);

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error("Quote submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit quote" },
      { status: 500 }
    );
  }
}
