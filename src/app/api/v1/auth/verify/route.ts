import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const verificationRecord = await prisma.verificationCode.findUnique({
      where: { email },
    });

    if (!verificationRecord) {
      return NextResponse.json({ error: "No verification code found" }, { status: 404 });
    }

    if (verificationRecord.code !== code) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    if (new Date() > verificationRecord.expiresAt) {
      return NextResponse.json({ error: "Verification code expired" }, { status: 400 });
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    });

    // Delete the code so it can't be reused
    await prisma.verificationCode.delete({
      where: { email },
    });

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error: any) {
    console.error("Failed to verify code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
