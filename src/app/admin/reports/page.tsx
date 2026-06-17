"use client";
import { useEffect, useState, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Download, FileText, Users, Mail, Car } from "lucide-react";

const PERIODS = [
  { key: "today",     label: "Today" },
  { key: "week",      label: "This Week" },
  { key: "month",     label: "This Month" },
  { key: "quarter",   label: "This Quarter" },
  { key: "year",      label: "This Year" },
  { key: "last_year", label: "Last Year" },
];

type Metric = { value: number; change: number };
type ChartPoint = { label: string; count: number };
type ReportData = {
  period: string; from: string; to: string;
  metrics: { enquiries: Metric; subscribers: Metric; driverApps: Metric };
  charts: { enquiries: ChartPoint[]; subscribers: ChartPoint[] };
};

function TrendBadge({ change }: { change: number }) {
  if (change === 0) return <span className="flex items-center gap-1 text-gray-500 text-xs"><Minus className="w-3 h-3" /> Flat</span>;
  if (change > 0) return <span className="flex items-center gap-1 text-emerald-400 text-xs"><TrendingUp className="w-3 h-3" /> +{change}%</span>;
  return <span className="flex items-center gap-1 text-red-400 text-xs"><TrendingDown className="w-3 h-3" /> {change}%</span>;
}

function MetricCard({ label, metric, Icon, color }: { label: string; metric: Metric; Icon: typeof Users; color: string }) {
  return (
    <div className="bg-[#0D1526] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-4 h-4" style={{ color }} strokeWidth={1.75} />
        </div>
        <TrendBadge change={metric.change} />
      </div>
      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">{label}</p>
      <p className="text-white text-3xl font-black">{metric.value.toLocaleString()}</p>
      <p className="text-gray-600 text-xs mt-1">vs. previous period</p>
    </div>
  );
}

