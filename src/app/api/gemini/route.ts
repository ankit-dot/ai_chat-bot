import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Create an asynchronous function POST to handle POST
// request with parameters request and response.
export async function POST(req: NextRequest) {
  try {
    // Access your API key by creating an instance of GoogleGenerativeAI we'll call it GenAI
    const gemini_api: any | undefined = process.env.GEMINI_API;
    const genAI = new GoogleGenerativeAI(gemini_api);

    // Ininitalise a generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Retrieve the data we recieve as part of the request body
    const data = await req.json();

    // Define a prompt varibale
    const prompt = data.body;

    // Pass the prompt to the model and retrieve the output
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = await response.text();
    console.log(output);
    // Send the llm output as a server reponse object
    return NextResponse.json({ output: output });
  } catch (error) {
    console.error(error);
  }
}
