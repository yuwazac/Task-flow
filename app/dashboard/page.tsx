"use client";

import type { Task } from "@/app/types/task";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {formatTime} from "@/app/lib/time";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status !== "authenticated") {
      return;
    }

    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks", { cache: "no-store" });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load tasks");
        }

        const data: Task[] = await response.json();
        setTasks(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }

    void loadTasks();
  }, [status, router]);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter(
    (task) => !task.completed && task.status === "pending"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => !task.completed && task.status === "in-progress"
  ).length;

  return (
    <DashboardLayout>
      <header className="mb-6 sm:mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          {session?.user?.name} workspace
        </p>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-blue-100/80 sm:text-base">
          A clear view of your tasks and current progress.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatsCard title="Total Tasks" value={tasks.length} />
        <StatsCard title="Completed" value={completedTasks} />
        <StatsCard title="Pending" value={pendingTasks} />
        <StatsCard title="In Progress" value={inProgressTasks} />
      </div>

      <section className="mt-6 rounded-3xl border border-white/15 bg-slate-950/25 p-4 text-white shadow-2xl shadow-slate-950/15 backdrop-blur-xl sm:mt-8 sm:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div >
            <h2 className="text-xl font-bold text-white sm:text-2xl">Recent Tasks</h2>
            <p className="mt-1 text-sm text-blue-100/70">
              Your latest tasks appear here.
            </p>
          </div>
          <Link
            href="/tasks"
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 px-4 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-emerald-950/20 hover:brightness-110 sm:w-auto"
          >
            View all tasks
          </Link>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-300/20 bg-red-500/15 p-3 text-red-100">
            {error}
          </p>
        ) : status === "loading" || loading ? (
          <p className="py-8 text-center text-blue-100/70">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="py-8 text-center text-blue-100/70">
            No tasks yet. Create your first task from the tasks page.
          </p>
        ) : (
          <ul className="space-y-2">
            {tasks.slice(0, 5).map((task) => (
              <li
                key={task._id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4"
              >
                <span
                  className={`h-2.5 w-2.5 flex-none rounded-full ${
                    task.completed ? "bg-emerald-300" : "bg-cyan-300"
                  }`}
                />
                <span
                  className={`min-w-0 flex-1 truncate ${
                    task.completed
                      ? "text-blue-100/50 line-through"
                      : "text-white"
                  }`}
                >
                  {task.title}
                </span>
                <div>
                  <p className="text-xs text-blue-100/70">
                    {formatTime(task.createdAt)}
                  </p>
                </div>
                <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-blue-100 sm:block">
                  {task.status.replace("-", " ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </DashboardLayout>
  );
}
