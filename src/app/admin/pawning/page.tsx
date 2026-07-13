"use client";
import { useEffect, useState } from "react";
import {
  Home, Car, Clock, Eye, CheckCircle2, XCircle, RotateCcw, Gem,
  User, Phone, Mail, MapPin, Hash, Gauge, ExternalLink, FileText, Image,
} from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminModal from "@/components/admin/AdminModal";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
// Use API routes — no direct Firestore on client
type PawnSubmission = {
  id: string; type: "property" | "vehicle"; sellerName: string; sellerPhone: string; sellerEmail: string;
  askingPrice: number; status: "pending" | "reviewed" | "approved" | "rejected";
  createdAt?: { seconds: number } | null; digitalSignature?: string; notes?: string;
  propertyAddress?: string; erfNumber?: string; bondStatus?: string; bondHolderDetail?: string; occupancyStatus?: string;
  vehicleMake?: string; vehicleModel?: string; vehicleYear?: number; vehicleColour?: string;
  vinNumber?: string; engineNumber?: string; odometer?: number; location?: string; paymentTerms?: string;
  documents?: Record<string, string>; photos?: string[];
};
async function getPawnSubmissions(type?: string): Promise<PawnSubmission[]> {
  const url = type ? `/api/admin/pawn?type=${type}` : "/api/admin/pawn";
  const r = await fetch(url); return r.json();
}
async function updatePawnStatus(id: string, status: PawnSubmission["status"]): Promise<void> {
  await fetch("/api/admin/pawn", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
}

type TabType = "property" | "vehicle";
type StatusFilter = "all" | PawnSubmission["status"];
const STATUS_FILTERS: StatusFilter[] = ["all", "pending", "reviewed", "approved", "rejected"];

function Row({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <div className="flex items-center gap-2 text-gray-500 shrink-0">
        <span className="text-gray-600">{icon}</span>{label}
      </div>
      <span className={`text-right break-all ${highlight ? "text-white font-bold" : "text-gray-300"}`}>{value}</span>
    </div>
  );
}

function DocLink({ label, url }: { label: string; url?: string }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2 text-xs text-[#4DA6FF] hover:text-white py-1.5 px-3 bg-[#0073FF]/10 border border-[#0073FF]/20 rounded-lg transition-colors"
    >
      <FileText className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
      <span className="truncate">{label}</span>
      <ExternalLink className="w-3 h-3 shrink-0" strokeWidth={2} />
    </a>
  );
}

export default function AdminPawnPage() {
  const [items, setItems] = useState<PawnSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabType>("property");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewItem, setViewItem] = useState<PawnSubmission | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchItems(type: TabType) {
    setLoading(true);
    try {
      const data = await getPawnSubmissions(type);
      setItems(data);
    } catch (e) {
      console.error("Firestore read error:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems(tab); }, [tab]);

  function switchTab(t: TabType) { setTab(t); setStatusFilter("all"); }

  async function handleStatusUpdate(id: string, status: PawnSubmission["status"]) {
    setUpdating(id);
    try {
      await updatePawnStatus(id, status);
      fetchItems(tab);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  }

  const filtered = statusFilter === "all" ? items : items.filter(i => i.status === statusFilter);
  const stats = {
    pending: items.filter(i => i.status === "pending").length,
    reviewed: items.filter(i => i.status === "reviewed").length,
    approved: items.filter(i => i.status === "approved").length,
    rejected: items.filter(i => i.status === "rejected").length,
  };
  const fmt = (n: number) => `N$ ${n.toLocaleString()}`;
  const fmtDate = (ts: PawnSubmission["createdAt"]) => ts ? new Date((ts as { seconds: number }).seconds * 1000).toLocaleDateString("en-NA") : "—";

  return (
    <div className="p-5 lg:p-7 space-y-6">
      {/* Header + Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white font-black text-xl">Pawn Submissions</h2>
          <p className="text-gray-500 text-sm mt-0.5">Live from Firestore — synced with mobile app</p>
        </div>
        <div className="flex items-center gap-1 bg-[#070C18] rounded-xl p-1 border border-white/5 w-fit">
          {(["property", "vehicle"] as TabType[]).map(t => (
            <button key={t} onClick={() => switchTab(t)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === t ? "bg-[#0073FF] text-white shadow" : "text-gray-400 hover:text-gray-200"}`}>
              {t === "property" ? <Home className="w-4 h-4" strokeWidth={1.75} /> : <Car className="w-4 h-4" strokeWidth={1.75} />}
              {t === "property" ? "Property" : "Vehicle"}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard label="Pending Review" value={loading ? "—" : stats.pending} Icon={Clock} color="#F59E0B" loading={loading} />
        <AdminStatCard label="Reviewed" value={loading ? "—" : stats.reviewed} Icon={Eye} color="#38BDF8" loading={loading} />
        <AdminStatCard label="Approved" value={loading ? "—" : stats.approved} Icon={CheckCircle2} color="#10B981" loading={loading} />
        <AdminStatCard label="Rejected" value={loading ? "—" : stats.rejected} Icon={XCircle} color="#EF4444" loading={loading} />
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${statusFilter === s ? "bg-[#0073FF] border-[#0073FF] text-white" : "bg-white/3 border-white/8 text-gray-400 hover:bg-white/6 hover:text-gray-200"}`}>
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0D1526] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-bold text-sm">{tab === "property" ? "Property" : "Vehicle"} Submissions</h3>
          <span className="text-gray-500 text-xs">{loading ? "Loading…" : `${filtered.length} record${filtered.length !== 1 ? "s" : ""}`}</span>
        </div>
        {loading ? (
          <div className="divide-y divide-white/5">
            {[...Array(3)].map((_, i) => <div key={i} className="px-5 py-4 animate-pulse flex gap-4"><div className="h-4 bg-white/8 rounded flex-1" /><div className="h-4 bg-white/8 rounded w-24" /></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <AdminEmptyState message={`No ${statusFilter === "all" ? "" : statusFilter + " "}${tab} submissions found.`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-semibold">Customer</th>
                  {tab === "property"
                    ? <><th className="text-left px-5 py-3 font-semibold">Property</th><th className="text-left px-5 py-3 font-semibold">Bond</th></>
                    : <><th className="text-left px-5 py-3 font-semibold">Vehicle</th><th className="text-left px-5 py-3 font-semibold">Plate / VIN</th></>
                  }
                  <th className="text-left px-5 py-3 font-semibold">Asking Price</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Submitted</th>
                  <th className="text-right px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white font-semibold">{item.sellerName}</p>
                      <p className="text-gray-500 text-xs">{item.sellerPhone}</p>
                    </td>
                    {tab === "property"
                      ? <>
                          <td className="px-5 py-4 text-gray-300 max-w-[160px] truncate">{item.propertyAddress ?? "—"}</td>
                          <td className="px-5 py-4 text-gray-400 text-xs">{item.bondStatus ?? "—"}</td>
                        </>
                      : <>
                          <td className="px-5 py-4 text-gray-300">{item.vehicleYear} {item.vehicleMake} {item.vehicleModel}</td>
                          <td className="px-5 py-4 text-gray-400 font-mono text-xs">{item.vinNumber ?? "—"}</td>
                        </>
                    }
                    <td className="px-5 py-4 text-white font-bold">{fmt(item.askingPrice)}</td>
                    <td className="px-5 py-4"><AdminBadge status={item.status} /></td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{fmtDate(item.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <button onClick={() => setViewItem(item)} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 text-xs font-semibold transition-colors">View</button>
                        {item.status === "pending" && <>
                          <button disabled={updating === item.id} onClick={() => handleStatusUpdate(item.id, "reviewed")} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition-colors disabled:opacity-50">
                            {updating === item.id ? "…" : "Review"}
                          </button>
                          <button disabled={updating === item.id} onClick={() => handleStatusUpdate(item.id, "rejected")} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors disabled:opacity-50">Reject</button>
                        </>}
                        {item.status === "reviewed" && <>
                          <button disabled={updating === item.id} onClick={() => handleStatusUpdate(item.id, "approved")} className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 text-xs font-semibold transition-colors disabled:opacity-50">
                            {updating === item.id ? "…" : "Approve"}
                          </button>
                          <button disabled={updating === item.id} onClick={() => handleStatusUpdate(item.id, "rejected")} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors disabled:opacity-50">Reject</button>
                        </>}
                        {(item.status === "approved" || item.status === "rejected") && (
                          <button disabled={updating === item.id} onClick={() => handleStatusUpdate(item.id, "pending")} className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 text-xs font-semibold transition-colors disabled:opacity-50" title="Reset to pending">
                            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {viewItem && (
        <AdminModal open title={viewItem.type === "property" ? "Property Submission" : "Vehicle Submission"} onClose={() => setViewItem(null)}>
          <div className="overflow-y-auto max-h-[70vh] space-y-5 pr-1">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Customer Details</p>
              <div className="bg-[#131C30] rounded-xl p-4 space-y-2.5">
                <Row icon={<User className="w-4 h-4" />} label="Name" value={viewItem.sellerName} />
                <Row icon={<Phone className="w-4 h-4" />} label="Phone" value={viewItem.sellerPhone} />
                <Row icon={<Mail className="w-4 h-4" />} label="Email" value={viewItem.sellerEmail} />
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Submission</p>
              <div className="bg-[#131C30] rounded-xl p-4 space-y-2.5">
                <Row icon={<Hash className="w-4 h-4" />} label="Asking Price" value={fmt(viewItem.askingPrice)} highlight />
                <Row icon={<Clock className="w-4 h-4" />} label="Submitted" value={fmtDate(viewItem.createdAt)} />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <AdminBadge status={viewItem.status} />
                </div>
                {viewItem.digitalSignature && <Row icon={<FileText className="w-4 h-4" />} label="Digital Signature" value={viewItem.digitalSignature} />}
              </div>
            </div>

            {viewItem.type === "property" && (
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Property Details</p>
                <div className="bg-[#131C30] rounded-xl p-4 space-y-2.5">
                  <Row icon={<MapPin className="w-4 h-4" />} label="Address" value={viewItem.propertyAddress ?? "—"} />
                  {viewItem.erfNumber && <Row icon={<Hash className="w-4 h-4" />} label="erf Number" value={viewItem.erfNumber} />}
                  <Row icon={<Home className="w-4 h-4" />} label="Bond Status" value={viewItem.bondStatus ?? "—"} />
                  {viewItem.bondHolderDetail && <Row icon={<Hash className="w-4 h-4" />} label="Bond Holder" value={viewItem.bondHolderDetail} />}
                  <Row icon={<Home className="w-4 h-4" />} label="Occupancy" value={viewItem.occupancyStatus ?? "—"} />
                </div>
              </div>
            )}

            {viewItem.type === "vehicle" && (
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Vehicle Details</p>
                <div className="bg-[#131C30] rounded-xl p-4 space-y-2.5">
                  <Row icon={<Car className="w-4 h-4" />} label="Make & Model" value={`${viewItem.vehicleYear ?? ""} ${viewItem.vehicleMake ?? ""} ${viewItem.vehicleModel ?? ""}`.trim()} />
                  <Row icon={<Hash className="w-4 h-4" />} label="Colour" value={viewItem.vehicleColour ?? "—"} />
                  <Row icon={<Hash className="w-4 h-4" />} label="VIN / Chassis" value={viewItem.vinNumber ?? "—"} />
                  <Row icon={<Hash className="w-4 h-4" />} label="Engine Number" value={viewItem.engineNumber ?? "—"} />
                  <Row icon={<Gauge className="w-4 h-4" />} label="Odometer" value={viewItem.odometer ? `${viewItem.odometer.toLocaleString()} km` : "—"} />
                  <Row icon={<MapPin className="w-4 h-4" />} label="Location" value={viewItem.location ?? "—"} />
                  <Row icon={<Hash className="w-4 h-4" />} label="Payment Terms" value={viewItem.paymentTerms ?? "—"} />
                </div>
              </div>
            )}

            {/* Documents */}
            {viewItem.documents && Object.keys(viewItem.documents).length > 0 && (
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Uploaded Documents</p>
                <div className="space-y-2">
                  {Object.entries(viewItem.documents).map(([key, url]) => (
                    <DocLink key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} url={url as string} />
                  ))}
                </div>
              </div>
            )}

            {/* Photos */}
            {viewItem.photos && viewItem.photos.length > 0 && (
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Photos ({viewItem.photos.length})
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {viewItem.photos.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="aspect-square rounded-lg overflow-hidden bg-[#131C30] border border-white/10 hover:border-[#0073FF]/40 transition-colors">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {viewItem.notes && (
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Admin Notes</p>
                <p className="text-gray-300 text-sm bg-[#131C30] rounded-xl p-4">{viewItem.notes}</p>
              </div>
            )}
          </div>
        </AdminModal>
      )}
    </div>
  );
}
