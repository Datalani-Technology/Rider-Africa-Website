// Real Firestore client — synced with same Firebase project as mobile app (riderafrica-4e655)
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc,
  doc, query, where, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Collection names (match mobile app) ──────────────────────────────────────
const PAWN_COL = "pawn_submissions";
const PRODUCTS_COL = "shop_products";
const ORDERS_COL = "shop_orders";

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
  category: "grocery" | "alcohol" | "pharmacy" | "fuel";
  price: number;
  unit: string;
  description: string;
  inStock: boolean;
  requiresAgeVerification: boolean;
  vendorName: string;
  imageUrl?: string;
};

export type ShopProduct = ShopProductData & { id: string; createdAt?: Timestamp };

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

export async function createShopProduct(data: ShopProductData): Promise<string> {
  const ref = await addDoc(collection(db, PRODUCTS_COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateShopProduct(id: string, data: Partial<ShopProductData>): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_COL, id), data);
}

export async function deleteShopProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COL, id));
}

// ─── SHOP ORDERS ──────────────────────────────────────────────────────────────

export async function createShopOrder(data: ShopOrderData): Promise<string> {
  const ref = await addDoc(collection(db, ORDERS_COL), {
    ...data,
    status: "pending_payment",
    createdAt: serverTimestamp(),
  });
  return ref.id;
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

export async function updateShopOrderStatus(
  id: string,
  status: ShopOrder["status"],
  dpoToken?: string,
): Promise<void> {
  const updates: Record<string, unknown> = { status };
  if (dpoToken) updates.dpoToken = dpoToken;
  await updateDoc(doc(db, ORDERS_COL, id), updates);
}
