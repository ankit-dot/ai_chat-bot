import mongooseConnection from '@/lib/DB/mongoDB'; // Mongoose connection
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { NextRequest } from 'next/server';
import ChatHistory from "@/app/models/ChatHistory"; // Mongoose ChatHistory model

interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// GET API to fetch chat history
export async function GET(request: NextRequest, { params }: { params: { chatId: string} }) {
  try {
    // Ensure Mongoose is connected
    await mongooseConnection;

    const { chatId } = params;

    // Check if the userId is a valid ObjectId
    if (!ObjectId.isValid(chatId)) {
      return NextResponse.json({ message: 'Invalid user ID format' }, { status: 400 });
    }
   
    // Fetch the chat history using Mongoose
    console.log(chatId);
    const chatHistory = await ChatHistory.findOne({_id: new ObjectId(chatId) });

    if (!chatHistory) {
      return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json(chatHistory, { status: 200 });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: 'Error fetching chat history', details: error.message }, { status: 500 });
  }
}