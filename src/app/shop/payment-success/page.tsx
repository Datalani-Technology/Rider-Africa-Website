"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, MapPin, Package, ArrowRight } from "lucide-react";
import { ShopOrder } from "@/lib/firestore";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const orderId = searchParams.get("orderId") ?? "";

  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [order, setOrder] = useState<ShopOrder | null>(null);

  useEffect(() => {
    if (!token || !orderId) { router.push("/shop"); return; }
    (async () => {
      try {
        const res = await fetch(`/api/shop/verify-payment?token=${encodeURIComponent(token)}&orderId=${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
          setStatus("success");
        } else {
          setStatus("failed");
          setTimeout(() => router.push(`/shop/payment-failed?orderId=${orderId}`), 2000);
        }
      } catch {
        setStatus("failed");
        setTimeout(() => router.push(`/shop/payment-failed?orderId=${orderId}`), 2000);
      }
    })();
  }, [token, orderId, router]);

  return (
    <div className="min-h-screen bg-[#F4F8FF] flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-lg">

        {status === "verifying" && (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
            <Loader2 className="w-12 h-12 text-[#0073FF] animate-spin mx-auto mb-5" strokeWidth={1.5} />
            <h2 className="text-gray-900 font-black text-xl mb-2">Verifying Your Payment</h2>
            <p className="text-gray-400 text-sm">Please wait while we confirm your payment with DPO Group…</p>
          </div>
        )}

        {status === "success" && order && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Success header */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={2} />
              </div>
              <h1 className="text-white font-black text-2xl mb-1">Payment Successful</h1>
              <p className="text-green-100 text-sm">Your order is confirmed and being prepared</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Order ref */}
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-xs mb-1 uppercase tracking-widest font-semibold">Order Reference</p>
                <p className="text-gray-900 font-mono font-black text-lg">{order.id}</p>
              </div>

              {/* Items */}
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Items Ordered
                </p>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.productName} × {item.qty}</span>
                      <span className="text-gray-900 font-semibold">N$ {(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-2 flex justify-between font-black text-base">
                    <span className="text-gray-800">Total Paid</span>
                    <span className="text-[#0073FF]">N$ {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0073FF] mt-0.5 shrink-0" strokeWidth={2} />
                <div>
                  <p className="text-gray-700 font-semibold text-sm">Delivery Address</p>
                  <p className="text-gray-500 text-sm">{order.address}</p>
                  <p className="text-[#0073FF] font-bold text-sm mt-1">Est. 30 – 60 minutes</p>
                </div>
              </div>

              <p className="text-gray-400 text-xs text-center">
                A confirmation has been sent to <strong className="text-gray-600">{order.email}</strong>
              </p>

              <Link href="/shop" className="flex items-center justify-center gap-2 w-full bg-[#0073FF] hover:bg-[#0055CC] text-white font-black py-3.5 rounded-xl text-sm transition-colors">
                Continue Shopping <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
            <p className="text-red-500 font-semibold">Payment verification failed. Redirecting…</p>
          </div>
        )}

      </div>
    </div>
  );
}
