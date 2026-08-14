import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const GUEST_USER_EMAIL = "guest@koshin.ai";

/**
 * Retrieves the currently authenticated user ID from NextAuth session,
 * or falls back to a Guest Demo User if no session is present.
 */
export async function getAuthenticatedUserId(): Promise<string> {
  try {
    const session = await getServerSession(authOptions);
    if (session && session.user && (session.user as any).id) {
      return (session.user as any).id;
    }

    // Fallback for demo/guest mode
    let guestUser = await prisma.user.findUnique({
      where: { email: GUEST_USER_EMAIL },
    });

    if (!guestUser) {
      guestUser = await prisma.user.create({
        data: {
          email: GUEST_USER_EMAIL,
          name: "Guest Demo User",
          password: "guest_demo_password_hash",
        },
      });
    }

    return guestUser.id;
  } catch (error) {
    console.error("[getAuthenticatedUserId Error]:", error);
    
    // Ensure we always return a valid user ID string even if DB error occurs
    let guest = await prisma.user.findFirst();
    if (!guest) {
      guest = await prisma.user.create({
        data: {
          email: GUEST_USER_EMAIL,
          name: "Guest Demo User",
          password: "guest_demo_password_hash",
        },
      });
    }
    return guest.id;
  }
}
