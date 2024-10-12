// app/api/check-db/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/DB/mongoDB';
import { MongoClient, Db, CollectionInfo } from 'mongodb';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Attempt to connect to the database
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('tg_assignment');

    // Check if you can list collections
    const collections: CollectionInfo[] = await db.listCollections().toArray();

    // If connection is successful, return the list of collections
    return NextResponse.json(
      { message: 'Database connected successfully', collections },
      { status: 200 }
    );
  } catch (error: any) {
    // Return an error response if connection fails
    return NextResponse.json(
      { message: 'Database connection failed', error: error.message },
      { status: 500 }
    );
  }
}
