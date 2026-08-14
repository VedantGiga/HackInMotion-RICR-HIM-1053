import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const GUEST_USER_EMAIL = "guest@koshin.ai";
export const GUEST_USER_ID = "guest_demo_user_id_2026";

/**
 * Retrieves the currently authenticated user ID from session/token,
 * ensures user record exists in SQLite to prevent Foreign Key errors,
 * or falls back to a Guest Demo User ID.
 */
export async function getAuthenticatedUserId(): Promise<string> {
  let targetUserId = GUEST_USER_ID;
  let targetEmail = GUEST_USER_EMAIL;
  let targetName = "Guest Demo User";

  try {
    const session = await getServerSession(authOptions);
    if (session && session.user && (session.user as any).id) {
      targetUserId = (session.user as any).id;
      targetEmail = session.user.email || `${targetUserId}@koshin.ai`;
      targetName = session.user.name || "User";
    }
  } catch (error) {
    console.warn("[getAuthenticatedUserId warning]:", error);
  }

  // Ensure User record exists in SQLite database so foreign keys never fail
  try {
    await prisma.user.upsert({
      where: { id: targetUserId },
      update: {},
      create: {
        id: targetUserId,
        email: targetEmail,
        password: "OAuthUserNoPassword123!",
        name: targetName,
      },
    });
  } catch (err) {
    // Ignore if already exists or concurrent upsert
  }

  return targetUserId;
}
