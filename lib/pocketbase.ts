import PocketBase from 'pocketbase';

// Initialize the default PocketBase client for client-side usage
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
pb.autoCancellation(false);

export default pb;

// Note: For server-side operations, create a new PocketBase instance in the server component