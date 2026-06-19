'use server';

import { NextResponse } from "next/server";
import { connectToDatabase} from "@/app/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();

    return NextResponse.json({
      success: true,
      message: "MongoDB Connected",
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to MongoDB"
      },
      { status: 500 }
    );
  }
}