import DashboardLayout from "@/components/DashboardLayout"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { connectToDatabase } from "@/app/lib/mongodb";
import Task from "@/app/models/Task";

export default async function ImportantPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-4xl py-16 text-center text-sm text-blue-100/70">
          You must be logged in to view this page.
        </div>
      </DashboardLayout>
    );
  }

  await connectToDatabase();

  const importantTasks = await Task.find({
    userId: session.user.id,
    important: true,
  }).sort({ createdAt: -1 });

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl py-16">
        <h1 className="mb-6 text-3xl font-bold text-white">Important Tasks</h1>
        {importantTasks.length === 0 ? (
          <p className="text-sm text-blue-100/70">
            You have no important tasks.
          </p>
        ) : (
          <ul className="space-y-4">
            {importantTasks.map((task) => (
              <li
                key={task._id.toString()}
                className="rounded-lg border border-white/10 bg-slate-800 p-4"
              >
                <h2 className="text-lg font-semibold text-white">
                  {task.title}
                </h2>
                {task.description && (
                  <p className="mt-1 text-sm text-blue-100/70">
                    {task.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}