import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import {connectToDatabase }from "@/app/lib/mongodb";
import Task from "@/app/models/Task";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectToDatabase();

    const task = await Task.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    task.important = !task.important;

    await task.save();

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task importance:", error);
    return NextResponse.json(
      { message: "Failed to update task importance" },
      { status: 500 }
    );
  }
}