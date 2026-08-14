import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

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
