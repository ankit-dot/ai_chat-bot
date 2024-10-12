import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/DB/mongoDB"; // Import your MongoDB connection
import { MongoClient, Db } from "mongodb";
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
      // Connect to MongoDB
      const client: MongoClient = await clientPromise;
      const db: Db = client.db("tg_assignment"); // Connect to your database (replace with your DB name)
  
      // Parse the request body
      const { email, password } = await req.json();
  
      // Access your 'users' collection
      const userCollection = db.collection("users");
  
      // Find the user by email
      const user = await userCollection.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 400 });
      }
  
      // Check if the provided password is valid
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 400 }
        );
      }
  
      // Respond with the user ID and role
      return NextResponse.json(
        { userId: user._id, role: user.role },
        { status: 200 }
      );
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }