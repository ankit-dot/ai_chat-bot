// lib/mongodb.ts
import { MongoClient } from 'mongodb';

// MongoDB URI from environment variables
const uri: string | undefined = process.env.MONGODB_URI;

// Ensure MONGODB_URI is set in .env.local
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const options: object = {};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// In development, use a global variable to preserve the client across hot-reloads
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  // In production, create a new MongoClient instance without using globals
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise.
// By doing this, we can reuse the same MongoClient instance across the app.
export default clientPromise;
