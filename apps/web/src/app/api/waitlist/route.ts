import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { waitlist } from "@/lib/db/schema";
import { waitlistSchema } from "@teez/shared";
import { sendWaitlistConfirmation } from "@/lib/email";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { email, name, company, role } = parsed.data;

    // Check if already on waitlist
    const existing = await db()
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "You're already on the waitlist!" },
        { status: 200 }
      );
    }

    // Insert into database
    await db().insert(waitlist).values({
      email,
      name: name ?? null,
      company: company ?? null,
      role: role ?? null,
    });

    // Send confirmation email (don't fail the request if email fails)
    try {
      await sendWaitlistConfirmation(email, name);
    } catch (emailError) {
      console.error("Failed to send waitlist email:", emailError);
    }

    return NextResponse.json(
      { message: "Welcome to the waitlist!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
