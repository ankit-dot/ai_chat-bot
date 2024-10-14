import mongooseConnection from "@/lib/DB/mongoDB"; // Mongoose connection
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import ChatHistory from "@/app/models/ChatHistory"; // Mongoose ChatHistory model

interface Message {
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// GET API to fetch chat history
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Ensure Mongoose is connected
    await mongooseConnection;

    const { userId } = params;

    // Check if the userId is a valid ObjectId
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Fetch the chat history using Mongoose
    const chatHistory = await ChatHistory.find({
      userId: new ObjectId(userId),
    });

    if (!chatHistory) {
      return NextResponse.json(
        { message: "Chat history not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(chatHistory, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error fetching chat history", details: error.message },
      { status: 500 }
    );
  }
}

// POST API to add new messages to chat history
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Ensure database connection
    await mongooseConnection;

    const { userId } = params;
    const {
      messages,
      chatId,
    }: {
      messages: { content: string; sender: "user" | "bot" }[];
      chatId?: string;
    } = await request.json();

    // Validate ObjectId format
    if (!ObjectId.isValid(userId) || (chatId && !ObjectId.isValid(chatId))) {
      return NextResponse.json(
        { message: "Invalid user ID or chat ID format" },
        { status: 400 }
      );
    }

    let chatHistory;
    console.log(chatId);
    if (chatId) {
      // If chatId exists, find the existing chat history
      chatHistory = await ChatHistory.findOne({
        _id: new ObjectId(chatId),
        userId: new ObjectId(userId),
      });

      if (!chatHistory) {
        return NextResponse.json(
          { message: "Chat history not found" },
          { status: 404 }
        );
      }

      // Clear old messages and push new messages
      chatHistory.messages = []; // Clear existing messages
    } else {
      // If no chatId provided, create a new chat history
      chatHistory = new ChatHistory({
        userId: new ObjectId(userId),
        messages: [], // Initialize with an empty messages array
        createdAt: new Date(),
      });
    }

    // Append the new messages to the chat history
    messages.forEach((message) => {
      chatHistory.messages.push({
        content: message.content,
        sender: message.sender,
        timestamp: new Date(),
      });
    });

    // Save the updated chat history (whether it's a new one or updated one)
    await chatHistory.save();

    return NextResponse.json(
      {
        message: "Messages added successfully",
        chatId: chatHistory._id, // Return chatId (whether newly created or existing)
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving messages:", error);
    return NextResponse.json(
      { error: "Error saving messages", details: error.message },
      { status: 500 }
    );
  }
}
