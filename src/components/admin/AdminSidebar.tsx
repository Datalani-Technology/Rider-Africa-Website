"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard, Users, Car, FileText, Route, CreditCard, Wallet,
  HeadphonesIcon, Package2, ShoppingCart, Mail, Bell, Tag, Settings,
  LogOut, ChevronRight, Gem,
} from "lucide-react";

const nav = [
  { section: "Overview", items: [{ href: "/admin", label: "Dashboard", Icon: LayoutDashboard }] },
  {
    section: "People",
    items: [
      { href: "/admin/users", label: "Customers", Icon: Users },
      { href: "/admin/drivers", label: "Drivers", Icon: Car },
      { href: "/admin/driver-applications", label: "Driver Applications", Icon: FileText },
    ],
  },
  {
    section: "Operations",
    items: [
      { href: "/admin/requests", label: "Trips & Requests", Icon: Route },
      { href: "/admin/payments", label: "Payments", Icon: CreditCard },
      { href: "/admin/withdrawals", label: "Withdrawals", Icon: Wallet },
    ],
  },
  {
    section: "Support",
    items: [
      { href: "/admin/support", label: "Support Queues", Icon: HeadphonesIcon },
      { href: "/admin/pawning", label: "Pawning", Icon: Gem },
      { href: "/admin/grocery", label: "Grocery Items", Icon: ShoppingCart },
    ],
  },
  {
    section: "Communications",
    items: [
      { href: "/admin/subscribers", label: "Subscribers", Icon: Mail },
      { href: "/admin/enquiries", label: "Enquiries", Icon: Package2 },
      { href: "/admin/notifications", label: "Notifications", Icon: Bell },
    ],
  },
  {
    section: "Platform",
    items: [
      { href: "/admin/pricing", label: "Pricing", Icon: Tag },
      { href: "/admin/settings", label: "Settings", Icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth).catch(() => {});
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside className="w-60 min-h-screen bg-[#070C18] border-r border-white/5 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0073FF] rounded-lg flex items-center justify-center text-white font-black text-sm">R</div>
          <span className="text-white font-black text-sm">Rider Africa <span className="text-[#0073FF]">Admin</span></span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {nav.map((group) => (
          <div key={group.section}>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest px-2 mb-1">{group.section}</p>
            {group.items.map(({ href, label, Icon }) => {
              const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all mb-0.5 ${
                    isActive
                      ? "bg-[#0073FF]/15 text-[#4DA6FF] font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight className="w-3 h-3" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom — sign out */}
      <div className="px-3 py-4 border-t border-white/5">
        <p className="text-gray-600 text-xs px-3 mb-2 truncate">{process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin"}</p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.75} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
