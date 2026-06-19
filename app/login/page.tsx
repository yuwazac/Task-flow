"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert(`Login failed: ${result.error}`);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-950 via-blue-900 to-emerald-900 px-4 py-10">
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Task<span className="text-emerald-300">Flow</span>
          </h1>
          <p className="mt-3 text-blue-100/80">Manage tasks with clarity.</p>
        </div>

        <div className="rounded-3xl border border-white/15 bg-slate-950/30 p-6 text-white shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Welcome back
          </h2>
          <p className="mb-8 mt-2 text-center text-blue-100/70">
            Sign in to continue to your workspace
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-blue-100/50 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/25"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-blue-100/50 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/25"
              required
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 py-3 font-bold text-white shadow-lg shadow-emerald-950/20 hover:brightness-110"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-blue-100/70">Do not have an account?</p>
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="mt-1 font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
