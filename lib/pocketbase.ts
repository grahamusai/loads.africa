'use client';

import PocketBase from 'pocketbase';

// Initialize the default PocketBase client for client-side usage
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
pb.autoCancellation(false);

// After auth state changes, save the cookie
pb.authStore.onChange(() => {
  document.cookie = pb.authStore.exportToCookie();
}, true);

export default pb;