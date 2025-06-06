// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user is authenticated
  const token = request.cookies.get('auth-token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/login';
  
  // If accessing login page and already authenticated, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If accessing protected routes and not authenticated, redirect to login
  if (!isAuthPage && !token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
};