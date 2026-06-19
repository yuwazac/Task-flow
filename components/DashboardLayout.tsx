import Sidebar from "./sidebar";


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-950 via-blue-900 to-emerald-900 lg:flex">
            <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
            <Sidebar />
            <div className="relative min-w-0 flex-1">
                <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
