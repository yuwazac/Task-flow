"use client";

import DashboardLayout from "@/components/DashboardLayout";
import SignOut from "@/components/SignOut";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TaskStats = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<TaskStats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/tasks/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch task stats");
        }

        const data: TaskStats = await response.json();

        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    }

    if (status === "authenticated") {
      fetchStats();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-4xl py-16 text-center text-sm text-blue-100/70">
          Loading profile...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Profile
          </p>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Welcome back, {session?.user?.name || "User"}
          </h1>

          <p className="mt-3 text-sm text-blue-100/70">
            Manage your account information and view your task statistics.
          </p>
        </header>

        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/15 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white">
              Personal Info
            </h2>

            <div className="mt-5 space-y-4 text-sm text-blue-100/80">
              <div>
                <p className="uppercase tracking-[0.2em] text-emerald-300">
                  Name
                </p>

                <p className="mt-1 text-lg font-medium text-white">
                  {session?.user?.name || "Not available"}
                </p>
              </div>

              <div>
                <p className="uppercase tracking-[0.2em] text-emerald-300">
                  Email
                </p>

                <p className="mt-1 text-lg font-medium text-white">
                  {session?.user?.email || "Not available"}
                </p>
              </div>

              <div>
                <p className="uppercase tracking-[0.2em] text-emerald-300">
                  Member Since
                </p>

                <p className="mt-1 text-lg font-medium text-white">
                  June 2026
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-3xl font-bold text-white">
                {loadingStats ? "..." : stats.totalTasks}
              </p>

              <p className="mt-2 text-sm text-blue-100/70">
                Total Tasks
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-3xl font-bold text-white">
                {loadingStats ? "..." : stats.completedTasks}
              </p>

              <p className="mt-2 text-sm text-blue-100/70">
                Completed
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-3xl font-bold text-white">
                {loadingStats ? "..." : stats.pendingTasks}
              </p>

              <p className="mt-2 text-sm text-blue-100/70">
                Pending
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold text-white">
              Account Actions
            </h2>

            <p className="mt-2 text-sm text-blue-100/70">
              Sign out of your account securely.
            </p>

            <div className="mt-5">
              <SignOut />
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}