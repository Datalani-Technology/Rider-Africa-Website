"use client";
import { useEffect, useState, useRef } from "react";
import {
  ShoppingBag, CheckCircle2, XCircle, GlassWater, Plus, Pencil, Trash2,
  Package, Leaf, Pill, Fuel, ToggleLeft, ToggleRight, AlertTriangle,
  BarChart3, TrendingUp, TrendingDown, DollarSign, Archive, Truck,
  Upload, X, RefreshCw, Calculator, Clock, AlertCircle, ChevronDown,
} from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminModal from "@/components/admin/AdminModal";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import ConfirmModal from "@/components/admin/ConfirmModal";

type ShopCategory = "grocery" | "alcohol" | "pharmacy" | "fuel" | string;
type Product = {
  id: string; name: string; category: ShopCategory; price: number;
  costPrice?: number; salePrice?: number; salePriceFrom?: string; salePriceTo?: string;
  unit: string; description: string; inStock: boolean;
  stockQty?: number; lowStockAlert?: number;
  requiresAgeVerification: boolean; vendorName: string;
  imageUrl?: string; activeFrom?: string; activeTo?: string; createdAt?: string;
};
type RestockEntry = {
  id: string; productId: string; productName: string; date: string;
  qtyAdded: number; costPerUnit: number; supplier: string; transporter: string;
  transportCost: number; notes?: string;
};
type AnalyticRow = Product & {
  revenue: number; unitsSold: number; costOfGoods: number;
  transport: number; grossProfit: number; margin: number;
};
type AnalyticsData = {
  rows: AnalyticRow[];
  totals: { revenue: number; cost: number; transport: number; profit: number; unitsSold: number };
};

const UNIT_OPTIONS = ["per item", "per kg", "per litre", "per 2L", "per dozen", "per box", "per 6-pack", "per 4-pack", "per 750ml", "per 30 tabs"];
const CAT_OPTIONS = ["grocery", "alcohol", "pharmacy", "fuel"];

const emptyForm: Omit<Product, "id" | "createdAt"> = {
  name: "", category: "grocery", price: 0, costPrice: 0, salePrice: undefined,
  salePriceFrom: "", salePriceTo: "", unit: "per item", description: "",
  vendorName: "", inStock: true, stockQty: 0, lowStockAlert: 5,
  requiresAgeVerification: false, imageUrl: "", activeFrom: "", activeTo: "",
};

const emptyRestock = {
  productId: "", qtyAdded: 0, costPerUnit: 0, supplier: "", transporter: "",
  transportCost: 0, notes: "", date: new Date().toISOString().split("T")[0],
};

const inp = "w-full bg-[#131C30] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#0073FF]/60 focus:ring-1 focus:ring-[#0073FF]/20 transition-colors";
const lbl = "block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5";
const sec = "bg-[#131C30] rounded-xl border border-white/8 p-4 space-y-3";

