import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
    // If no session exists, NextAuth will handle the redirect to /login
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true to allow access, false to redirect to login
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all routes under /dashboard
     * Exclude authentication routes and static assets
     */
    '/dashboard/:path*',
    '/((?!login|_next/static|favicon.ico).*)',
  ],
};