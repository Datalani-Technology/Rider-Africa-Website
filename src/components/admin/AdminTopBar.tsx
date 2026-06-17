"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Search, Menu } from "lucide-react";

const labels: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Customers",
  "/admin/drivers": "Drivers",
  "/admin/driver-applications": "Driver Applications",
  "/admin/requests": "Trips & Requests",
  "/admin/payments": "Payments",
  "/admin/withdrawals": "Withdrawals",
  "/admin/support": "Support Queues",
  "/admin/pawning": "Pawning Submissions",
  "/admin/grocery": "Grocery Items",
  "/admin/subscribers": "Subscribers",
  "/admin/enquiries": "Enquiries",
  "/admin/notifications": "Notifications",
  "/admin/pricing": "Pricing",
  "/admin/settings": "Settings",
  "/admin/blog": "Blog & News",
  "/admin/blog/new": "New Blog Post",
  "/admin/reports": "Reports & Analytics",
};

export default function AdminTopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const pathname = usePathname();
  const title = labels[pathname] ?? "Admin";
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString("en-NA", { hour: "2-digit", minute: "2-digit", hour12: true }));
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  const today = new Date().toLocaleDateString("en-NA", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <header className="h-16 bg-[#070C18]/80 backdrop-blur-sm border-b border-white/5 flex items-center px-4 lg:px-6 shrink-0 gap-3 lg:gap-4">
      {/* Hamburger — mobile only */}
      <button onClick={onMenuToggle} className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white transition-colors shrink-0">
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-white font-bold text-base leading-none">{title}</h1>
        <p className="text-gray-600 text-xs mt-0.5">Rider Africa Operations Platform</p>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-white/4 border border-white/6 rounded-xl px-3 py-2 w-48 xl:w-64">
        <Search className="w-3.5 h-3.5 text-gray-600 shrink-0" />
        <input
          className="bg-transparent text-xs text-gray-400 placeholder-gray-600 focus:outline-none w-full"
          placeholder="Search…"
          readOnly
        />
        <kbd className="text-gray-700 text-[10px] bg-white/5 px-1.5 py-0.5 rounded font-mono hidden xl:block">⌘K</kbd>
      </div>

      {/* Date + time */}
      <div className="hidden sm:flex flex-col items-end text-right">
        <span className="text-white text-xs font-medium">{time}</span>
        <span className="text-gray-600 text-[10px]">{today}</span>
      </div>

      {/* Status dot */}
      <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wide hidden sm:block">Live</span>
      </div>

      {/* Notifications */}
      <button className="relative w-9 h-9 bg-white/4 border border-white/6 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all">
        <Bell className="w-4 h-4" strokeWidth={1.75} />
      </button>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0"
        style={{ background: "linear-gradient(135deg, #0073FF, #00C3FF)" }}>
        A
      </div>
    </header>
  );
}
