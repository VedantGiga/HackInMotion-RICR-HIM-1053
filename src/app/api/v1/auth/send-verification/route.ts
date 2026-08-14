import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save or update code in database
    await prisma.verificationCode.upsert({
      where: { email },
      update: {
        code,
        expiresAt,
        createdAt: new Date(),
      },
      create: {
        email,
        code,
        expiresAt,
      },
    });

    // Await email delivery so Vercel serverless function stays active during HTTP dispatch
    const emailRes = await sendVerificationEmail(email, code);

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
