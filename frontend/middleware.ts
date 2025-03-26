import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './utils/supabase/middleware';

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/auth', '/privacy', '/terms'];

// Check if the route is public
const isPublicRoute = (path: string) => {
  // Check if it's a data route for Next.js /_next paths or static assets
  if (path.startsWith('/_next/') || 
      path.startsWith('/static/') || 
      path.endsWith('.ico') || 
      path.endsWith('.png') || 
      path.endsWith('.svg')) {
    return true;
  }
  
  // For regular routes, check against our public routes list
  return publicRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
};

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;
  
  // Skip middleware for Next.js data routes and images
  if (pathname.includes('/_next/') || pathname.includes('/images/')) {
    return NextResponse.next();
  }
  
  // Create Supabase client with cookies from the request
  const { supabase, response } = createClient(request);
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // Special handling for homepage
  if (pathname === '/') {
    // If no session and trying to access homepage, redirect to login
    if (!session) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      return NextResponse.redirect(redirectUrl);
    } else {
      // If authenticated and on homepage, redirect to companies page
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/companies';
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  // If it's a public route, allow access regardless of auth status
  if (isPublicRoute(pathname)) {
    // If user is already authenticated and trying to access login/signup, redirect to main page
    if (session && (pathname === '/login' || pathname === '/signup')) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/companies';
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }
  
  // If no session and trying to access protected route, redirect to login
  if (!session && !isPublicRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  return response;
}

// Specify which routes this middleware should be applied to
export const config = {
  matcher: [
    // Apply to all routes except for static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}; 