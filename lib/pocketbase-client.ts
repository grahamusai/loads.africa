'use client';

import PocketBase from 'pocketbase';

let pb: PocketBase | null = null;

// Initialize PocketBase client only on the client side
export function getPocketBaseClient() {
  if (typeof window === 'undefined') return null;
  
  if (!pb) {
    pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    pb.autoCancellation(false);
    
    // After auth state changes, save the cookie
    pb.authStore.onChange(() => {
      if (pb) {
        document.cookie = pb.authStore.exportToCookie();
      }
    }, true);
  }
  
  return pb;
}

export default getPocketBaseClient;
