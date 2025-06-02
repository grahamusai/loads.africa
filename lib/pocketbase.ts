import PocketBase from 'pocketbase';
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// Create PocketBase client for middleware
export function createMiddlewareClient() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.autoCancellation(false);
  return pb;
}

// Initialize the default PocketBase client
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
pb.autoCancellation(false);

export default pb;