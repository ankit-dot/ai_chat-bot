// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/DB/mongoDB"; // Import your MongoDB connection
import { MongoClient, Db, ObjectId } from "mongodb"; // Import MongoDB types
import mongooseConnection from "@/lib/DB/mongoDB";
import User from "@/app/models/User";
import ChatHistory from "@/app/models/ChatHistory";

// POST: Create a new user
export async function GET() {
  try {
    // Ensure Mongoose is connected
    await mongooseConnection;

    
    
    // Check if the userId is a valid ObjectId
 

    // Fetch the chat history using Mongoose
    const chat = await ChatHistory.find({});
    const users = await User.find({});

    if (!chat) {
      return NextResponse.json({ message: 'Chat history not found' }, { status: 404 });
    }

    return NextResponse.json({chat, users} , { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error fetching chat history', details: error.message }, { status: 500 });
  }
}



