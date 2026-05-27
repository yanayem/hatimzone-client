import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("adminToken")?.value;
  const { pathname } = request.nextUrl;

  // Public admin routes (login page + forgot password)
  const publicPaths = ["/admin", "/admin/forgot-password"];

  // Protect admin pages
  if (
    pathname.startsWith("/admin") &&
    !publicPaths.includes(pathname)
  ) {
    // No token → redirect to login
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin";
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify JWT using jose
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "fallback_secret"
      );

      await jwtVerify(token, secret);

      return NextResponse.next();
    } catch (error) {
      console.error("JWT Verify Error:", error.message);

      // Invalid/expired token → clear cookie and redirect to login
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin";
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("adminToken");

      return response;
    }
  }

  // If user is already logged in and visits /admin (login page), redirect to dashboard
  if (pathname === "/admin" && token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "fallback_secret"
      );
      await jwtVerify(token, secret);

      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/admin/dashboard";
      return NextResponse.redirect(dashboardUrl);
    } catch {
      // Token is invalid, let them see the login page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
