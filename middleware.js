import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('adminToken')?.value;
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except the login page and public APIs
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      // Verify token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware JWT Error:', error);
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
