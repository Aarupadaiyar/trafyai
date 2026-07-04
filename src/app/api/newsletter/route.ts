import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsletterSignupSchema } from "@/lib/validations/article";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = newsletterSignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  await db.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    create: { email: parsed.data.email, source: parsed.data.source },
    update: { isActive: true },
  });

  return NextResponse.json({ ok: true });
}