function fmt(n: number) { return `N$ ${n.toLocaleString("en-NA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }

// ── Image upload component ────────────────────────────────────────────────────
function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    setError("");
    setUploading(true);
    const preview = URL.createObjectURL(file);
    onChange(preview); // instant preview
    try {
      const { uploadShopProductImage } = await import("@/lib/storage");
      const url = await uploadShopProductImage(`prod-${Date.now()}`, file);
      onChange(url);
    } catch {
      setError("Upload failed — Firebase Storage not yet configured. Image preview shown locally.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0D1526]" style={{ height: "160px" }}>
          <img src={value} alt="Product" className="w-full h-full object-cover"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          <button type="button" onClick={() => onChange("")}
            style={{ position: "absolute", top: "8px", right: "8px" }}
            className="w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors">
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
          <button type="button" onClick={() => inputRef.current?.click()}
            style={{ position: "absolute", bottom: "8px", right: "8px" }}
            className="flex items-center gap-1.5 bg-black/60 hover:bg-[#0073FF] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
            <Upload className="w-3 h-3" /> Change
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-white text-xs font-bold flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Uploading…
              </div>
            </div>
          )}
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-white/15 hover:border-[#0073FF]/50 rounded-xl p-8 flex flex-col items-center gap-3 text-gray-500 hover:text-[#4DA6FF] transition-colors">
          <Upload className="w-8 h-8" strokeWidth={1.5} />
          <div className="text-center">
            <p className="text-sm font-semibold">Click to upload product image</p>
            <p className="text-xs mt-1">JPG, PNG, WebP — max 10 MB</p>
          </div>
        </button>
      )}
      {error && <p className="text-amber-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminShopPage() {
  const [tab, setTab] = useState<"products" | "inventory" | "analytics" | "transport">("products");

  // ── Products state ──
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ShopCategory | "all">("all");
  const [modal, setModal] = useState<{ mode: "add" | "edit" | null; product: Product | null }>({ mode: null, product: null });
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<typeof emptyForm>({ ...emptyForm });

  // ── Restock state ──
  const [restockLog, setRestockLog] = useState<RestockEntry[]>([]);
  const [restockLoading, setRestockLoading] = useState(false);
  const [restockForm, setRestockForm] = useState({ ...emptyRestock });
  const [restockSaving, setRestockSaving] = useState(false);

  // ── Analytics state ──
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [calcProduct, setCalcProduct] = useState("");
  const [calcQty, setCalcQty] = useState(0);

  // ── Profit calculator ──
  const calcTarget = products.find(p => p.id === calcProduct);
  const calcRevenue = calcTarget ? calcTarget.price * calcQty : 0;
  const calcCost = calcTarget && calcTarget.costPrice ? calcTarget.costPrice * calcQty : 0;
  const calcProfit = calcRevenue - calcCost;
  const calcMargin = calcRevenue > 0 ? Math.round((calcProfit / calcRevenue) * 100) : 0;

  async function fetchProducts() {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/admin/shop" : `/api/admin/shop?category=${filter}`;
      const r = await fetch(url); setProducts(await r.json());
    } catch { setProducts([]); }
    setLoading(false);
  }

  async function fetchRestock() {
    setRestockLoading(true);
    try { const r = await fetch("/api/admin/shop/restock"); setRestockLog(await r.json()); } catch { setRestockLog([]); }
    setRestockLoading(false);
  }

  async function fetchAnalytics() {
    setAnalyticsLoading(true);
    try { const r = await fetch("/api/admin/shop/analytics"); setAnalytics(await r.json()); } catch { setAnalytics(null); }
    setAnalyticsLoading(false);
  }

  useEffect(() => { fetchProducts(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (tab === "inventory" || tab === "transport") fetchRestock();
    if (tab === "analytics") fetchAnalytics();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  function openAdd() { setForm({ ...emptyForm }); setModal({ mode: "add", product: null }); }
  function openEdit(p: Product) {
    setForm({ name: p.name, category: p.category, price: p.price, costPrice: p.costPrice ?? 0, salePrice: p.salePrice, salePriceFrom: p.salePriceFrom ?? "", salePriceTo: p.salePriceTo ?? "", unit: p.unit, description: p.description, vendorName: p.vendorName, inStock: p.inStock, stockQty: p.stockQty ?? 0, lowStockAlert: p.lowStockAlert ?? 5, requiresAgeVerification: p.requiresAgeVerification, imageUrl: p.imageUrl ?? "", activeFrom: p.activeFrom ?? "", activeTo: p.activeTo ?? "" });
    setModal({ mode: "edit", product: p });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = { ...form, costPrice: form.costPrice || undefined, salePrice: form.salePrice || undefined };
      if (modal.mode === "add") await fetch("/api/admin/shop", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      else if (modal.product) await fetch("/api/admin/shop", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: modal.product.id, ...body }) });
    } catch (e) { console.error(e); }
    setSaving(false); setModal({ mode: null, product: null }); fetchProducts();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await fetch("/api/admin/shop", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: deleteTarget.id }) }); } catch (e) { console.error(e); }
    setDeleting(false); setDeleteTarget(null); fetchProducts();
  }

  async function handleToggleStock(p: Product) {
    await fetch("/api/admin/shop", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, inStock: !p.inStock }) });
    fetchProducts();
  }

  async function handleRestock(e: React.FormEvent) {
    e.preventDefault();
    if (!restockForm.productId || !restockForm.qtyAdded || !restockForm.supplier) return;
    setRestockSaving(true);
    const product = products.find(p => p.id === restockForm.productId);
    try {
      await fetch("/api/admin/shop/restock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...restockForm, productName: product?.name ?? "", date: new Date(restockForm.date).toISOString() }) });
      setRestockForm({ ...emptyRestock });
      fetchRestock(); fetchProducts();
    } catch (e) { console.error(e); }
    setRestockSaving(false);
  }

  const allProducts = loading ? [] : products;
  const stats = { total: allProducts.length, inStock: allProducts.filter(p => p.inStock).length, outOfStock: allProducts.filter(p => !p.inStock).length, lowStock: allProducts.filter(p => p.stockQty !== undefined && p.lowStockAlert !== undefined && p.stockQty <= p.lowStockAlert).length };
  const margin = form.price > 0 && form.costPrice ? Math.round(((form.price - form.costPrice) / form.price) * 100) : null;

  return (
    <div className="p-5 lg:p-7 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-black text-xl">Shop Management</h2>
          <p className="text-gray-500 text-sm mt-0.5">Products, inventory, analytics and transport</p>
        </div>
        {tab === "products" && (
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#0073FF] hover:bg-[#0055CC] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard label="Total Products" value={loading ? "—" : stats.total} Icon={ShoppingBag} color="#0073FF" loading={loading} />
        <AdminStatCard label="In Stock" value={loading ? "—" : stats.inStock} Icon={CheckCircle2} color="#10B981" loading={loading} />
        <AdminStatCard label="Out of Stock" value={loading ? "—" : stats.outOfStock} Icon={XCircle} color="#EF4444" loading={loading} />
        <AdminStatCard label="Low Stock Alerts" value={loading ? "—" : stats.lowStock} Icon={AlertTriangle} color="#F59E0B" loading={loading} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0D1526] border border-white/8 rounded-2xl p-1.5 w-fit">
        {([
          { id: "products", label: "Products", Icon: ShoppingBag },
          { id: "inventory", label: "Inventory & Restock", Icon: Archive },
          { id: "analytics", label: "Profit & Analytics", Icon: BarChart3 },
          { id: "transport", label: "Transport Log", Icon: Truck },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === t.id ? "bg-[#0073FF] text-white shadow" : "text-gray-400 hover:text-white"}`}>
            <t.Icon className="w-4 h-4" strokeWidth={1.75} />{t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB: PRODUCTS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {tab === "products" && (
        <>
          <div className="flex flex-wrap gap-2">
            {["all", "grocery", "alcohol", "pharmacy", "fuel"].map(c => (
              <button key={c} onClick={() => setFilter(c as ShopCategory | "all")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${filter === c ? "bg-[#0073FF] border-[#0073FF] text-white" : "bg-white/3 border-white/8 text-gray-400 hover:bg-white/6 hover:text-gray-200"}`}>
                {c === "all" ? "All Categories" : c}
              </button>
            ))}
          </div>

          <div className="bg-[#0D1526] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">{filter === "all" ? "All Products" : filter}</h3>
              <span className="text-gray-500 text-xs">{loading ? "Loading…" : `${products.length} products`}</span>
            </div>
            {loading ? (
              <div className="divide-y divide-white/5">{[...Array(4)].map((_, i) => <div key={i} className="px-5 py-4 animate-pulse flex gap-4"><div className="h-4 bg-white/8 rounded flex-1" /><div className="h-4 bg-white/8 rounded w-20" /></div>)}</div>
            ) : products.length === 0 ? (
              <AdminEmptyState message="No products found. Add your first product." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-5 py-3">Product</th>
                      <th className="text-left px-5 py-3">Category</th>
                      <th className="text-left px-5 py-3">Sell Price</th>
                      <th className="text-left px-5 py-3">Cost</th>
                      <th className="text-left px-5 py-3">Margin</th>
                      <th className="text-left px-5 py-3">Stock Qty</th>
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-right px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map(p => {
                      const m = p.price > 0 && p.costPrice ? Math.round(((p.price - p.costPrice) / p.price) * 100) : null;
                      const isLow = p.stockQty !== undefined && p.lowStockAlert !== undefined && p.stockQty <= p.lowStockAlert;
                      return (
                        <tr key={p.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#131C30] border border-white/8 overflow-hidden shrink-0 flex items-center justify-center">
                                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} /> : <Package className="w-4 h-4 text-gray-500" strokeWidth={1.75} />}
                              </div>
                              <div>
                                <p className="text-white font-semibold truncate max-w-[180px]">{p.name}</p>
                                <p className="text-gray-600 text-xs">{p.vendorName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4"><AdminBadge status={p.category} /></td>
                          <td className="px-5 py-4">
                            <div>
                              <span className="text-white font-bold">N$ {p.price.toFixed(2)}</span>
                              {p.salePrice && <p className="text-green-400 text-xs">Sale: N$ {p.salePrice.toFixed(2)}</p>}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-400">{p.costPrice ? `N$ ${p.costPrice.toFixed(2)}` : "—"}</td>
                          <td className="px-5 py-4">
                            {m !== null ? (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m >= 25 ? "bg-green-500/15 text-green-400" : m >= 10 ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}`}>{m}%</span>
                            ) : <span className="text-gray-600">—</span>}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold ${isLow ? "text-amber-400" : "text-gray-300"}`}>{p.stockQty ?? "—"}</span>
                              {isLow && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" strokeWidth={2} />}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <button onClick={() => handleToggleStock(p)} className="flex items-center gap-1.5 text-xs font-semibold transition-colors">
                              {p.inStock ? <><ToggleRight className="w-5 h-5 text-green-400" strokeWidth={1.75} /><span className="text-green-400">Live</span></> : <><ToggleLeft className="w-5 h-5 text-red-400" strokeWidth={1.75} /><span className="text-red-400">Hidden</span></>}
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg bg-[#0073FF]/10 border border-[#0073FF]/20 flex items-center justify-center text-[#4DA6FF] hover:bg-[#0073FF]/20 transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5" strokeWidth={2} /></button>
                              <button onClick={() => setDeleteTarget(p)} className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" strokeWidth={2} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB: INVENTORY */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {tab === "inventory" && (
        <div className="space-y-6">
          {/* Current stock levels */}
          <div className="bg-[#0D1526] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h3 className="text-white font-bold">Current Stock Levels</h3>
              <p className="text-gray-500 text-xs mt-0.5">Products highlighted in amber are at or below their low-stock alert threshold</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Product</th>
                  <th className="text-left px-5 py-3">Category</th>
                  <th className="text-left px-5 py-3">In Stock</th>
                  <th className="text-left px-5 py-3">Low Alert</th>
                  <th className="text-left px-5 py-3">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {allProducts.sort((a, b) => {
                    const aLow = a.stockQty !== undefined && a.lowStockAlert !== undefined && a.stockQty <= a.lowStockAlert;
                    const bLow = b.stockQty !== undefined && b.lowStockAlert !== undefined && b.stockQty <= b.lowStockAlert;
                    return Number(bLow) - Number(aLow);
                  }).map(p => {
                    const isLow = p.stockQty !== undefined && p.lowStockAlert !== undefined && p.stockQty <= p.lowStockAlert;
                    return (
                      <tr key={p.id} className={`transition-colors ${isLow ? "bg-amber-500/5" : "hover:bg-white/2"}`}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#131C30] overflow-hidden shrink-0 flex items-center justify-center">
                              {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} /> : <Package className="w-4 h-4 text-gray-500" strokeWidth={1.75} />}
                            </div>
                            <p className="text-white font-semibold text-sm">{p.name}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3 capitalize text-gray-400">{p.category}</td>
                        <td className="px-5 py-3">
                          <span className={`font-black text-lg ${isLow ? "text-amber-400" : "text-white"}`}>{p.stockQty ?? "—"}</span>
                          <span className="text-gray-500 text-xs ml-1">{p.unit}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-400">{p.lowStockAlert ?? "—"}</td>
                        <td className="px-5 py-3">
                          {!p.inStock ? <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full">Hidden</span>
                            : isLow ? <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" />Low Stock</span>
                            : <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">Good</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add restock entry */}
          <div className="bg-[#0D1526] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><RefreshCw className="w-4 h-4 text-[#4DA6FF]" strokeWidth={2} />Record a Restock</h3>
            <form onSubmit={handleRestock} className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={lbl}>Product *</label>
                <select className={inp} value={restockForm.productId} onChange={e => setRestockForm(f => ({ ...f, productId: e.target.value }))} required>
                  <option value="">Select product…</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Qty Added *</label>
                <input className={inp} type="number" min={1} value={restockForm.qtyAdded || ""} onChange={e => setRestockForm(f => ({ ...f, qtyAdded: parseInt(e.target.value) || 0 }))} required />
              </div>
              <div>
                <label className={lbl}>Cost per Unit (N$) *</label>
                <input className={inp} type="number" min={0} step="0.01" value={restockForm.costPerUnit || ""} onChange={e => setRestockForm(f => ({ ...f, costPerUnit: parseFloat(e.target.value) || 0 }))} required />
              </div>
              <div>
                <label className={lbl}>Supplier *</label>
                <input className={inp} placeholder="e.g. Checkers Warehouse" value={restockForm.supplier} onChange={e => setRestockForm(f => ({ ...f, supplier: e.target.value }))} required />
              </div>
              <div>
                <label className={lbl}>Transporter</label>
                <input className={inp} placeholder="Driver name or company" value={restockForm.transporter} onChange={e => setRestockForm(f => ({ ...f, transporter: e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>Transport Cost (N$)</label>
                <input className={inp} type="number" min={0} step="0.01" value={restockForm.transportCost || ""} onChange={e => setRestockForm(f => ({ ...f, transportCost: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <label className={lbl}>Date *</label>
                <input className={inp} type="date" value={restockForm.date} onChange={e => setRestockForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Notes</label>
                <input className={inp} placeholder="Any notes about this restock…" value={restockForm.notes} onChange={e => setRestockForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-white/8 flex items-center justify-between">
                {restockForm.qtyAdded > 0 && restockForm.costPerUnit > 0 && (
                  <p className="text-gray-400 text-sm">
                    Total restock cost: <strong className="text-white">N$ {(restockForm.qtyAdded * restockForm.costPerUnit + restockForm.transportCost).toFixed(2)}</strong>
                  </p>
                )}
                <button type="submit" disabled={restockSaving} className="ml-auto bg-[#0073FF] hover:bg-[#0055CC] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                  {restockSaving ? "Saving…" : "Record Restock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB: ANALYTICS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {tab === "analytics" && (
        <div className="space-y-6">
          {analyticsLoading ? (
            <div className="text-gray-500 text-center py-16">Loading analytics…</div>
          ) : analytics ? (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
                {[
                  { label: "Total Revenue", value: fmt(analytics.totals.revenue), color: "#0073FF", Icon: DollarSign },
                  { label: "Total COGS", value: fmt(analytics.totals.cost), color: "#F59E0B", Icon: Archive },
                  { label: "Transport Costs", value: fmt(analytics.totals.transport), color: "#F97316", Icon: Truck },
                  { label: "Gross Profit", value: fmt(analytics.totals.profit), color: "#10B981", Icon: TrendingUp },
                  { label: "Units Sold", value: analytics.totals.unitsSold.toString(), color: "#38BDF8", Icon: ShoppingBag },
                ].map(s => (
                  <div key={s.label} className="bg-[#0D1526] border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20` }}>
                        <s.Icon className="w-3.5 h-3.5" style={{ color: s.color }} strokeWidth={2} />
                      </div>
                      <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{s.label}</span>
                    </div>
                    <p className="text-white font-black text-xl">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Per-product breakdown */}
              <div className="bg-[#0D1526] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5">
                  <h3 className="text-white font-bold">Revenue & Profit per Product</h3>
                  <p className="text-gray-500 text-xs mt-0.5">Based on delivered and confirmed orders. Gross profit = Revenue − COGS − Transport.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-5 py-3">Product</th>
                      <th className="text-right px-5 py-3">Units Sold</th>
                      <th className="text-right px-5 py-3">Revenue</th>
                      <th className="text-right px-5 py-3">COGS</th>
                      <th className="text-right px-5 py-3">Transport</th>
                      <th className="text-right px-5 py-3">Gross Profit</th>
                      <th className="text-right px-5 py-3">Margin</th>
                    </tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {analytics.rows.sort((a, b) => b.grossProfit - a.grossProfit).map(r => (
                        <tr key={r.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-[#131C30] overflow-hidden shrink-0 flex items-center justify-center">
                                {r.imageUrl ? <img src={r.imageUrl} alt="" className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} /> : <Package className="w-4 h-4 text-gray-500" strokeWidth={1.75} />}
                              </div>
                              <div>
                                <p className="text-white font-semibold text-sm">{r.name}</p>
                                <p className="text-gray-600 text-xs capitalize">{r.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right text-gray-300 font-semibold">{r.unitsSold}</td>
                          <td className="px-5 py-3 text-right text-white font-bold">{fmt(r.revenue)}</td>
                          <td className="px-5 py-3 text-right text-amber-400">{r.costOfGoods > 0 ? fmt(r.costOfGoods) : "—"}</td>
                          <td className="px-5 py-3 text-right text-orange-400">{r.transport > 0 ? fmt(r.transport) : "—"}</td>
                          <td className="px-5 py-3 text-right">
                            <span className={`font-black ${r.grossProfit >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(r.grossProfit)}</span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            {r.margin !== 0 ? (
                              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${r.margin >= 25 ? "bg-green-500/15 text-green-400" : r.margin >= 10 ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}`}>{r.margin}%</span>
                            ) : <span className="text-gray-600">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Profit calculator */}
              <div className="bg-[#0D1526] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-1 flex items-center gap-2"><Calculator className="w-4 h-4 text-[#4DA6FF]" strokeWidth={2} />Profit Calculator</h3>
                <p className="text-gray-500 text-xs mb-5">See projected profit for any product at any quantity</p>
                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className={lbl}>Product</label>
                    <select className={inp} value={calcProduct} onChange={e => setCalcProduct(e.target.value)}>
                      <option value="">Select product…</option>
                      {analytics.rows.map(r => <option key={r.id} value={r.id}>{r.name} (sell N$ {r.price.toFixed(2)}, cost N$ {(r.costPrice ?? 0).toFixed(2)})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Quantity to Sell</label>
                    <input className={inp} type="number" min={0} placeholder="e.g. 400" value={calcQty || ""} onChange={e => setCalcQty(parseInt(e.target.value) || 0)} />
                  </div>
                </div>
                {calcProduct && calcQty > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Revenue", value: fmt(calcRevenue), color: "#0073FF" },
                      { label: "Cost of Goods", value: fmt(calcCost), color: "#F59E0B" },
                      { label: "Gross Profit", value: fmt(calcProfit), color: calcProfit >= 0 ? "#10B981" : "#EF4444" },
                      { label: "Profit Margin", value: `${calcMargin}%`, color: calcMargin >= 25 ? "#10B981" : calcMargin >= 10 ? "#F59E0B" : "#EF4444" },
                    ].map(c => (
                      <div key={c.label} className="bg-[#131C30] rounded-xl p-4 border border-white/8">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{c.label}</p>
                        <p className="font-black text-xl" style={{ color: c.color }}>{c.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center py-16">Failed to load analytics.</div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB: TRANSPORT LOG */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {tab === "transport" && (
        <div className="bg-[#0D1526] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold">Transport & Restock Log</h3>
              <p className="text-gray-500 text-xs mt-0.5">Every restock with transporter, cost and supplier details</p>
            </div>
            <span className="text-gray-500 text-xs">{restockLog.length} entries</span>
          </div>
          {restockLoading ? (
            <div className="p-10 text-center text-gray-500">Loading…</div>
          ) : restockLog.length === 0 ? (
            <AdminEmptyState message="No restock entries yet. Record your first restock in the Inventory tab." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Product</th>
                  <th className="text-left px-5 py-3">Qty Added</th>
                  <th className="text-left px-5 py-3">Cost/Unit</th>
                  <th className="text-left px-5 py-3">Stock Cost</th>
                  <th className="text-left px-5 py-3">Supplier</th>
                  <th className="text-left px-5 py-3">Transporter</th>
                  <th className="text-left px-5 py-3">Transport N$</th>
                  <th className="text-left px-5 py-3">Total Outlay</th>
                  <th className="text-left px-5 py-3">Notes</th>
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {[...restockLog].sort((a, b) => b.date.localeCompare(a.date)).map(r => {
                    const stockCost = r.qtyAdded * r.costPerUnit;
                    const total = stockCost + r.transportCost;
                    return (
                      <tr key={r.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{new Date(r.date).toLocaleDateString("en-NA")}</td>
                        <td className="px-5 py-3 text-white font-semibold">{r.productName}</td>
                        <td className="px-5 py-3 text-gray-300 font-bold">+{r.qtyAdded}</td>
                        <td className="px-5 py-3 text-gray-400">N$ {r.costPerUnit.toFixed(2)}</td>
                        <td className="px-5 py-3 text-amber-400 font-semibold">N$ {stockCost.toFixed(2)}</td>
                        <td className="px-5 py-3 text-gray-400">{r.supplier}</td>
                        <td className="px-5 py-3 text-gray-400">{r.transporter || "—"}</td>
                        <td className="px-5 py-3 text-orange-400">{r.transportCost > 0 ? `N$ ${r.transportCost.toFixed(2)}` : "—"}</td>
                        <td className="px-5 py-3 text-white font-black">N$ {total.toFixed(2)}</td>
                        <td className="px-5 py-3 text-gray-500 text-xs">{r.notes || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t border-[#0073FF]/20">
                  <tr className="bg-[#0073FF]/5">
                    <td colSpan={4} className="px-5 py-3 text-gray-400 font-semibold text-sm">Totals</td>
                    <td className="px-5 py-3 text-amber-400 font-black">N$ {restockLog.reduce((s, r) => s + r.qtyAdded * r.costPerUnit, 0).toFixed(2)}</td>
                    <td colSpan={2} className="px-5 py-3"></td>
                    <td className="px-5 py-3 text-orange-400 font-black">N$ {restockLog.reduce((s, r) => s + r.transportCost, 0).toFixed(2)}</td>
                    <td className="px-5 py-3 text-white font-black">N$ {restockLog.reduce((s, r) => s + r.qtyAdded * r.costPerUnit + r.transportCost, 0).toFixed(2)}</td>
                    <td className="px-5 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Add / Edit Modal */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <AdminModal open={modal.mode !== null} title={modal.mode === "add" ? "Add New Product" : "Edit Product"} onClose={() => setModal({ mode: null, product: null })}>
        <div className="space-y-5">

          <div className={sec}>
            <p className="text-gray-300 text-xs font-black uppercase tracking-widest">Basic Info</p>
            <div>
              <label className={lbl}>Product Name *</label>
              <input className={inp} placeholder="e.g. Fresh Milk 2L" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Category *</label>
                <select className={inp} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value, requiresAgeVerification: e.target.value === "alcohol" }))}>
                  {CAT_OPTIONS.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Unit</label>
                <input className={inp} list="unit-opts" placeholder="per kg" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
                <datalist id="unit-opts">{UNIT_OPTIONS.map(u => <option key={u} value={u} />)}</datalist>
              </div>
            </div>
            <div>
              <label className={lbl}>Vendor / Store</label>
              <input className={inp} placeholder="e.g. Checkers Windhoek" value={form.vendorName} onChange={e => setForm(f => ({ ...f, vendorName: e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>Description</label>
              <textarea className={inp} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>

          <div className={sec}>
            <p className="text-gray-300 text-xs font-black uppercase tracking-widest">Pricing & Margin</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Sell Price (N$) *</label>
                <input className={inp} type="number" min={0} step="0.01" value={form.price || ""} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <label className={lbl}>Cost Price (N$)</label>
                <input className={inp} type="number" min={0} step="0.01" placeholder="What you pay per unit" value={form.costPrice || ""} onChange={e => setForm(f => ({ ...f, costPrice: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>
            {margin !== null && (
              <div className={`text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 ${margin >= 25 ? "bg-green-500/10 text-green-400" : margin >= 10 ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>
                {margin >= 25 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                Gross margin: {margin}% per unit — you earn N$ {(form.price - (form.costPrice ?? 0)).toFixed(2)} on each sale
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={lbl}>Sale Price (N$)</label>
                <input className={inp} type="number" min={0} step="0.01" placeholder="Optional" value={form.salePrice ?? ""} onChange={e => setForm(f => ({ ...f, salePrice: parseFloat(e.target.value) || undefined }))} />
              </div>
              <div>
                <label className={lbl}>Sale From</label>
                <input className={inp} type="date" value={form.salePriceFrom ?? ""} onChange={e => setForm(f => ({ ...f, salePriceFrom: e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>Sale Until</label>
                <input className={inp} type="date" value={form.salePriceTo ?? ""} onChange={e => setForm(f => ({ ...f, salePriceTo: e.target.value }))} />
              </div>
            </div>
          </div>

          <div className={sec}>
            <p className="text-gray-300 text-xs font-black uppercase tracking-widest">Stock</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Stock Quantity</label>
                <input className={inp} type="number" min={0} value={form.stockQty ?? ""} onChange={e => setForm(f => ({ ...f, stockQty: parseInt(e.target.value) || 0 }))} />
              </div>
              <div>
                <label className={lbl}>Low Stock Alert (qty)</label>
                <input className={inp} type="number" min={0} placeholder="e.g. 5" value={form.lowStockAlert ?? ""} onChange={e => setForm(f => ({ ...f, lowStockAlert: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
          </div>

          <div className={sec}>
            <p className="text-gray-300 text-xs font-black uppercase tracking-widest">Product Image</p>
            <ImageUpload value={form.imageUrl ?? ""} onChange={url => setForm(f => ({ ...f, imageUrl: url }))} />
          </div>

          <div className={sec}>
            <p className="text-gray-300 text-xs font-black uppercase tracking-widest">Availability</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Active From (date)</label>
                <input className={inp} type="date" value={form.activeFrom ?? ""} onChange={e => setForm(f => ({ ...f, activeFrom: e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>Active Until (date)</label>
                <input className={inp} type="date" value={form.activeTo ?? ""} onChange={e => setForm(f => ({ ...f, activeTo: e.target.value }))} />
              </div>
            </div>
            <p className="text-gray-600 text-xs">Leave blank for always-visible. Set dates to auto-show/hide on the shop.</p>
            <div className="flex items-center gap-6 pt-1">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm(f => ({ ...f, inStock: !f.inStock }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.inStock ? "bg-green-500" : "bg-white/10"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.inStock ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                <span className="text-gray-300 text-sm">{form.inStock ? "Visible on shop" : "Hidden from shop"}</span>
              </div>
              {form.category === "alcohol" && (
                <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3" strokeWidth={2} />18+ Required
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-white/8">
            <button type="button" onClick={() => setModal({ mode: null, product: null })} className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">Cancel</button>
            <button type="button" onClick={handleSave} disabled={saving || !form.name} className="flex-1 bg-[#0073FF] hover:bg-[#0055CC] text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
              {saving ? "Saving…" : modal.mode === "add" ? "Add Product" : "Save Changes"}
            </button>
          </div>
        </div>
      </AdminModal>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Product"
        description={`Remove "${deleteTarget?.name}" from the shop?`}
        detail="This cannot be undone."
        confirmLabel="Delete"
        danger loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
