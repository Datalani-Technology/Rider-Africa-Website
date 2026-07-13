// Real Firestore client — synced with same Firebase project as mobile app (riderafrica-4e655)
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc,
  doc, getDoc, query, where, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Collection names (match mobile app) ──────────────────────────────────────
const PAWN_COL = "pawn_submissions";
const PRODUCTS_COL = "shop_products";
const ORDERS_COL = "shop_orders";
const RESTOCK_COL = "shop_restock_log";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PawnSubmissionData = {
  type: "property" | "vehicle";
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  digitalSignature: string;
  askingPrice: number;
  paymentTerms?: "cash" | "bank";
  location?: string;
  // Property-specific
  propertyAddress?: string;
  erfNumber?: string;
  bondStatus?: string;
  bondHolderDetail?: string;
  occupancyStatus?: "vacant" | "occupied";
  // Vehicle-specific
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleColour?: string;
  vinNumber?: string;
  engineNumber?: string;
  odometer?: number;
  // Documents (Firebase Storage URLs)
  documents?: Record<string, string>;
  photos?: string[];
};

export type PawnSubmission = PawnSubmissionData & {
  id: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  createdAt: Timestamp | null;
  reviewedAt?: Timestamp | null;
  notes?: string;
};

export type ShopProductData = {
  name: string;
  category: "grocery" | "alcohol" | "pharmacy" | "fuel" | string;
  price: number;
  costPrice?: number;
  salePrice?: number;
  salePriceFrom?: string;
  salePriceTo?: string;
  unit: string;
  description: string;
  inStock: boolean;
  stockQty?: number;
  lowStockAlert?: number;
  requiresAgeVerification: boolean;
  vendorName: string;
  imageUrl?: string;
  activeFrom?: string;
  activeTo?: string;
};

export type ShopProduct = ShopProductData & { id: string; createdAt?: Timestamp };

export type RestockEntry = {
  id: string; productId: string; productName: string; date: string;
  qtyAdded: number; costPerUnit: number; supplier: string; transporter: string;
  transportCost: number; notes?: string;
};

export type ShopOrderData = {
  customer: string;
  phone: string;
  email: string;
  address: string;
  items: { productId: string; productName: string; qty: number; price: number }[];
  total: number;
  notes?: string;
};

export type ShopOrder = ShopOrderData & {
  id: string;
  status: "pending_payment" | "paid" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";
  createdAt: Timestamp | null;
  dpoToken?: string;
};

// ─── PAWN SUBMISSIONS ──────────────────────────────────────────────────────────

export async function createPawnSubmission(data: PawnSubmissionData): Promise<string> {
  const ref = await addDoc(collection(db, PAWN_COL), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getPawnSubmissions(type?: "property" | "vehicle"): Promise<PawnSubmission[]> {
  // No orderBy — avoids requiring Firestore composite indexes
  const q = type
    ? query(collection(db, PAWN_COL), where("type", "==", type))
    : query(collection(db, PAWN_COL));
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as PawnSubmission));
  // Sort client-side to avoid index requirement
  return items.sort((a, b) => {
    const at = (a.createdAt as { seconds?: number })?.seconds ?? 0;
    const bt = (b.createdAt as { seconds?: number })?.seconds ?? 0;
    return bt - at;
  });
}

export async function updatePawnStatus(
  id: string,
  status: PawnSubmission["status"],
  notes?: string,
): Promise<void> {
  const updates: Record<string, unknown> = { status, reviewedAt: serverTimestamp() };
  if (notes) updates.notes = notes;
  await updateDoc(doc(db, PAWN_COL, id), updates);
}

// ─── SHOP PRODUCTS ─────────────────────────────────────────────────────────────

export async function getShopProducts(category?: string): Promise<ShopProduct[]> {
  const q = category
    ? query(collection(db, PRODUCTS_COL), where("category", "==", category))
    : query(collection(db, PRODUCTS_COL));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ShopProduct));
}

export async function createShopProduct(data: ShopProductData): Promise<ShopProduct> {
  const ref = await addDoc(collection(db, PRODUCTS_COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...data, createdAt: undefined };
}

export async function updateShopProduct(id: string, data: Partial<ShopProductData>): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_COL, id), data);
}

export async function deleteShopProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COL, id));
}

// ─── SHOP ORDERS ──────────────────────────────────────────────────────────────

export async function createShopOrder(data: ShopOrderData): Promise<ShopOrder> {
  const ref = await addDoc(collection(db, ORDERS_COL), {
    ...data,
    status: "pending_payment",
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...data, status: "pending_payment", createdAt: null };
}

export async function getShopOrders(): Promise<ShopOrder[]> {
  const snap = await getDocs(collection(db, ORDERS_COL));
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as ShopOrder));
  return items.sort((a, b) => {
    const at = (a.createdAt as { seconds?: number })?.seconds ?? 0;
    const bt = (b.createdAt as { seconds?: number })?.seconds ?? 0;
    return bt - at;
  });
}

export async function getShopOrderById(id: string): Promise<ShopOrder | null> {
  const snap = await getDoc(doc(db, ORDERS_COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ShopOrder;
}

export async function updateShopOrderStatus(
  id: string,
  status: ShopOrder["status"],
  dpoToken?: string,
): Promise<ShopOrder | null> {
  const updates: Record<string, unknown> = { status };
  if (dpoToken) updates.dpoToken = dpoToken;
  const ref = doc(db, ORDERS_COL, id);
  await updateDoc(ref, updates);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ShopOrder;
}

// ─── SHOP RESTOCK / INVENTORY ─────────────────────────────────────────────────

export async function getRestockLog(productId?: string): Promise<RestockEntry[]> {
  const q = productId
    ? query(collection(db, RESTOCK_COL), where("productId", "==", productId))
    : query(collection(db, RESTOCK_COL));
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as RestockEntry));
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export async function addRestockEntry(entry: Omit<RestockEntry, "id">): Promise<RestockEntry> {
  const ref = await addDoc(collection(db, RESTOCK_COL), entry);
  const productRef = doc(db, PRODUCTS_COL, entry.productId);
  const productSnap = await getDoc(productRef);
  if (productSnap.exists()) {
    const currentQty = (productSnap.data().stockQty as number | undefined) ?? 0;
    await updateDoc(productRef, { stockQty: currentQty + entry.qtyAdded, inStock: true });
  }
  return { id: ref.id, ...entry };
}

// ─── SHOP ANALYTICS ────────────────────────────────────────────────────────────

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
