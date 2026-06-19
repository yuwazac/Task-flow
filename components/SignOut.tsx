"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function SignOut() {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);

    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-200 hover:bg-red-500/20 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base lg:px-4 lg:py-3"
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
