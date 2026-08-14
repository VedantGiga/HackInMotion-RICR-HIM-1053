import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOTPCode } from "@/lib/otp-store";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and verification code are required" }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanCode = String(code).trim();

    // 1. Verify against serverless resilient OTP store
    const storeResult = verifyOTPCode(cleanEmail, cleanCode);

    if (storeResult.success) {
      // Clean up database verification record if it exists
      try {
        await prisma.verificationCode.delete({ where: { email: cleanEmail } });
      } catch (e) {
        // ignore DB cleanup warning
      }
      return NextResponse.json({ success: true, message: "Email verified successfully" });
    }

    // 2. Fallback to Prisma database verification record
    try {
      const verificationRecord = await prisma.verificationCode.findUnique({
        where: { email: cleanEmail },
      });

      if (verificationRecord) {
        if (verificationRecord.code === cleanCode) {
          if (new Date() > verificationRecord.expiresAt) {
            return NextResponse.json({ error: "Verification code has expired. Please request a new code." }, { status: 400 });
          }

          await prisma.verificationCode.delete({ where: { email: cleanEmail } });
          return NextResponse.json({ success: true, message: "Email verified successfully" });
        }
      }
    } catch (dbErr) {
      console.warn("[Verify DB Fallback Warning]:", dbErr);
    }

    return NextResponse.json(
      { error: storeResult.error || "Invalid verification code. Please check your email and try again." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Failed to verify code:", error);
    return NextResponse.json({ error: "Internal server error during verification" }, { status: 500 });
  }
}
