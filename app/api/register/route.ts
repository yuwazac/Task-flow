'use server';

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function POST(request: NextRequest) {
    try{
        const {name, email, password} = await request.json();

        await connectToDatabase();

        const existingUser = await User.findOne({email});

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User with this email already exists",
                },
                {status: 400}
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return NextResponse.json({
            success: true,
            message: "User registered successfully",
        });
    }catch(error){
        console.error("Error registering user:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to register user",
            },
            {status: 500}
        );
    }
}