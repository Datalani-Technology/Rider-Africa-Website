"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminStatCard from "@/components/admin/AdminStatCard";
import {
  Users, Car, FileText, Mail, MessageSquare, CreditCard,
  Wallet, ArrowRight, Activity, AlertCircle, CheckCircle2,
  Clock, Route,
} from "lucide-react";

type Stats = {
  totalUsers: number;
  totalDrivers: number;
  tripsToday: number;
  pendingPayments: number;
  withdrawalRequests: number;
  enquiries: number;
  subscribers: number;
  driverApplications: number;
};

type Enquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  receivedAt: string;
};

const quickActions = [
  { href: "/admin/driver-applications", label: "Review Applications", Icon: FileText, color: "#F59E0B", desc: "Pending driver sign-ups" },
  { href: "/admin/payments", label: "Confirm Payments", Icon: CreditCard, color: "#10B981", desc: "Verify proof of payment" },
  { href: "/admin/withdrawals", label: "Approve Withdrawals", Icon: Wallet, color: "#8B5CF6", desc: "Driver payout requests" },
  { href: "/admin/enquiries", label: "View Enquiries", Icon: MessageSquare, color: "#0073FF", desc: "Contact form submissions" },
  { href: "/admin/support", label: "Support Queue", Icon: Activity, color: "#EF4444", desc: "Open support tickets" },
  { href: "/admin/notifications", label: "Send Notification", Icon: Mail, color: "#06B6D4", desc: "Push to all users" },
];

const systemStatus = [
  { label: "Website", status: "operational" },
  { label: "Firebase Auth", status: "operational" },
  { label: "Firestore DB", status: "operational" },
  { label: "Email (SMTP)", status: "pending" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard").then(r => r.json()).then(setStats);
    fetch("/api/admin/enquiries")
      .then(r => r.json())
      .then((data: Enquiry[]) => { setRecentEnquiries(data.slice(0, 5)); setLoadingEnquiries(false); });
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const statCards = stats
    ? [
        { label: "Total Customers", value: stats.totalUsers, Icon: Users, color: "#0073FF", trendLabel: "Registered app users" },
        { label: "Active Drivers", value: stats.totalDrivers, Icon: Car, color: "#10B981", trendLabel: "Verified on platform" },
        { label: "Trips Today", value: stats.tripsToday, Icon: Route, color: "#F59E0B", trendLabel: "Live & completed" },
        { label: "Enquiries", value: stats.enquiries, Icon: MessageSquare, color: "#8B5CF6", trendLabel: "Contact form submissions" },
        { label: "Newsletter", value: stats.subscribers, Icon: Mail, color: "#06B6D4", trendLabel: "Subscribed emails" },
        { label: "Driver Applications", value: stats.driverApplications, Icon: FileText, color: "#EF4444", trendLabel: "Awaiting review" },
        { label: "Pending Payments", value: stats.pendingPayments, Icon: CreditCard, color: "#F97316", trendLabel: "Requires confirmation" },
        { label: "Withdrawals", value: stats.withdrawalRequests, Icon: Wallet, color: "#EC4899", trendLabel: "Pending approval" },
      ]
    : [];

  return (
    <div className="space-y-6 pb-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-gray-500 text-sm">{greeting}, Administrator</p>
          <h2 className="text-white font-black text-2xl tracking-tight">Platform Overview</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/3 border border-white/6 rounded-xl px-4 py-2.5">
          <Clock className="w-3.5 h-3.5" />
          Last refreshed: {new Date().toLocaleTimeString("en-NA", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {/* Stat Cards — 4-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats
          ? statCards.map(c => <AdminStatCard key={c.label} {...c} />)
          : [...Array(8)].map((_, i) => <AdminStatCard key={i} label="" value="" Icon={Users} loading />)
        }
      </div>

      {/* Middle row: Recent Enquiries + Quick Actions */}
      <div className="grid xl:grid-cols-5 gap-4">

        {/* Recent Enquiries — 3/5 */}
        <div className="xl:col-span-3 bg-[#0D1526] border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-[#0073FF] rounded-full" />
              <h3 className="text-white font-bold text-sm">Recent Enquiries</h3>
            </div>
            <Link href="/admin/enquiries"
              className="flex items-center gap-1 text-xs text-[#4DA6FF] hover:text-white transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loadingEnquiries ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-white/3 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentEnquiries.length === 0 ? (
            <div className="p-10 text-center text-gray-600 text-sm">
              No enquiries yet. Share the website to start receiving them.
            </div>
          ) : (
            <div className="divide-y divide-white/3">
              {recentEnquiries.map(e => (
                <div key={e.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/2 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-[#0073FF]/15 border border-[#0073FF]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#4DA6FF] text-xs font-bold">{e.name[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{e.name}</p>
                    <p className="text-gray-500 text-xs truncate">{e.subject}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gray-500 text-xs">
                      {new Date(e.receivedAt).toLocaleDateString("en-NA", { day: "numeric", month: "short" })}
                    </p>
                    <a href={`mailto:${e.email}`} className="text-[10px] text-[#4DA6FF] hover:underline">Reply</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Quick Actions + System Status — 2/5 */}
        <div className="xl:col-span-2 space-y-4">

          {/* Quick Actions */}
          <div className="bg-[#0D1526] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
              <div className="w-1.5 h-4 bg-[#F59E0B] rounded-full" />
              <h3 className="text-white font-bold text-sm">Quick Actions</h3>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {quickActions.map(({ href, label, Icon, color, desc }) => (
                <Link key={href} href={href}
                  className="group flex flex-col gap-2 bg-white/2 hover:bg-white/5 border border-white/4 hover:border-white/8 rounded-xl p-3 transition-all">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold leading-tight">{label}</p>
                    <p className="text-gray-600 text-[10px] mt-0.5 leading-tight">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-[#0D1526] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
              <div className="w-1.5 h-4 bg-[#10B981] rounded-full" />
              <h3 className="text-white font-bold text-sm">System Status</h3>
            </div>
            <div className="p-4 space-y-2.5">
              {systemStatus.map(({ label, status }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">{label}</span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${status === "operational" ? "text-emerald-400" : "text-amber-400"}`}>
                    {status === "operational"
                      ? <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                      : <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
                    }
                    {status === "operational" ? "Operational" : "Not configured"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
