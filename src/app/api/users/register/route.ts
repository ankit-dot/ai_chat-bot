// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/DB/mongoDB"; // Import your MongoDB connection
import { MongoClient, Db } from "mongodb"; // Import MongoDB types
import mongooseConnection from "@/lib/DB/mongoDB";
import User from "@/app/models/User";

// POST: Create a new user
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Ensure Mongoose is connected
    await mongooseConnection;

    // Parse the request body
    const { email, password, role } = await req.json();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    });

    // Save the user to the database
    await newUser.save();

    // Respond with a success message
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Authenticate an existing user
