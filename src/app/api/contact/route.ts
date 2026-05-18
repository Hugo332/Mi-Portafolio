import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  message?: string;
};

const TO = process.env.CONTACT_TO ?? "hugoalejandro693@gmail.com";
const FROM = process.env.CONTACT_FROM ?? "Portafolio <onboarding@resend.dev>";

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Signal the client to fall back to mailto:
    return NextResponse.json(
      { ok: false, fallback: "mailto", reason: "RESEND_API_KEY not set" },
      { status: 503 }
    );
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid json" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, reason: "missing fields" },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, reason: "invalid email" }, { status: 400 });
  }

  const resend = new Resend(key);
  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Portafolio — Mensaje de ${name}`,
      text: `De: ${name} <${email}>\n\n${message}`,
    });
  } catch (err) {
    console.error("Resend error", err);
    return NextResponse.json({ ok: false, reason: "send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
