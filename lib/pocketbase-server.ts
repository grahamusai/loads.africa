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
  return pb;
}
