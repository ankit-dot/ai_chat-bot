import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/DB/mongoDB"; // Import your MongoDB connection
import { MongoClient, Db } from "mongodb";
import mongooseConnection from "@/lib/DB/mongoDB";
import User from "@/app/models/User";
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Ensure Mongoose is connected
    await mongooseConnection;

    // Parse the request body
    const { email, password } = await req.json();

    // Find the user by email
    const user = await User.findOne({ email });
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
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
