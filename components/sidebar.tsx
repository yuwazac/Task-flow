"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SignOut from "./SignOut";

const navigation = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/tasks", label: "Tasks" },
    { href: "/important", label: "Important" },
    { href: "/profile", label: "Profile" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <aside className="relative z-20 border-b border-white/10 bg-slate-950/90 text-white backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:flex-none lg:border-b-0 lg:border-r">
            <div className="p-4 lg:p-6">
                <div className="flex items-center justify-between lg:mb-10">
                    <Link
                        href="/dashboard"
                        className="text-2xl font-black tracking-tight"
                    >
                        Task<span className="text-emerald-300">Flow</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200 lg:hidden">
                            Workspace
                        </span>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
                            aria-label="Toggle menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                <nav
                    className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${
                            isOpen
                                ? "max-h-[600px] opacity-100 mt-4"
                                : "max-h-0 opacity-0"
                        }
                        lg:mt-0 lg:max-h-none lg:opacity-100
                        lg:flex lg:h-[calc(100vh-8rem)] lg:flex-col
                    `}
                >
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-1 lg:flex-col">
                        {navigation.map((item) => {
                            const active = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition-all sm:text-base lg:px-4 lg:py-3 ${
                                        active
                                            ? "bg-gradient-to-r from-blue-500/80 to-emerald-500/80 text-white shadow-lg shadow-emerald-950/20"
                                            : "text-slate-200 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="col-span-2 sm:col-span-3 lg:mt-auto">
                            <SignOut />
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
}