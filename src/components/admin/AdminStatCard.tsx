import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  Icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  color?: string;
  loading?: boolean;
};

export default function AdminStatCard({
  label, value, Icon, trend, trendLabel, color = "#0073FF", loading,
}: Props) {
  if (loading) {
    return (
      <div className="relative bg-[#0D1526] border border-white/5 rounded-2xl p-6 overflow-hidden animate-pulse">
        <div className="h-3 w-24 bg-white/5 rounded mb-4" />
        <div className="h-8 w-16 bg-white/5 rounded mb-2" />
        <div className="h-2 w-20 bg-white/5 rounded" />
      </div>
    );
  }

  const TrendIcon = trend === undefined || trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown;
  const trendColor = trend === undefined || trend === 0 ? "text-gray-500" : trend > 0 ? "text-emerald-400" : "text-red-400";

  return (
    <div className="group relative bg-[#0D1526] border border-white/5 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-xl"
      style={{ boxShadow: "0 0 0 0 transparent" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 40px ${color}18`)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 0 0 transparent")}
    >
      {/* Gradient accent top bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}00)` }} />

      {/* Background icon */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.04]">
        <Icon className="w-24 h-24" style={{ color }} />
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.75} />
        </div>

        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trendColor}`}
            style={{ background: trend === 0 ? "rgba(255,255,255,0.04)" : trend > 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)" }}>
            <TrendIcon className="w-3 h-3" strokeWidth={2} />
            {trend !== 0 ? `${Math.abs(trend)}%` : "Flat"}
          </span>
        )}
      </div>

      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-black text-white mb-1"
        style={{ textShadow: `0 0 40px ${color}40` }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {trendLabel && <p className="text-gray-600 text-xs">{trendLabel}</p>}
    </div>
  );
}
