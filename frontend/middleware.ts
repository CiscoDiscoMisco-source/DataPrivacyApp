import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const response = createClient(request);
  
  // You can add additional middleware logic here
  
  return response;
}

// Specify which routes this middleware should be applied to
export const config = {
  matcher: [
    // Add paths that should use Supabase authentication
    // Example: all routes except for static files, api routes, etc.
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}; 