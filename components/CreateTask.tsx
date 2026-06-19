"use client";

import type { Task } from "@/app/types/task";
import { useState, type FormEvent } from "react";

type CreateTaskProps = {
    onTaskCreated: (task: Task) => void;
};

export default function CreateTask({ onTaskCreated }: CreateTaskProps) {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            setError("Please enter a task title");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: trimmedTitle }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || "Failed to create task");
            }

            const task: Task = await response.json();
            setTitle("");
            onTaskCreated(task);
        } catch (error: unknown) {
            console.error(error);
            setError(
                error instanceof Error ? error.message : "An unknown error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New task title"
                    className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-blue-100/50 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/25"
                    disabled={loading}
                    maxLength={200}
                />
                <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-950/20 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading || !title.trim()}
                >
                    {loading ? "Adding..." : "Add Task"}
                </button>
            </div>
            {error && <p className="mt-3 text-sm text-red-200">{error}</p>}
        </form>
    );
}
