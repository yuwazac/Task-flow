
interface StatsCardProps {
  title: string;
  value: number;
}

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white shadow-xl shadow-slate-950/10 backdrop-blur-md sm:p-6">
      <div className="mb-5 h-1.5 w-12 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" />
      <h3 className="text-sm font-medium text-blue-100 sm:text-base">{title}</h3>
      <p className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{value}</p>
    </div>
  );
}
