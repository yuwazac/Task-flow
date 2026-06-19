import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Task from "@/app/models/Task";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

// GET /api/tasks
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const tasks = await Task.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST /api/tasks
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const title = typeof body.title === "string" ? body.title.trim() : "";

        if (!title) {
            return NextResponse.json(
                { message: "Title is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const newTask = await Task.create({
            title,
            userId: session.user.id,
            completed: false,
            status: "pending",
        });

        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
