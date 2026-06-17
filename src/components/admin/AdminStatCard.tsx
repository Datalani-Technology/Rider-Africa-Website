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
      <div className="relative rounded-2xl p-6 overflow-hidden animate-pulse border"
        style={{ background: "var(--adm-card)", borderColor: "var(--adm-border)" }}>
        <div className="h-3 w-24 rounded mb-4" style={{ background: "var(--adm-hover)" }} />
        <div className="h-8 w-16 rounded mb-2" style={{ background: "var(--adm-hover)" }} />
        <div className="h-2 w-20 rounded" style={{ background: "var(--adm-hover)" }} />
      </div>
    );
  }

  const TrendIcon = trend === undefined || trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown;
  const trendColor = trend === undefined || trend === 0 ? "var(--adm-text-3)" : trend > 0 ? "#10B981" : "#EF4444";

  return (
    <div
      className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300 border"
      style={{ background: "var(--adm-card)", borderColor: "var(--adm-border)" }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 0 40px ${color}20`;
        e.currentTarget.style.borderColor = `${color}30`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "var(--adm-border)";
      }}
    >
      {/* Gradient accent top bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}00)` }} />

      {/* Background icon */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.05]">
        <Icon className="w-24 h-24" style={{ color }} />
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.75} />
        </div>

        {trend !== undefined && (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              color: trendColor,
              background: trend === 0 ? "var(--adm-hover)" : trend > 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            }}>
            <TrendIcon className="w-3 h-3" strokeWidth={2} />
            {trend !== 0 ? `${Math.abs(trend)}%` : "Flat"}
          </span>
        )}
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
        style={{ color: "var(--adm-text-3)" }}>{label}</p>
      <p className="text-3xl font-black mb-1" style={{ color: "var(--adm-text)" }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {trendLabel && (
        <p className="text-sm" style={{ color: "var(--adm-text-4)" }}>{trendLabel}</p>
      )}
    </div>
  );
}
