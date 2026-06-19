import { authOptions } from "@/app/lib/auth";
import { connectToDatabase } from "@/app/lib/mongodb";
import Task from "@/app/models/Task";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{ id: string }>;
};

const taskStatuses = ["pending", "in-progress", "completed"] as const;

function isTaskStatus(status: unknown): status is (typeof taskStatuses)[number] {
    return typeof status === "string" && taskStatuses.includes(status as never);
}

async function getTaskId(context: RouteContext) {
    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
        return null;
    }

    return id;
}

export async function GET(_request: Request, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const id = await getTaskId(context);

        if (!id) {
            return NextResponse.json({ message: "Invalid task id" }, { status: 400 });
        }

        await connectToDatabase();

        const task = await Task.findOne({
            _id: id,
            userId: session.user.id,
        }).lean();

        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error("Error fetching task:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

async function updateTask(request: Request, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const id = await getTaskId(context);

        if (!id) {
            return NextResponse.json({ message: "Invalid task id" }, { status: 400 });
        }

        const body = await request.json();
        const update: {
            title?: string;
            description?: string;
            completed?: boolean;
            status?: "pending" | "in-progress" | "completed";
        } = {};

        if ("title" in body) {
            const title = typeof body.title === "string" ? body.title.trim() : "";

            if (!title) {
                return NextResponse.json(
                    { message: "Title is required" },
                    { status: 400 }
                );
            }

            update.title = title;
        }

        if ("description" in body) {
            update.description =
                typeof body.description === "string" ? body.description.trim() : "";
        }

        if ("completed" in body) {
            if (typeof body.completed !== "boolean") {
                return NextResponse.json(
                    { message: "Completed must be true or false" },
                    { status: 400 }
                );
            }

            update.completed = body.completed;
            update.status = body.completed ? "completed" : "pending";
        }

        if ("status" in body) {
            if (!isTaskStatus(body.status)) {
                return NextResponse.json(
                    { message: "Invalid task status" },
                    { status: 400 }
                );
            }

            update.status = body.status;
            update.completed = body.status === "completed";
        }

        if (Object.keys(update).length === 0) {
            return NextResponse.json(
                { message: "No task changes provided" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const task = await Task.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            update,
            { new: true, runValidators: true }
        );

        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request, context: RouteContext) {
    return updateTask(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
    return updateTask(request, context);
}

export async function DELETE(_request: Request, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const id = await getTaskId(context);

        if (!id) {
            return NextResponse.json({ message: "Invalid task id" }, { status: 400 });
        }

        await connectToDatabase();

        const task = await Task.findOneAndDelete({
            _id: id,
            userId: session.user.id,
        });

        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Task deleted" });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
