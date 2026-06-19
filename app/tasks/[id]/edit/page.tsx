"use client";

import type { Task } from "@/app/types/task";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

type TaskStatus = Task["status"];

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (sessionStatus !== "authenticated" || !id) {
      return;
    }

    async function fetchTask() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/tasks/${id}`, { cache: "no-store" });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || "Failed to fetch task");
        }

        const task: Task = await response.json();

        setTitle(task.title);
        setDescription(task.description || "");
        setTaskStatus(task.status);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch task");
      } finally {
        setLoading(false);
      }
    }

    void fetchTask();
  }, [id, router, sessionStatus]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          description,
          status: taskStatus,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update task");
      }

      router.push("/tasks");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update task");
      setSaving(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Update task
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Edit Task
          </h1>
          <p className="mt-2 text-sm text-blue-100/80 sm:text-base">
            Change the task details and save your progress.
          </p>
        </div>

        <div className="rounded-3xl border border-white/15 bg-slate-950/25 p-4 shadow-2xl shadow-slate-950/15 backdrop-blur-xl sm:p-6">
          {error && (
            <p className="mb-4 rounded-xl border border-red-300/20 bg-red-500/15 p-3 text-red-100">
              {error}
            </p>
          )}

          {sessionStatus === "loading" || loading ? (
            <p className="py-10 text-center text-blue-100/70">Loading task...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-blue-100">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-blue-100/50 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/25"
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-blue-100">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-blue-100/50 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/25"
                  placeholder="Add more detail about this task"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-blue-100">
                  Status
                </label>
                <select
                  value={taskStatus}
                  onChange={(event) =>
                    setTaskStatus(event.target.value as TaskStatus)
                  }
                  className="w-full rounded-xl border border-white/20 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/25"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving || !title.trim()}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-950/20 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/tasks")}
                  disabled={saving}
                  className="rounded-xl border border-white/15 px-5 py-3 font-bold text-blue-100 hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
