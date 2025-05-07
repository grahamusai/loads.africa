import PocketBase from 'pocketbase';

// Initialize the PocketBase client
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
pb.autoCancellation(false)

export default pb;