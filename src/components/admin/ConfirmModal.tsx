"use client";
import { useEffect } from "react";
import { AlertTriangle, Info } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  detail?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open, title, description, detail,
  confirmLabel = "Confirm", cancelLabel = "Cancel",
  danger = false, loading = false,
  onConfirm, onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0D1526] border border-white/10 rounded-2xl p-7 max-w-sm w-full shadow-2xl"
        style={{ boxShadow: danger ? "0 0 60px rgba(239,68,68,0.12)" : "0 0 60px rgba(0,115,255,0.1)" }}>

        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
          danger ? "bg-red-500/10 border border-red-500/20" : "bg-[#0073FF]/10 border border-[#0073FF]/20"
        }`}>
          {danger
            ? <AlertTriangle className="w-6 h-6 text-red-400" strokeWidth={1.75} />
            : <Info className="w-6 h-6 text-[#4DA6FF]" strokeWidth={1.75} />
          }
        </div>

        {/* Text */}
        <h3 className="text-white font-black text-lg text-center mb-2">{title}</h3>
        <p className="text-gray-400 text-sm text-center leading-relaxed">{description}</p>

        {detail && (
          <div className={`mt-4 px-4 py-3 rounded-xl text-xs text-center font-medium ${
            danger ? "bg-red-500/8 border border-red-500/15 text-red-300" : "bg-[#0073FF]/8 border border-[#0073FF]/15 text-[#4DA6FF]"
          }`}>
            {detail}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white py-3 rounded-xl text-sm font-semibold transition-all">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} disabled={loading}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${
              danger
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-[#0073FF] hover:bg-[#0055CC] text-white"
            }`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Processing…
              </span>
            ) : confirmLabel}
          </button>
        </div>

        <p className="text-gray-700 text-xs text-center mt-3">Press Enter to confirm · Esc to cancel</p>
      </div>
    </div>
  );
}
