import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const { pathname } = req.nextUrl;
      
      // Protect all /api/v1 routes except auth routes (register, etc)
      if (pathname.startsWith("/api/v1") && !pathname.startsWith("/api/v1/auth/register")) {
        return token !== null;
      }
      
      // Protect the dashboard route
      if (pathname.startsWith("/dashboard")) {
        return token !== null;
      }
      
      return true;
    },
  },
});

export const config = {
  matcher: ["/api/v1/:path*", "/dashboard/:path*"],
};
