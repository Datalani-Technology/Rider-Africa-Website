"use client";
import { Shield } from "lucide-react";

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function AgeVerificationModal({ open, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="w-16 h-16 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Shield className="w-8 h-8 text-amber-500" strokeWidth={1.75} />
        </div>
        <h2 className="text-gray-900 font-black text-xl mb-2">Age Verification</h2>
        <p className="text-gray-500 text-sm mb-1">The Alcohol section contains products for adults only.</p>
        <p className="text-gray-800 font-semibold text-sm mb-6">
          You must be <span className="text-amber-600">18 years or older</span> to view these products.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full bg-[#0073FF] hover:bg-[#0055CC] text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            I am 18 or older — Continue
          </button>
          <button
            onClick={onCancel}
            className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl text-sm transition-colors"
          >
            I am under 18 — Go Back
          </button>
        </div>
        <p className="text-gray-400 text-xs mt-4">
          By confirming, you agree that you are of legal drinking age in Namibia (18+).
        </p>
      </div>
    </div>
  );
}
