// Real, privileged Firestore access for admin API routes — uses the Firebase Admin SDK
// (src/lib/firebase-admin-sdk.ts), which authenticates as a trusted server and bypasses
// Firestore security rules. This is deliberately separate from src/lib/firestore.ts,
// which uses the public client SDK and is correctly blocked by rules from reading
// privileged collections (pawn_submissions, shop_orders) — confirmed by a
// permission-denied error when admin routes tried reading through the client SDK.
//
// Collection names match src/lib/firestore.ts / the mobile app.
import { getAdminDb } from "./firebase-admin-sdk";
import type {
  PawnSubmissionData, PawnSubmission,
  ShopProductData, ShopProduct,
  ShopOrderData, ShopOrder,
  RestockEntry,
} from "./firestore";

const PAWN_COL = "pawn_submissions";
const PRODUCTS_COL = "shop_products";
const ORDERS_COL = "shop_orders";
const RESTOCK_COL = "shop_restock_log";

function toSeconds(ts: unknown): { seconds: number } | null {
  if (!ts) return null;
  const t = ts as FirebaseFirestore.Timestamp;
  return typeof t.seconds === "number" ? { seconds: t.seconds } : null;
}

// ─── Pawn submissions (admin) ──────────────────────────────────────────────────

export async function getPawnSubmissions(type?: "property" | "vehicle"): Promise<PawnSubmission[]> {
  const db = getAdminDb();
  let ref: FirebaseFirestore.Query = db.collection(PAWN_COL);
  if (type) ref = ref.where("type", "==", type);
  const snap = await ref.get();
  const items = snap.docs.map(d => {
    const data = d.data();
    return { id: d.id, ...data, createdAt: toSeconds(data.createdAt), reviewedAt: toSeconds(data.reviewedAt) } as unknown as PawnSubmission;
  });
  return items.sort((a, b) => ((b.createdAt as { seconds?: number })?.seconds ?? 0) - ((a.createdAt as { seconds?: number })?.seconds ?? 0));
}

export async function updatePawnStatus(id: string, status: PawnSubmission["status"], notes?: string): Promise<void> {
  const db = getAdminDb();
  const updates: Record<string, unknown> = { status, reviewedAt: new Date() };
  if (notes) updates.notes = notes;
  await db.collection(PAWN_COL).doc(id).update(updates);
}

// ─── Shop products (admin) ─────────────────────────────────────────────────────

export async function getShopProducts(category?: string): Promise<ShopProduct[]> {
  const db = getAdminDb();
  let ref: FirebaseFirestore.Query = db.collection(PRODUCTS_COL);
  if (category) ref = ref.where("category", "==", category);
  const snap = await ref.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ShopProduct));
}

export async function createShopProduct(data: ShopProductData): Promise<ShopProduct> {
  const db = getAdminDb();
  const ref = await db.collection(PRODUCTS_COL).add({ ...data, createdAt: new Date() });
  return { id: ref.id, ...data };
}

export async function updateShopProduct(id: string, updates: Partial<ShopProductData>): Promise<void> {
  await getAdminDb().collection(PRODUCTS_COL).doc(id).update(updates);
}

export async function deleteShopProduct(id: string): Promise<void> {
  await getAdminDb().collection(PRODUCTS_COL).doc(id).delete();
}

// ─── Shop orders (admin) ───────────────────────────────────────────────────────

export async function getShopOrders(): Promise<ShopOrder[]> {
  const db = getAdminDb();
  const snap = await db.collection(ORDERS_COL).get();
  const items = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: toSeconds(d.data().createdAt) } as unknown as ShopOrder));
  return items.sort((a, b) => ((b.createdAt as { seconds?: number })?.seconds ?? 0) - ((a.createdAt as { seconds?: number })?.seconds ?? 0));
}