export default function AdminReportsPage() {
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/reports?period=${period}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, [period]);

  useEffect(() => { load(); }, [load]);

  const exportCSV = () => {
    if (!data) return;
    const rows = [
      ["Metric", "Value", "Change vs Previous"],
      ["Enquiries", data.metrics.enquiries.value, `${data.metrics.enquiries.change}%`],
      ["Newsletter Subscribers", data.metrics.subscribers.value, `${data.metrics.subscribers.change}%`],
      ["Driver Applications", data.metrics.driverApps.value, `${data.metrics.driverApps.change}%`],
      [],
      ["Period", PERIODS.find(p => p.key === period)?.label ?? period],
      ["From", new Date(data.from).toLocaleDateString()],
      ["To", new Date(data.to).toLocaleDateString()],
      [],
      ["Generated", new Date().toLocaleString()],
      ["Company", "Rider Africa Logistics (Pty) Ltd"],
      ["Reg. No.", "20250760"],
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `rider-africa-report-${period}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const exportInvestorReport = () => {
    if (!data) return;
    const content = `RIDER AFRICA LOGISTICS (PROPRIETARY) LIMITED
Registration No. 20250760 | Incorporated in Namibia

INVESTOR PERFORMANCE REPORT
Period: ${PERIODS.find(p => p.key === period)?.label ?? period}
Date Range: ${new Date(data.from).toLocaleDateString()} – ${new Date(data.to).toLocaleDateString()}
Generated: ${new Date().toLocaleString()}

═══════════════════════════════════════════════════

KEY PLATFORM METRICS
────────────────────
Enquiries Received:      ${data.metrics.enquiries.value}  (${data.metrics.enquiries.change >= 0 ? "+" : ""}${data.metrics.enquiries.change}% vs prior period)
Newsletter Subscribers:  ${data.metrics.subscribers.value}  (${data.metrics.subscribers.change >= 0 ? "+" : ""}${data.metrics.subscribers.change}% vs prior period)
Driver Applications:     ${data.metrics.driverApps.value}  (${data.metrics.driverApps.change >= 0 ? "+" : ""}${data.metrics.driverApps.change}% vs prior period)

═══════════════════════════════════════════════════

COMPANY INFORMATION
────────────────────
Legal Name:   Rider Africa Logistics (Proprietary) Limited
Reg. Number:  20250760 (BIPA – Companies Act 2004)
Jurisdiction: Republic of Namibia
Address:      695 Vrede Rede, Mondesa, Swakopmund, Namibia
Website:      https://riderafrica.com
Contact:      admin@riderafrica.com
Phone:        +264 81 469 8594

═══════════════════════════════════════════════════

Rider Africa is Namibia's on-demand delivery, transport,
and logistics platform operating across Windhoek, Swakopmund,
Walvis Bay, and growing across Southern Africa.

This report is confidential and intended for authorised investors only.
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `rider-africa-investor-report-${period}-${new Date().toISOString().split("T")[0]}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white font-black text-2xl">Reports & Analytics</h2>
          <p className="text-gray-500 text-sm mt-0.5">Rider Africa Logistics (Pty) Ltd · Reg. 20250760</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} disabled={!data}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/8 text-gray-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={exportInvestorReport} disabled={!data}
            className="flex items-center gap-2 bg-[#0073FF]/15 hover:bg-[#0073FF]/30 border border-[#0073FF]/30 text-[#4DA6FF] px-3 py-2 rounded-xl text-xs font-semibold transition-all">
            <FileText className="w-3.5 h-3.5" /> Investor Report
          </button>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map(p => (
          <button key={p.key} onClick={() => setPeriod(p.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              period === p.key
                ? "bg-[#0073FF] text-white"
                : "bg-white/4 border border-white/6 text-gray-400 hover:text-white hover:bg-white/8"
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-[#0D1526] border border-white/5 rounded-2xl h-32 animate-pulse" />)}
        </div>
      ) : data ? (
        <>
          {/* Metric cards */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <MetricCard label="Enquiries" metric={data.metrics.enquiries} Icon={Mail} color="#0073FF" />
            <MetricCard label="Newsletter Subscribers" metric={data.metrics.subscribers} Icon={Users} color="#10B981" />
            <MetricCard label="Driver Applications" metric={data.metrics.driverApps} Icon={Car} color="#F59E0B" />
          </div>

          {/* Charts */}
          <div className="grid xl:grid-cols-2 gap-4">
            {/* Enquiries over time */}
            <div className="bg-[#0D1526] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-4 bg-[#0073FF] rounded-full" />
                <h3 className="text-white font-bold text-sm">Enquiries Over Time</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.charts.enquiries} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0073FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0073FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#0D1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", fontSize: 12 }} />
                  <Area type="monotone" dataKey="count" name="Enquiries" stroke="#0073FF" strokeWidth={2} fill="url(#eqGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Subscribers over time */}
            <div className="bg-[#0D1526] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-4 bg-[#10B981] rounded-full" />
                <h3 className="text-white font-bold text-sm">Newsletter Growth</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.charts.subscribers} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#0D1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", fontSize: 12 }} />
                  <Bar dataKey="count" name="New Subscribers" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Investor summary */}
          <div className="bg-[#0D1526] border border-[#0073FF]/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#F59E0B] rounded-full" />
                <h3 className="text-white font-bold text-sm">Investor Summary</h3>
              </div>
              <span className="text-gray-600 text-xs">Auto-generated · {new Date().toLocaleDateString()}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {[
                { label: "Company", value: "Rider Africa Logistics (Pty) Ltd" },
                { label: "Reg. Number", value: "20250760" },
                { label: "Jurisdiction", value: "Republic of Namibia" },
                { label: "Address", value: "695 Vrede Rede, Mondesa, Swakopmund" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-gray-600 text-xs mb-0.5">{label}</p>
                  <p className="text-white font-medium text-xs">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 grid sm:grid-cols-3 gap-4">
              {[
                { label: "Enquiries This Period", value: data.metrics.enquiries.value },
                { label: "Active Subscribers", value: data.metrics.subscribers.value },
                { label: "Driver Applications", value: data.metrics.driverApps.value },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/3 border border-white/6 rounded-xl p-3">
                  <p className="text-gray-500 text-xs">{label}</p>
                  <p className="text-white font-black text-xl mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
