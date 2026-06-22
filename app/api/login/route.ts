import { NextRequest, NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { authSecret } from "@/app/lib/auth";
import { connectToDatabase } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";

const sessionMaxAge = 30 * 60;

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        if (!authSecret) {
            console.error("A NextAuth secret is required to create a session");
            return NextResponse.json(
                { message: "Authentication is not configured" },
                { status: 500 }
            );
        }

        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({message: "Invalid email or password"}, {status: 401});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({message: "Invalid email or password"}, {status: 401});
        }

        const userId = user._id.toString();
        const sessionToken = await encode({
            secret: authSecret,
            maxAge: sessionMaxAge,
            token: {
                sub: userId,
                id: userId,
                name: user.name,
                email: user.email,
            },
        });

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                id: userId,
                name: user.name,
                email: user.email,
            },
        });

        const useSecureCookie =
            process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;

        response.cookies.set({
            name: useSecureCookie
                ? "__Secure-next-auth.session-token"
                : "next-auth.session-token",
            value: sessionToken,
            httpOnly: true,
            sameSite: "lax",
            secure: useSecureCookie,
            path: "/",
            maxAge: sessionMaxAge,
        });

        return response;
    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json({message: "An error occurred"}, {status: 500});
    }
}
