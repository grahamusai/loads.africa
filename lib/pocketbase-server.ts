import PocketBase from 'pocketbase';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Create PocketBase client for middleware and server components
export function createServerClient() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.autoCancellation(false);
  return pb;
}

// Create PocketBase client specifically for middleware
export function createMiddlewareClient(request?: NextRequest) {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.autoCancellation(false);

  // Load auth store from cookies if available
  try {
    const cookie = request?.cookies?.get('pb_auth');
    if (cookie?.value) {
      pb.authStore.loadFromCookie(cookie.value);
    }
  } catch (err) {
    // Reset the auth store on error
    pb.authStore.clear();
  }

  return pb;
}
