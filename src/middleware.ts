import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is already logged in and tries to access auth pages (login, signup, verify, forgot-password), redirect to dashboard
    const isAuthPage =
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/forgot-password";

    if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to auth pages even if unauthenticated
        const isAuthPage =
          pathname === "/login" ||
          pathname === "/signup" ||
          pathname === "/verify" ||
          pathname === "/forgot-password";

        if (isAuthPage) {
          return true;
        }

        // Protect all /api/v1 routes except auth routes
        if (pathname.startsWith("/api/v1") && !pathname.startsWith("/api/v1/auth/")) {
          return token !== null;
        }
        
        // Protect dashboard and onboarding routes
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding")) {
          return token !== null;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/api/v1/:path*", 
    "/dashboard/:path*", 
    "/onboarding/:path*",
    "/login",
    "/signup",
    "/verify",
    "/forgot-password"
  ],
};
