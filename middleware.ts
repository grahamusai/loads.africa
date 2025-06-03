import { createMiddlewareClient } from '@/lib/pocketbase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Initialize the PocketBase client with the request
  const pb = createMiddlewareClient(request)
  
  // Get response to modify headers
  const response = NextResponse.next()
  
  // Check if user is authenticated
  if (pb.authStore.isValid) {
    // Get the pathname
    const url = request.nextUrl.clone()
    const path = url.pathname    // If trying to access protected routes and not authenticated
    if (path.startsWith('/dashboard') || path.startsWith('/carrier-dashboard') || path.startsWith('/clearing-agents')) {
      url.pathname = '/login'
      // Add the original URL as a redirect parameter, properly encoded
      url.searchParams.set('redirect', encodeURIComponent(path))
      return NextResponse.redirect(url)
    }
  }

  // Update the response headers with the auth cookie if it exists
  if (pb.authStore.isValid) {
    response.headers.set('set-cookie', pb.authStore.exportToCookie())
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/carrier-dashboard/:path*',
    '/clearing-agents/:path*',
  ],
}
