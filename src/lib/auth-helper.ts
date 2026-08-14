import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const GUEST_USER_EMAIL = "guest@koshin.ai";
export const GUEST_USER_ID = "guest_demo_user_id_2026";

/**
 * Retrieves the currently authenticated user ID from session/token,
 * or falls back to a Guest Demo User ID.
 */
export async function getAuthenticatedUserId(): Promise<string> {
  try {
    const session = await getServerSession(authOptions);
    if (session && session.user && (session.user as any).id) {
      return (session.user as any).id;
    }
  } catch (error) {
    console.warn("[getAuthenticatedUserId warning]:", error);
  }

  return GUEST_USER_ID;
}
