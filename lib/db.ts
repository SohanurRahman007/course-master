// lib/db.ts
import mongoose from 'mongoose';

// 1. Get the URI value from environment variables.
const MONGODB_URI = process.env.MONGODB_URI;

// 2. Throw an error immediately if the URI is missing.
// This block ensures that MONGODB_URI is available if execution continues.
if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

// 3. Define the cache interface and global declaration
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Get the existing global cache or initialize a new one.
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Assign to global.mongoose if not already assigned (important for HMR)
if (!global.mongoose) {
  global.mongoose = cached;
}

// 4. Update connectDB to use non-null assertion or cast
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    };

    console.log('🔄 Creating new MongoDB connection...');
    
    // FIX APPLIED: Using non-null assertion (!) on MONGODB_URI
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB Connected Successfully');
      return mongooseInstance;
    }).catch((error) => {
      console.error('❌ MongoDB Connection Error:', error);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

// Test connection function
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await connectDB(); // Ensure connection is established
    
    // Additional test - ping the database
    const adminDb = connection.connection.db?.admin(); // Use the connection object
    if (adminDb) {
      const pingResult = await adminDb.ping();
      console.log('📡 Database Ping Result:', pingResult);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}

// Get connection status
export function getConnectionStatus() {
  return {
    // Note: If using Mongoose 7+, you might need to use `mongoose.connection` directly
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  };
}