import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './utils/supabase/middleware';

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/', '/auth', '/privacy', '/terms'];

// Check if the route is public
const isPublicRoute = (path: string) => {
  return publicRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
};

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;
  
  // If it's a public route, no need to check auth
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Create Supabase client with cookies from the request
  const { supabase, response } = createClient(request);
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
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
    // Apply to all routes except for static files, api routes, etc.
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}; 