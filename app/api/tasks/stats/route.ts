import {NextResponse} from "next/server";
import { getServerSession} from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import Task from "@/app/models/Task";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function GET(){
    try{
        const session = await getServerSession(authOptions);

        if(!session?.user?.id){
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        await connectToDatabase();

        const totalTasks = await Task.countDocuments({userId: session.user.id});
        const completedTasks = await Task.countDocuments({userId: session.user.id, completed: true});
        const pendingTasks = await Task.countDocuments({userId: session.user.id, completed: false});

        return NextResponse.json({
            totalTasks,
            completedTasks,
            pendingTasks
        });
    }catch(error){
        console.error("Error fetching task stats:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}