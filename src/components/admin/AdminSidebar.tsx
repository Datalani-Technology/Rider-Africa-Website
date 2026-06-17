"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard, Users, Car, FileText, Route, CreditCard, Wallet,
  HeadphonesIcon, Package2, ShoppingCart, Mail, Bell, Tag, Settings,
  LogOut, ChevronRight, ChevronDown, Gem, BookOpen, BarChart3, X,
} from "lucide-react";
import ConfirmModal from "./ConfirmModal";

const nav = [
  {
    section: "Overview",
    collapsible: false,
    items: [{ href: "/admin", label: "Dashboard", Icon: LayoutDashboard }],
  },
  {
    section: "People",
    collapsible: true,
    items: [
      { href: "/admin/users", label: "Customers", Icon: Users },
      { href: "/admin/drivers", label: "Drivers", Icon: Car },
      { href: "/admin/driver-applications", label: "Driver Applications", Icon: FileText },
    ],
  },
  {
    section: "Operations",
    collapsible: true,
    items: [
      { href: "/admin/requests", label: "Trips & Requests", Icon: Route },
      { href: "/admin/payments", label: "Payments", Icon: CreditCard },
      { href: "/admin/withdrawals", label: "Withdrawals", Icon: Wallet },
    ],
  },
  {
    section: "Support",
    collapsible: true,
    items: [
      { href: "/admin/support", label: "Support Queues", Icon: HeadphonesIcon },
      { href: "/admin/pawning", label: "Pawning", Icon: Gem },
      { href: "/admin/grocery", label: "Grocery Items", Icon: ShoppingCart },
    ],
  },
  {
    section: "Communications",
    collapsible: true,
    items: [
      { href: "/admin/subscribers", label: "Subscribers", Icon: Mail },
      { href: "/admin/enquiries", label: "Enquiries", Icon: Package2 },
      { href: "/admin/notifications", label: "Notifications", Icon: Bell },
      { href: "/admin/blog", label: "Blog & News", Icon: BookOpen },
    ],
  },
  {
    section: "Analytics",
    collapsible: true,
    items: [
      { href: "/admin/reports", label: "Reports", Icon: BarChart3 },
    ],
  },
  {
    section: "Platform",
    collapsible: true,
    items: [
      { href: "/admin/pricing", label: "Pricing", Icon: Tag },
      { href: "/admin/settings", label: "Settings", Icon: Settings },
    ],
  },
];

type Props = { mobileOpen?: boolean; onClose?: () => void };

export default function AdminSidebar({ mobileOpen, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Track which collapsible sections are open
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // A section is open unless explicitly collapsed
  const isOpen = (section: string) => !collapsed[section];

  const doSignOut = async () => {
    setSigningOut(true);
    await signOut(auth).catch(() => {});
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-64 lg:w-60 min-h-screen bg-[#070C18] border-r border-white/5 flex flex-col shrink-0
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5 shrink-0">
          <div className="flex items-center justify-between w-full">
            <Link href="/admin" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Rider Africa" width={32} height={32} className="rounded-lg shrink-0" />
              <div className="min-w-0">
                <p className="text-white font-black text-sm leading-none">Rider Africa</p>
                <p className="text-[#0073FF] text-[10px] font-semibold uppercase tracking-widest mt-0.5">Admin Console</p>
              </div>
            </Link>
            <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {nav.map((group) => {
            const open = !group.collapsible || isOpen(group.section);
            const hasActiveChild = group.items.some(({ href }) =>
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
            );

            return (
              <div key={group.section}>
                {/* Section header */}
                {group.collapsible ? (
                  <button
                    onClick={() => toggleSection(group.section)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 mb-0.5 rounded-lg transition-colors group ${
                      hasActiveChild && !open
                        ? "text-[#4DA6FF]"
                        : "text-gray-600 hover:text-gray-400"
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em]">
                      {group.section}
                    </span>
                    {open
                      ? <ChevronDown className="w-3 h-3 opacity-60" />
                      : <ChevronRight className="w-3 h-3 opacity-60" />
                    }
                  </button>
                ) : (
                  <p className="text-gray-700 text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 mb-0.5">
                    {group.section}
                  </p>
                )}

                {/* Items — animate height */}
                <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="pb-2">
                    {group.items.map(({ href, label, Icon }) => {
                      const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all mb-0.5 ${
                            isActive
                              ? "text-white font-semibold"
                              : "text-gray-500 hover:text-gray-200 hover:bg-white/4"
                          }`}
                          style={isActive ? {
                            background: "linear-gradient(90deg, rgba(0,115,255,0.18), rgba(0,115,255,0.05))",
                            borderLeft: "2px solid #0073FF",
                            paddingLeft: "10px",
                          } : {}}
                        >
                          <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                          <span className="flex-1 truncate">{label}</span>
                          {isActive && <ChevronRight className="w-3 h-3 text-[#0073FF]" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Collapsed indicator — shows active item name when section is closed */}
                {!open && hasActiveChild && (
                  <div className="mx-3 mb-1 px-2 py-1 rounded-lg bg-[#0073FF]/10 border border-[#0073FF]/15">
                    <p className="text-[#4DA6FF] text-[10px] font-semibold truncate">
                      {group.items.find(({ href }) =>
                        href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
                      )?.label}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom — sign out */}
        <div className="px-3 py-4 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: "linear-gradient(135deg, #0073FF, #00C3FF)" }}>
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">Administrator</p>
              <p className="text-gray-600 text-[10px] truncate">admin@riderafrica.com</p>
            </div>
          </div>
          <button
            onClick={() => setConfirmSignOut(true)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/8 transition-all"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.75} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Sign-out confirmation */}
      <ConfirmModal
        open={confirmSignOut}
        title="Sign Out"
        description="Are you sure you want to sign out of the Rider Africa Admin Console?"
        confirmLabel="Sign Out"
        cancelLabel="Stay Signed In"
        danger
        loading={signingOut}
        onConfirm={doSignOut}
        onCancel={() => setConfirmSignOut(false)}
      />
    </>
  );
}
