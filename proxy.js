// proxy.js

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request) {
  const token = request.cookies.get("adminToken")?.value;
  const { pathname } = request.nextUrl;

  // Public admin routes
  const publicPaths = ["/admin", "/admin/forgot-password"];

  // Protect admin pages
  if (
    pathname.startsWith("/admin") &&
    !publicPaths.includes(pathname)
  ) {
    // No token
    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    try {
      // Verify JWT
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET
      );

      await jwtVerify(token, secret);

      return NextResponse.next();
    } catch (error) {
      console.error("JWT Verify Error:", error);

      // Remove invalid cookie
      const response = NextResponse.redirect(
        new URL("/admin", request.url)
      );

      response.cookies.delete("adminToken");

      return response;
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