export async function getShopOrderById(id: string): Promise<ShopOrder | null> {
  const snap = await getAdminDb().collection(ORDERS_COL).doc(id).get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  return { id: snap.id, ...data, createdAt: toSeconds(data.createdAt) } as unknown as ShopOrder;
}

export async function createShopOrder(data: ShopOrderData): Promise<ShopOrder> {
  const db = getAdminDb();
  const ref = await db.collection(ORDERS_COL).add({ ...data, status: "pending_payment", createdAt: new Date() });
  return { id: ref.id, ...data, status: "pending_payment", createdAt: null };
}

export async function updateShopOrderStatus(id: string, status: ShopOrder["status"], dpoToken?: string): Promise<ShopOrder | null> {
  const db = getAdminDb();
  const updates: Record<string, unknown> = { status };
  if (dpoToken) updates.dpoToken = dpoToken;
  const ref = db.collection(ORDERS_COL).doc(id);
  await ref.update(updates);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  return { id: snap.id, ...data, createdAt: toSeconds(data.createdAt) } as unknown as ShopOrder;
}

// ─── Restock / inventory (admin) ───────────────────────────────────────────────

export async function getRestockLog(productId?: string): Promise<RestockEntry[]> {
  const db = getAdminDb();
  let ref: FirebaseFirestore.Query = db.collection(RESTOCK_COL);
  if (productId) ref = ref.where("productId", "==", productId);
  const snap = await ref.get();
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as RestockEntry));
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export async function addRestockEntry(entry: Omit<RestockEntry, "id">): Promise<RestockEntry> {
  const db = getAdminDb();
  const ref = await db.collection(RESTOCK_COL).add(entry);
  const productRef = db.collection(PRODUCTS_COL).doc(entry.productId);
  const productSnap = await productRef.get();
  if (productSnap.exists) {
    const currentQty = (productSnap.data()?.stockQty as number | undefined) ?? 0;
    await productRef.update({ stockQty: currentQty + entry.qtyAdded, inStock: true });
  }
  return { id: ref.id, ...entry };
}

// ─── Analytics (admin) ─────────────────────────────────────────────────────────

export async function getProductAnalytics() {
  const [products, orders, restock] = await Promise.all([getShopProducts(), getShopOrders(), getRestockLog()]);
  const delivered = orders.filter(o => ["delivered", "confirmed", "out_for_delivery"].includes(o.status));
  const stats: Record<string, { revenue: number; unitsSold: number }> = {};
  for (const order of delivered) {
    for (const item of order.items) {
      if (!stats[item.productId]) stats[item.productId] = { revenue: 0, unitsSold: 0 };
      stats[item.productId].revenue += item.price * item.qty;
      stats[item.productId].unitsSold += item.qty;
    }
  }
  const transportCosts: Record<string, number> = {};
  for (const r of restock) transportCosts[r.productId] = (transportCosts[r.productId] ?? 0) + r.transportCost;
  const rows = products.map(p => {
    const s = stats[p.id] ?? { revenue: 0, unitsSold: 0 };
    const costOfGoods = s.unitsSold * (p.costPrice ?? 0);
    const transport = transportCosts[p.id] ?? 0;
    const grossProfit = s.revenue - costOfGoods - transport;
    const margin = s.revenue > 0 ? Math.round((grossProfit / s.revenue) * 100) : 0;
    return { ...p, revenue: s.revenue, unitsSold: s.unitsSold, costOfGoods, transport, grossProfit, margin };
  });
  const totals = rows.reduce(
    (acc, r) => ({ revenue: acc.revenue + r.revenue, cost: acc.cost + r.costOfGoods, transport: acc.transport + r.transport, profit: acc.profit + r.grossProfit, unitsSold: acc.unitsSold + r.unitsSold }),
    { revenue: 0, cost: 0, transport: 0, profit: 0, unitsSold: 0 }
  );
  return { rows, totals };
}

export type { PawnSubmissionData, ShopProductData, ShopOrderData };
