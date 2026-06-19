'use client';

import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";



export default function SettingsPage() {

const [dark, setdark] = useState(true);
const [light, setLight] = useState(false);

    const defaultSettings = {
    theme: "light",
    notifications: true,
    sortOrder: "newest",
  };

//   const handleMode = ()=> {
//     setdark(!dark);
//     setLight(!light);

//   }
 

  return (
        <DashboardLayout>
            <header className="mb-6 sm:mb-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    Settings
                </p>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Account Settings
                </h1>
            </header>
            <section className="rounded-3xl border border-white/15 bg-slate-950/25 p-4 text-white shadow-2xl shadow-slate-950/15 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Manage Your Account
                </h2>
                <p className="mt-1 text-sm text-blue-100/70">
                    Update your account information and preferences.
                </p>
                {/* Settings form goes here */}
                <form className="mt-6 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-blue-100">
                            Theme
                        </label>
                        <select
                            defaultValue={defaultSettings.theme}
                            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/25"
                        >
                            <option 
                            value="light"
                            
                            
                            >Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-blue-100">
                            Notifications
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={defaultSettings.notifications}
                            className="h-5 w-5 rounded border-gray-300 bg-white/10 text-emerald-300 focus:ring-emerald-300"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-blue-100">
                            Sort Order
                        </label>
                        <select
                            defaultValue={defaultSettings.sortOrder}
                            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/25"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-emerald-950/20 hover:brightness-110 sm:w-auto"
                    >
                        Save Changes
                    </button>
                </form>

            </section>  
        </DashboardLayout>
    );

}


// export async function generateMetadata() {
//     return {
//         title: "Settings - TaskFlow",
//         description: "Manage your account settings and preferences.",
//     };
// }       