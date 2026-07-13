import Link from "next/link";
import { XCircle, RefreshCw, HeadphonesIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payment Failed | Rider Africa Shop" };

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FF] flex items-center justify-center p-4 pt-24">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-sm">
        <div className="bg-gradient-to-br from-red-500 to-rose-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-9 h-9 text-white" strokeWidth={1.75} />
          </div>
          <h1 className="text-white font-black text-xl mb-1">Payment Not Completed</h1>
          <p className="text-red-100 text-sm">Your order was not charged</p>
        </div>

        <div className="p-6 space-y-4 text-center">
          <p className="text-gray-600 text-sm leading-relaxed">
            Your payment was not completed successfully. No funds have been deducted from your account.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/shop" className="flex items-center justify-center gap-2 w-full bg-[#0073FF] hover:bg-[#0055CC] text-white font-bold py-3 rounded-xl text-sm transition-colors">
              <RefreshCw className="w-4 h-4" strokeWidth={2} />
              Try Again
            </Link>
            <Link href="/contact" className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl text-sm transition-colors font-semibold">
              <HeadphonesIcon className="w-4 h-4" strokeWidth={1.75} />
              Contact Support
            </Link>
          </div>
          <p className="text-gray-400 text-xs">
            Need help? Call{" "}
            <a href="tel:+264814698594" className="text-[#0073FF] hover:underline">+264 81 469 8594</a>{" "}
            or{" "}
            <a href="tel:+264817327089" className="text-[#0073FF] hover:underline">+264 81 732 7089</a>
          </p>
        </div>
      </div>
    </div>
  );
}
