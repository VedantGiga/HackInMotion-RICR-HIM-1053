import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { saveOTPCode } from "@/lib/otp-store";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save in serverless resilient OTP store
    saveOTPCode(cleanEmail, code, 10);

    // Save or update code in Prisma database if accessible
    try {
      await prisma.verificationCode.upsert({
        where: { email: cleanEmail },
        update: {
          code,
          expiresAt,
          createdAt: new Date(),
        },
        create: {
          email: cleanEmail,
          code,
          expiresAt,
        },
      });
    } catch (dbErr) {
      console.warn("[SendVerification DB Warning]:", dbErr);
    }

    // Send verification email via EmailJS / SMTP
    const emailRes = await sendVerificationEmail(cleanEmail, code);

    return NextResponse.json({
      success: true,
      emailSent: emailRes?.success || false,
      code: code,
      message: "Verification code sent to your email address",
    });
  } catch (error: any) {
    console.error("Failed to send verification email:", error);
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }
}
