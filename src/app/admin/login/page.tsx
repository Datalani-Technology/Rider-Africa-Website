"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { Eye, EyeOff, Shield, Lock, Activity } from "lucide-react";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const credential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const idToken = await credential.user.getIdToken();
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (res.ok) {
        router.push("/admin");
      } else {
        setError("Access denied. Account is not authorised.");
      }
    } catch {
      setError("Invalid email or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#040810] flex">

      {/* ─── Left panel — branding ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">

        {/* Background layers */}
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(0,115,255,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 80%, rgba(0,195,255,0.08) 0%, transparent 60%), #040810" }}
        />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(0,115,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,115,255,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }}
        />
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ background: "radial-gradient(circle, #0073FF 0%, transparent 70%)" }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <Image src="/logo.png" alt="Rider Africa" width={40} height={40} className="rounded-xl" />
          <div>
            <p className="text-white font-black text-lg leading-none">Rider Africa</p>
            <p className="text-[#0073FF] text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5">Admin Console</p>
          </div>
        </div>

        {/* Centre content */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-[#0073FF]/10 border border-[#0073FF]/20 text-[#4DA6FF] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Activity className="w-3 h-3" />
            Platform Operations Centre
          </div>
          <h1 className="text-white font-black text-4xl xl:text-5xl leading-tight mb-4">
            Manage your<br />
            <span style={{ background: "linear-gradient(90deg, #0073FF, #00C3FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              entire platform
            </span><br />
            from one place.
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-sm">
            Real-time oversight of customers, drivers, trips, payments, and communications — all in one secure console.
          </p>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { label: "Customers", value: "Live" },
              { label: "Drivers", value: "Live" },
              { label: "Enquiries", value: "Live" },
            ].map(s => (
              <div key={s.label} className="bg-white/3 border border-white/6 rounded-2xl p-4">
                <p className="text-[#4DA6FF] font-black text-lg">{s.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative flex items-center gap-6 text-xs text-gray-700">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#0073FF]" />
            <span>Firebase Auth</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#0073FF]" />
            <span>End-to-end encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>

      {/* ─── Right panel — form ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Subtle right-side background */}
        <div className="absolute inset-0 bg-[#060B14]" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/8 to-transparent" />

        <div className="relative w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <Image src="/logo.png" alt="Rider Africa" width={36} height={36} className="rounded-xl" />
            <p className="text-white font-black text-lg">Rider <span className="text-[#0073FF]">Africa</span></p>
          </div>

          {/* Form card */}
          <div className="bg-[#0D1526]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-8 shadow-2xl"
            style={{ boxShadow: "0 0 80px rgba(0,115,255,0.08), 0 32px 64px rgba(0,0,0,0.5)" }}>

            <div className="mb-8">
              <h2 className="text-white font-black text-2xl mb-1">Welcome back</h2>
              <p className="text-gray-500 text-sm">Sign in to your admin account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide">Email address</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-[#131C30] border border-white/8 hover:border-white/15 focus:border-[#0073FF] rounded-2xl px-4 py-3.5 text-white placeholder-gray-700 focus:outline-none transition-colors text-sm"
                  placeholder="admin@riderafrica.com"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"} required
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full bg-[#131C30] border border-white/8 hover:border-white/15 focus:border-[#0073FF] rounded-2xl px-4 py-3.5 pr-12 text-white placeholder-gray-700 focus:outline-none transition-colors text-sm"
                    placeholder="••••••••••••"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-60 mt-2"
                style={{ background: loading ? "#0055CC" : "linear-gradient(135deg, #0073FF 0%, #0055CC 100%)" }}
              >
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Signing in…
                    </span>
                  ) : "Sign In"}
                </span>
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-700 text-xs">Protected by Firebase Authentication</p>
            <p className="text-gray-800 text-xs">
              Rider Africa Admin · Internal Use Only ·{" "}
              <a href="/" className="text-gray-600 hover:text-gray-400 transition-colors">View Website</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
