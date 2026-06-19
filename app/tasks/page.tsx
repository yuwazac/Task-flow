"use client";

import type { Task } from "@/app/types/task";
import CreateTask from "@/components/CreateTask";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import StarButton from "@/components/StarButton";

export default function TasksPage() {
    const { status } = useSession();
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const loadTasks = useCallback(async () => {
        setLoading(true);
        setError("");

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
    }, []);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
            return;
        }

        if (status === "authenticated") {
            const load = async () => {
                await loadTasks();
            };
            void load();    
        }
    }, [status, router, loadTasks]);

    function handleTaskCreated(task: Task) {
        setTasks((currentTasks) => [task, ...currentTasks]);
    }

    async function toggleTask(task: Task) {
        setUpdatingId(task._id);
        setError("");

        try {
            const response = await fetch(`/api/tasks/${task._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !task.completed }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || "Failed to update task");
            }

            const updatedTask: Task = await response.json();
            setTasks((currentTasks) =>
                currentTasks.map((currentTask) =>
                    currentTask._id === updatedTask._id ? updatedTask : currentTask
                )
            );
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to update task");
        } finally {
            setUpdatingId(null);
        }
    }

    async function deleteTask(taskId: string) {
        setUpdatingId(taskId);
        setError("");

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || "Failed to delete task");
            }

            setTasks((currentTasks) =>
                currentTasks.filter((task) => task._id !== taskId)
            );
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to delete task");
        } finally {
            setUpdatingId(null);
        }
    }


    async function toggleImportant(task: Task) {
        setUpdatingId(task._id);
        setError("");

        try {
            const response = await fetch(`/api/tasks/${task._id}/important`, {
                method: "PATCH",
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || "Failed to update task importance");
            }

            const updatedTask: Task = await response.json();
            setTasks((currentTasks) =>
                currentTasks.map((currentTask) =>
                    currentTask._id === updatedTask._id ? updatedTask : currentTask
                )
            );
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to update task importance");
        } finally {
            setUpdatingId(null);
        }
    }

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                        Stay organized
                    </p>
                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        My Tasks
                    </h1>
                    <p className="mt-2 text-sm text-blue-100/80 sm:text-base">
                        Create tasks and keep track of your progress.
                    </p>
                </div>

                <div className="rounded-3xl border border-white/15 bg-slate-950/25 p-4 shadow-2xl shadow-slate-950/15 backdrop-blur-xl sm:p-6">
                    <CreateTask onTaskCreated={handleTaskCreated} />

                    {error && (
                        <p className="mb-4 rounded-xl border border-red-300/20 bg-red-500/15 p-3 text-red-100">
                            {error}
                        </p>
                    )}

                    {status === "loading" || loading ? (
                        <p className="py-10 text-center text-blue-100/70">
                            Loading tasks...
                        </p>
                    ) : tasks.length === 0 ? (
                        <p className="py-10 text-center text-blue-100/70">
                            You do not have any tasks yet.
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {tasks.map((task) => (
                                <li
                                    key={task._id}
                                    className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-white sm:flex-nowrap sm:p-4"
                                >
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => void toggleTask(task)}
                                        disabled={updatingId === task._id}
                                        aria-label={`Mark ${task.title} as ${
                                            task.completed ? "pending" : "completed"
                                        }`}
                                        className="h-5 w-5 flex-none accent-emerald-400"
                                    />
                                    <span
                                        className={`min-w-0 flex-1 break-words ${
                                            task.completed
                                                ? "text-blue-100/50 line-through"
                                                : "text-white"
                                        }`}
                                    >
                                        {task.title}
                                    </span>
                                    <StarButton
                                        isImportant={task.important}
                                        onClick={() => void toggleImportant(task)}
                                    />
                                    <span className="order-4 ml-8 rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-blue-100 sm:order-none sm:ml-0">
                                        {task.status.replace("-", " ")}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => void deleteTask(task._id)}
                                        disabled={updatingId === task._id}
                                        className="rounded-lg px-3 py-2 text-sm font-medium text-red-200 hover:bg-red-500/20 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.push(`/tasks/${task._id}/edit`)}
                                        aria-label={`Edit ${task.title}`}
                                        title="Edit task"
                                        className="rounded-lg p-2 text-blue-200 hover:bg-blue-500/20"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5"
                                        >
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
