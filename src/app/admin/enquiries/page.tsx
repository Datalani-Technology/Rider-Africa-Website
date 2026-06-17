"use client";
import { useEffect, useState } from "react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminModal from "@/components/admin/AdminModal";
import { Trash2, Reply, Mail } from "lucide-react";

type Enquiry = {
  id: string; name: string; email: string; phone?: string;
  subject: string; message: string; status: string; receivedAt: string;
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [viewModal, setViewModal] = useState<{ open: boolean; item: Enquiry | null }>({ open: false, item: null });
  const [replyModal, setReplyModal] = useState<{ open: boolean; item: Enquiry | null }>({ open: false, item: null });
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/enquiries").then(r => r.json()).then(data => { setEnquiries(data); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    await fetch("/api/admin/enquiries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setEnquiries(prev => prev.filter(e => e.id !== id));
  };

  const openReply = (item: Enquiry) => {
    setReplyBody(`Thank you for reaching out, ${item.name}.\n\n`);
    setSent(false);
    setReplyModal({ open: true, item });
  };

  const sendReply = async () => {
    if (!replyModal.item) return;
    setSending(true);
    await fetch("/api/admin/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: replyModal.item.email,
        name: replyModal.item.name,
        subject: replyModal.item.subject,
        body: replyBody,
      }),
    });
    setSending(false);
    setSent(true);
    setTimeout(() => setReplyModal({ open: false, item: null }), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-xl">Enquiries</h2>
          <p className="text-gray-500 text-sm mt-0.5">{enquiries.length} submission{enquiries.length !== 1 ? "s" : ""}</p>
        </div>
        <a href="mailto:admin@riderafrica.com"
          className="flex items-center gap-2 bg-[#0073FF]/15 border border-[#0073FF]/30 text-[#4DA6FF] px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#0073FF]/30 transition-all">
          <Mail className="w-3.5 h-3.5" /> Open Inbox
        </a>
      </div>

      <div className="bg-[#0D1526] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading…</div>
        ) : enquiries.length === 0 ? (
          <AdminEmptyState message="No enquiries yet. Share the website to start receiving them." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">From</th>
                  <th className="px-5 py-3 text-left">Subject</th>
                  <th className="px-5 py-3 text-left">Received</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map(e => (
                  <tr key={e.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-white font-medium">{e.name}</p>
                      <p className="text-gray-500 text-xs">{e.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-300 max-w-xs">
                      <p className="truncate">{e.subject}</p>
                      <p className="text-gray-600 text-xs truncate">{e.message.slice(0, 60)}…</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(e.receivedAt).toLocaleDateString("en-NA", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewModal({ open: true, item: e })}
                          className="text-xs text-[#4DA6FF] hover:underline">View</button>
                        <button onClick={() => openReply(e)}
                          className="flex items-center gap-1 text-xs text-emerald-400 hover:underline">
                          <Reply className="w-3 h-3" /> Reply
                        </button>
                        <button onClick={() => deleteEnquiry(e.id)}
                          className="flex items-center gap-1 text-xs text-red-400 hover:underline">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View modal */}
      <AdminModal open={viewModal.open} title="Enquiry" onClose={() => setViewModal({ open: false, item: null })}>
        {viewModal.item && (
          <div className="space-y-3 text-sm">
            {[["From", viewModal.item.name], ["Email", viewModal.item.email], ["Phone", viewModal.item.phone || "—"], ["Subject", viewModal.item.subject]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <span className="text-gray-500 shrink-0">{k}</span>
                <span className="text-white font-medium text-right">{v}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-white/10">
              <p className="text-gray-500 text-xs mb-2">Message</p>
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{viewModal.item.message}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => { setViewModal({ open: false, item: null }); openReply(viewModal.item!); }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0073FF] hover:bg-[#0055CC] text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                <Reply className="w-4 h-4" /> Reply
              </button>
              <button onClick={() => { deleteEnquiry(viewModal.item!.id); setViewModal({ open: false, item: null }); }}
                className="px-4 py-2.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl text-sm transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Reply modal */}
      <AdminModal open={replyModal.open} title={`Reply to ${replyModal.item?.name}`} onClose={() => setReplyModal({ open: false, item: null })}>
        {replyModal.item && (
          <div className="space-y-4 text-sm">
            <div className="bg-white/3 border border-white/8 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">Replying to</p>
              <p className="text-white font-medium">{replyModal.item.email}</p>
              <p className="text-gray-500 text-xs mt-0.5">Re: {replyModal.item.subject}</p>
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1.5">Your Reply</label>
              <textarea
                value={replyBody}
                onChange={e => setReplyBody(e.target.value)}
                rows={8}
                className="w-full bg-[#131C30] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0073FF] resize-none"
              />
            </div>
            {sent ? (
              <p className="text-emerald-400 text-sm text-center font-medium">Reply sent!</p>
            ) : (
              <button onClick={sendReply} disabled={sending || !replyBody.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#0073FF] hover:bg-[#0055CC] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                <Reply className="w-4 h-4" />
                {sending ? "Sending…" : "Send Reply"}
              </button>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
}
