"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

const TIMEOUT_MS = 30 * 60 * 1000;
const WARN_MS    = 25 * 60 * 1000;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showWarn, setShowWarn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isLogin = pathname === "/admin/login";

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("admin-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("admin-theme", next);
      return next;
    });
  };

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const doLogout = useCallback(async () => {
    await signOut(auth).catch(() => {});
    await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
  }, [router]);

  const resetTimers = useCallback(() => {
    if (isLogin) return;
    setShowWarn(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warnRef.current)  clearTimeout(warnRef.current);
    warnRef.current  = setTimeout(() => setShowWarn(true), WARN_MS);
    timerRef.current = setTimeout(doLogout, TIMEOUT_MS);
  }, [isLogin, doLogout]);

  useEffect(() => {
    if (isLogin) return;
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, resetTimers, { passive: true }));
    resetTimers();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimers));
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warnRef.current)  clearTimeout(warnRef.current);
    };
  }, [isLogin, resetTimers]);

  if (isLogin) {
    return <div className="min-h-screen bg-[#070C18]">{children}</div>;
  }

  return (
    <div className={`adm-page min-h-screen flex bg-[#0A0F1E] ${theme === "light" ? "admin-light" : ""}`}>
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <AdminTopBar
          onMenuToggle={() => setSidebarOpen(v => !v)}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>

      {/* Session expiry warning */}
      {showWarn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0D1526] border border-amber-500/30 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-amber-400 text-xl">⏱</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Session Expiring</h3>
            <p className="text-gray-400 text-sm mb-6">You will be signed out in 5 minutes due to inactivity.</p>
            <div className="flex gap-3">
              <button onClick={doLogout} className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm transition-colors">Sign Out Now</button>
              <button onClick={resetTimers} className="flex-1 bg-[#0073FF] hover:bg-[#0055CC] text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Stay Signed In</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
