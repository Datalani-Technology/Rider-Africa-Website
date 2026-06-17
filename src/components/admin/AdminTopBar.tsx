"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Search, Menu, Sun, Moon } from "lucide-react";

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

type Props = {
  onMenuToggle?: () => void;
  theme?: "dark" | "light";
  onThemeToggle?: () => void;
};

export default function AdminTopBar({ onMenuToggle, theme = "dark", onThemeToggle }: Props) {
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
  const isLight = theme === "light";

  return (
    <header className="h-16 backdrop-blur-sm border-b flex items-center px-4 lg:px-6 shrink-0 gap-3 lg:gap-4 transition-colors"
      style={{
        background: "var(--adm-topbar)",
        borderColor: "var(--adm-border)",
      }}>

      {/* Hamburger — mobile only */}
      <button onClick={onMenuToggle}
        className="lg:hidden w-9 h-9 flex items-center justify-center transition-colors shrink-0"
        style={{ color: "var(--adm-text-3)" }}>
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="font-bold text-base leading-none" style={{ color: "var(--adm-text)" }}>{title}</h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--adm-text-3)" }}>Rider Africa Operations Platform</p>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 w-48 xl:w-64 border"
        style={{ background: "var(--adm-hover)", borderColor: "var(--adm-border-md)" }}>
        <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--adm-text-3)" }} />
        <input
          className="bg-transparent text-sm placeholder-current focus:outline-none w-full"
          style={{ color: "var(--adm-text-3)" }}
          placeholder="Search…"
          readOnly
        />
        <kbd className="text-[10px] px-1.5 py-0.5 rounded font-mono hidden xl:block"
          style={{ color: "var(--adm-text-4)", background: "var(--adm-hover)" }}>⌘K</kbd>
      </div>

      {/* Date + time */}
      <div className="hidden sm:flex flex-col items-end text-right">
        <span className="text-sm font-medium" style={{ color: "var(--adm-text)" }}>{time}</span>
        <span className="text-xs" style={{ color: "var(--adm-text-3)" }}>{today}</span>
      </div>

      {/* Status dot */}
      <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wide hidden sm:block">Live</span>
      </div>

      {/* Light / Dark toggle */}
      <button
        onClick={onThemeToggle}
        title={isLight ? "Switch to dark mode" : "Switch to light mode"}
        className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all"
        style={{
          background: "var(--adm-hover)",
          borderColor: "var(--adm-border-md)",
          color: isLight ? "#F59E0B" : "#93C5FD",
        }}>
        {isLight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Notifications */}
      <button className="relative w-9 h-9 rounded-xl flex items-center justify-center border transition-all"
        style={{ background: "var(--adm-hover)", borderColor: "var(--adm-border-md)", color: "var(--adm-text-3)" }}>
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
