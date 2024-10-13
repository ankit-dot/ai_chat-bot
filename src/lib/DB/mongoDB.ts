import mongoose from 'mongoose';

// MongoDB URI from environment variables
const uri: string | undefined = process.env.MONGODB_URI;

// Ensure MONGODB_URI is set in .env.local
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

// In development, use a global variable to preserve the Mongoose connection across hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

let mongooseConnection: Promise<typeof mongoose>;

// If the environment is development, use the global variable to persist the connection
if (process.env.NODE_ENV === 'development') {
  if (!global._mongooseConnection) {
    global._mongooseConnection = mongoose.connect(uri);
  }
  mongooseConnection = global._mongooseConnection;
} else {
  // In production, create a new Mongoose connection without using globals
  mongooseConnection = mongoose.connect(uri);
}

// Export a module-scoped Mongoose promise.
// By doing this, we can reuse the same Mongoose connection across the app.
export default mongooseConnection;
