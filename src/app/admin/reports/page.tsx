"use client";
import { useEffect, useState, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Download, FileText, Users, Mail, Car, FileDown } from "lucide-react";

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

async function loadImageAsBase64(src: string): Promise<string> {
  const res = await fetch(src);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function AdminReportsPage() {
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

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

  const exportPDF = async () => {
    if (!data) return;
    setPdfLoading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const periodLabel = PERIODS.find(p => p.key === period)?.label ?? period;
      const dateStr = new Date().toLocaleDateString("en-NA", { day: "numeric", month: "long", year: "numeric" });

      // ── Header band ──────────────────────────────────────────────────
      doc.setFillColor(0, 62, 166);
      doc.rect(0, 0, W, 36, "F");
      doc.setFillColor(0, 115, 255);
      doc.rect(0, 36, W, 3, "F");

      // Logo
      try {
        const logoB64 = await loadImageAsBase64("/logo.png");
        doc.addImage(logoB64, "PNG", 12, 8, 18, 18);
      } catch { /* logo optional */ }

      // Company name in header
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Rider Africa Logistics (Pty) Ltd", 34, 17);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(147, 197, 253);
      doc.text("Reg. No. 20250760  ·  695 Vrede Rede, Mondesa, Swakopmund, Namibia  ·  riderafrica.com", 34, 24);

      // Report title (right-aligned)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("INVESTOR PERFORMANCE REPORT", W - 12, 17, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(147, 197, 253);
      doc.text(`Period: ${periodLabel}`, W - 12, 23, { align: "right" });
      doc.text(`Generated: ${dateStr}`, W - 12, 28, { align: "right" });

      // ── Date range bar ───────────────────────────────────────────────
      doc.setFillColor(13, 21, 38);
      doc.rect(0, 39, W, 10, "F");
      doc.setTextColor(107, 123, 179);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Reporting period: ${new Date(data.from).toLocaleDateString()} – ${new Date(data.to).toLocaleDateString()}`,
        12, 46
      );

      // ── Key Metrics ──────────────────────────────────────────────────
      let y = 60;
      doc.setTextColor(10, 15, 46);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("KEY PLATFORM METRICS", 12, y);
      doc.setDrawColor(0, 115, 255);
      doc.setLineWidth(0.8);
      doc.line(12, y + 2, 80, y + 2);
      y += 8;

      const metrics = [
        { label: "Enquiries Received", value: data.metrics.enquiries.value, change: data.metrics.enquiries.change },
        { label: "Newsletter Subscribers", value: data.metrics.subscribers.value, change: data.metrics.subscribers.change },
        { label: "Driver Applications", value: data.metrics.driverApps.value, change: data.metrics.driverApps.change },
      ];

      autoTable(doc, {
        startY: y,
        head: [["Metric", "Value", "Change vs Prior Period"]],
        body: metrics.map(m => [
          m.label,
          m.value.toLocaleString(),
          `${m.change >= 0 ? "+" : ""}${m.change}%`,
        ]),
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: {
          fillColor: [0, 115, 255],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8.5,
        },
        alternateRowStyles: { fillColor: [245, 248, 255] },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 30, halign: "right" },
          2: { cellWidth: 50, halign: "right" },
        },
        margin: { left: 12, right: 12 },
      });

      // ── Enquiries chart data ─────────────────────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = (doc as any).lastAutoTable.finalY + 12;

      if (data.charts.enquiries.length > 0) {
        doc.setTextColor(10, 15, 46);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("ENQUIRIES OVER TIME", 12, y);
        doc.setDrawColor(0, 115, 255);
        doc.line(12, y + 2, 70, y + 2);
        y += 8;

        autoTable(doc, {
          startY: y,
          head: [["Period", "Enquiries"]],
          body: data.charts.enquiries.map(p => [p.label, p.count]),
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [0, 115, 255], textColor: [255, 255, 255], fontStyle: "bold" },
          alternateRowStyles: { fillColor: [245, 248, 255] },
          columnStyles: { 1: { halign: "right" } },
          margin: { left: 12, right: 12 },
          tableWidth: 90,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        y = (doc as any).lastAutoTable.finalY + 12;
      }

      // ── Company information ──────────────────────────────────────────
      if (y > 230) { doc.addPage(); y = 20; }

      doc.setTextColor(10, 15, 46);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("COMPANY INFORMATION", 12, y);
      doc.setDrawColor(0, 115, 255);
      doc.line(12, y + 2, 80, y + 2);
      y += 8;

      autoTable(doc, {
        startY: y,
        body: [
          ["Legal Name", "Rider Africa Logistics (Proprietary) Limited"],
          ["Registration No.", "20250760"],
          ["Regulator", "BIPA – Companies Act 2004 (Act No. 28 of 2004)"],
          ["Incorporated", "30 May 2025, Windhoek, Namibia"],
          ["Address", "695 Vrede Rede, Mondesa, Swakopmund, Namibia"],
          ["Website", "https://riderafrica.com"],
          ["Email", "admin@riderafrica.com"],
          ["Phone", "+264 81 469 8594"],
        ],
        styles: { fontSize: 9, cellPadding: 3.5 },
        columnStyles: {
          0: { fontStyle: "bold", textColor: [107, 123, 179], cellWidth: 45 },
          1: { textColor: [30, 30, 30] },
        },
        alternateRowStyles: { fillColor: [245, 248, 255] },
        margin: { left: 12, right: 12 },
      });

      // ── Footer ───────────────────────────────────────────────────────
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pH = doc.internal.pageSize.getHeight();
        doc.setFillColor(10, 15, 46);
        doc.rect(0, pH - 14, W, 14, "F");
        doc.setFontSize(7);
        doc.setTextColor(107, 123, 179);
        doc.text("Rider Africa Logistics (Pty) Ltd  ·  Reg. 20250760  ·  Confidential — Authorised Investors Only", 12, pH - 5.5);
        doc.text(`Page ${i} of ${pageCount}`, W - 12, pH - 5.5, { align: "right" });
      }

      doc.save(`rider-africa-investor-report-${period}-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
    setPdfLoading(false);
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
        <div className="flex flex-wrap gap-2">
          <button onClick={exportCSV} disabled={!data}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/8 text-gray-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={exportPDF} disabled={!data || pdfLoading}
            className="flex items-center gap-2 bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-60">
            {pdfLoading ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating…
              </>
            ) : (
              <><FileDown className="w-3.5 h-3.5" /> PDF Report</>
            )}
          </button>
          <button onClick={exportInvestorReport} disabled={!data}
            className="flex items-center gap-2 bg-[#0073FF]/15 hover:bg-[#0073FF]/30 border border-[#0073FF]/30 text-[#4DA6FF] px-3 py-2 rounded-xl text-xs font-semibold transition-all">
            <FileText className="w-3.5 h-3.5" /> Investor Report (.txt)
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
