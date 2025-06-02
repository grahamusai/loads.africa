import { createMiddlewareClient } from '@/lib/pocketbase'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Initialize the PocketBase client
  const pb = createMiddlewareClient()
  
  // Check if user is authenticated
  if (!pb.authStore.isValid) {
    // Get the pathname
    const url = request.nextUrl.clone()
    const path = url.pathname

    // If trying to access protected routes and not authenticated
    if (path.startsWith('/dashboard') || path.startsWith('/carrier-dashboard') || path.startsWith('/clearing-agents')) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/carrier-dashboard/:path*',
    '/clearing-agents/:path*',
  ],
}
