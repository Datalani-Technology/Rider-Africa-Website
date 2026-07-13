// Stub — replace function bodies with real firebase-admin calls when credentials arrive.
// All data shapes match what the admin UI expects.

export type UserRecord = {
  id: string; name: string; email: string; phone: string;
  joined: string; status: "active" | "suspended";
};

export type DriverRecord = {
  id: string; name: string; phone: string; email: string;
  vehicle: string; city: string; verificationStatus: "pending" | "approved" | "rejected";
  trips: number; earnings: number; joined: string; status: "active" | "suspended";
};

export type DriverApplication = {
  id: string; name: string; phone: string; email: string;
  vehicleType: string; city: string; submittedAt: string; archived: boolean;
};

export type TripRecord = {
  id: string; type: string; customer: string; driver: string;
  amount: number; status: string; createdAt: string;
};

export type PaymentRecord = {
  id: string; customer: string; amount: number; method: string;
  status: "pending" | "confirmed" | "rejected"; createdAt: string;
};

export type WithdrawalRecord = {
  id: string; driver: string; amount: number; bank: string;
  trips: number; balance: number; status: "pending" | "approved" | "rejected"; requestedAt: string;
};

export type SupportTicket = {
  id: string; user: string; type: "customer" | "customs"; subject: string;
  status: "open" | "resolved"; createdAt: string;
};

export type PawningSubmission = {
  id: string; customer: string; itemType: string; estimatedValue: number;
  status: "pending" | "reviewed" | "rejected"; submittedAt: string;
};

export type GroceryItem = {
  id: string; customer: string; storeName: string; itemName: string;
  reviewed: boolean; submittedAt: string;
};

export type Subscriber = { id: string; email: string; subscribedAt: string };

export type Enquiry = {
  id: string; name: string; email: string; subject: string;
  message: string; receivedAt: string;
};

export type Notification = {
  id: string; title: string; body: string; target: string; sentAt: string;
};

export type PricingRecord = {
  id: string; service: string; baseRate: number; perKm: number; currency: string;
};

export type Settings = {
  registrationCodeCustomsAgent: string;
  registrationCodeSupport: string;
  serviceAreas: string[];
  platformActive: boolean;
};

// ─── Shop & Pawn types ────────────────────────────────────────────────────────

export type ShopCategory = "grocery" | "alcohol" | "pharmacy" | "fuel";

export type RestockEntry = {
  id: string; productId: string; productName: string;
  date: string; qtyAdded: number; costPerUnit: number;
  supplier: string; transporter: string; transportCost: number; notes?: string;
};

export type Product = {
  id: string; name: string; category: ShopCategory | string; price: number;
  costPrice?: number;      // what you paid per unit — used for margin/profit
  salePrice?: number;      // special/discounted sell price
  salePriceFrom?: string;  // ISO date sale starts
  salePriceTo?: string;    // ISO date sale ends
  unit: string; description: string; inStock: boolean;
  stockQty?: number;
  lowStockAlert?: number;  // alert admin when qty drops below this
  requiresAgeVerification: boolean; vendorName: string;
  imageUrl?: string;
  activeFrom?: string;     // product only live from this ISO date
  activeTo?: string;       // product hidden after this ISO date
  createdAt: string;
};

export type PawnProperty = {
  address: string; propertyType: "house" | "apartment" | "land" | "commercial" | "other";
  bedrooms?: number; titleDeedNumber?: string;
};

export type PawnVehicle = {
  make: string; model: string; year: number; licensePlate: string;
  mileage: number; colour?: string; vinNumber?: string;
};

export type PawnItem = {
  id: string; type: "property" | "vehicle"; customer: string;
  customerPhone?: string; customerEmail?: string;
  title: string; description: string; estimatedValue: number;
  status: "pending" | "reviewed" | "approved" | "rejected";
  submittedAt: string; reviewedAt?: string; notes?: string;
  propertyDetails?: PawnProperty; vehicleDetails?: PawnVehicle;
};

export type ShopOrderItem = { productId: string; productName: string; qty: number; price: number };

export type ShopOrder = {
  id: string; customer: string; phone: string; email: string; address: string;
  items: ShopOrderItem[]; total: number;
  status: "pending_payment" | "paid" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";
  dpoToken?: string; createdAt: string;
};

// ─── Stub data ────────────────────────────────────────────────────────────────

const USERS: UserRecord[] = [
  { id: "u1", name: "Amara Nkosi", email: "amara@example.com", phone: "+264811234567", joined: "2026-01-15", status: "active" },
  { id: "u2", name: "Festus Mwangi", email: "festus@example.com", phone: "+264817654321", joined: "2026-02-03", status: "active" },
  { id: "u3", name: "Lerato Dlamini", email: "lerato@example.com", phone: "+264819988776", joined: "2026-03-10", status: "suspended" },
];

const DRIVERS: DriverRecord[] = [
  { id: "d1", name: "Jonas Nakale", phone: "+264816543210", email: "jonas@example.com", vehicle: "Toyota Corolla", city: "Windhoek", verificationStatus: "approved", trips: 142, earnings: 18600, joined: "2026-01-20", status: "active" },
  { id: "d2", name: "Pendapala Haipinge", phone: "+264814567890", email: "penda@example.com", vehicle: "Honda CB125", city: "Windhoek", verificationStatus: "pending", trips: 0, earnings: 0, joined: "2026-04-01", status: "active" },
];

const APPLICATIONS: DriverApplication[] = [
  { id: "a1", name: "Simon Ekandjo", phone: "+264812345678", email: "simon@example.com", vehicleType: "Car (sedan / hatchback)", city: "Windhoek", submittedAt: "2026-06-10T08:30:00Z", archived: false },
  { id: "a2", name: "Maria Nghidinua", phone: "+264818765432", email: "maria@example.com", vehicleType: "Motorcycle", city: "Oshakati", submittedAt: "2026-06-12T14:15:00Z", archived: false },
];

const TRIPS: TripRecord[] = [
  { id: "t1", type: "Local Parcel", customer: "Amara Nkosi", driver: "Jonas Nakale", amount: 120, status: "completed", createdAt: "2026-06-16T09:00:00Z" },
  { id: "t2", type: "Grocery", customer: "Festus Mwangi", driver: "Jonas Nakale", amount: 85, status: "completed", createdAt: "2026-06-16T11:30:00Z" },
  { id: "t3", type: "Transport", customer: "Lerato Dlamini", driver: "—", amount: 250, status: "pending", createdAt: "2026-06-17T07:00:00Z" },
];

const PAYMENTS: PaymentRecord[] = [
  { id: "p1", customer: "Amara Nkosi", amount: 120, method: "Card", status: "pending", createdAt: "2026-06-17T08:00:00Z" },
];

const WITHDRAWALS: WithdrawalRecord[] = [
  { id: "w1", driver: "Jonas Nakale", amount: 5000, bank: "Bank Windhoek", trips: 42, balance: 18600, status: "pending", requestedAt: "2026-06-16T18:00:00Z" },
];

const TICKETS: SupportTicket[] = [
  { id: "s1", user: "Amara Nkosi", type: "customer", subject: "Package not arrived", status: "open", createdAt: "2026-06-17T06:00:00Z" },
];

const PAWNING: PawningSubmission[] = [
  { id: "pw1", customer: "Festus Mwangi", itemType: "Laptop", estimatedValue: 8000, status: "pending", submittedAt: "2026-06-15T10:00:00Z" },
];

const GROCERY: GroceryItem[] = [
  { id: "g1", customer: "Lerato Dlamini", storeName: "Checkers Windhoek", itemName: "Almond milk 1L", reviewed: false, submittedAt: "2026-06-17T07:30:00Z" },
];

const SUBSCRIBERS: Subscriber[] = [
  { id: "sub1", email: "newsletter@example.com", subscribedAt: "2026-05-01T00:00:00Z" },
];

const ENQUIRIES: Enquiry[] = [
  { id: "e1", name: "Test User", email: "test@example.com", subject: "Business Partnership", message: "We would like to explore a B2B delivery contract.", receivedAt: "2026-06-14T12:00:00Z" },
];

const NOTIFICATIONS: Notification[] = [];

let RESTOCK_LOG: RestockEntry[] = [
  { id: "rst1", productId: "prod1", productName: "Fresh Milk 2L", date: "2026-06-10T08:00:00Z", qtyAdded: 60, costPerUnit: 19, supplier: "Checkers Windhoek", transporter: "Jonas Nakale", transportCost: 120, notes: "Morning stock top-up" },
  { id: "rst2", productId: "prod5", productName: "Windhoek Lager 6-pack", date: "2026-06-12T10:00:00Z", qtyAdded: 80, costPerUnit: 88, supplier: "Checkers Liquor Warehouse", transporter: "Rider Africa Van 1", transportCost: 250, notes: "Weekend stock" },
  { id: "rst3", productId: "prod8", productName: "Panado 500mg (24s)", date: "2026-06-14T09:00:00Z", qtyAdded: 100, costPerUnit: 22, supplier: "Dis-Chem Windhoek", transporter: "Pendapala Haipinge", transportCost: 80 },
  { id: "rst4", productId: "prod11", productName: "Unleaded 95 Petrol", date: "2026-06-16T07:00:00Z", qtyAdded: 500, costPerUnit: 20.10, supplier: "Engen Depot Windhoek", transporter: "Engen Tanker", transportCost: 800, notes: "Full tanker delivery" },
  { id: "rst5", productId: "prod2", productName: "Free Range Eggs", date: "2026-06-17T07:30:00Z", qtyAdded: 40, costPerUnit: 38, supplier: "Farm Direct Namibia", transporter: "Jonas Nakale", transportCost: 90 },
];

let PRODUCTS: Product[] = [
  { id: "prod1",  name: "Fresh Milk 2L",          category: "grocery",  price: 28,    costPrice: 19,    unit: "per 2L",      description: "Full cream fresh milk, locally sourced and chilled daily. Rich and creamy.", inStock: true,  requiresAgeVerification: false, vendorName: "Checkers Windhoek",  stockQty: 40,  lowStockAlert: 10, imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=600&fit=crop&auto=format&q=80", createdAt: "2026-06-01T00:00:00Z" },
  { id: "prod2",  name: "Free Range Eggs",         category: "grocery",  price: 55,    costPrice: 38,    unit: "per dozen",   description: "Farm-fresh free range eggs from local Namibian farmers. Rich golden yolks.", inStock: true,  requiresAgeVerification: false, vendorName: "Spar Windhoek",      stockQty: 30,  lowStockAlert: 8,  imageUrl: "https://images.unsplash.com/photo-1518569656558-1f25e69d2fd4?w=800&h=600&fit=crop&auto=format&q=80", createdAt: "2026-06-01T00:00:00Z" },
  { id: "prod3",  name: "Bread Loaf (White)",      category: "grocery",  price: 18,    costPrice: 11,    unit: "per loaf",    description: "Freshly baked white bread, sliced. Soft, fluffy and perfect for sandwiches.", inStock: true,  requiresAgeVerification: false, vendorName: "Freshmart Windhoek", stockQty: 25,  lowStockAlert: 6,  imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&auto=format&q=80", createdAt: "2026-06-01T00:00:00Z" },
  { id: "prod4",  name: "Cooking Oil 2L",          category: "grocery",  price: 65,    costPrice: 44,    unit: "per 2L",      description: "Refined sunflower cooking oil. Ideal for frying, baking and everyday cooking.", inStock: true,  requiresAgeVerification: false, vendorName: "Pick n Pay",         stockQty: 20,  lowStockAlert: 5,  imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=600&fit=crop&auto=format&q=80", createdAt: "2026-06-01T00:00:00Z" },
  { id: "prod5",  name: "Windhoek Lager 6-pack",   category: "alcohol",  price: 130,   costPrice: 88,    unit: "per 6-pack",  description: "Namibia's #1 lager — ice cold and locally brewed since 1920. Crisp and refreshing.", inStock: true,  requiresAgeVerification: true,  vendorName: "Checkers Liquor",    stockQty: 50,  lowStockAlert: 12, imageUrl: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&h=600&fit=crop&auto=format&q=80", createdAt: "2026-06-01T00:00:00Z" },
  { id: "prod6",  name: "Hunters Dry 4-pack",      category: "alcohol",  price: 95,    costPrice: 64,    unit: "per 4-pack",  description: "Crisp dry apple cider — refreshingly light. Great for any occasion.", inStock: true,  requiresAgeVerification: true,  vendorName: "Checkers Liquor",    stockQty: 35,  lowStockAlert: 8,  imageUrl: "https://images.unsplash.com/photo-1560526860-1f0e56046c85?w=800&h=600&fit=crop&auto=format&q=80", createdAt: "2026-06-01T00:00:00Z" },
  { id: "prod7",  name: "Red Wine 750ml",           category: "alcohol",  price: 120,   costPrice: 79,    unit: "per bottle",  description: "South African Shiraz — smooth, full-bodied with hints of dark fruit.", inStock: true,  requiresAgeVerification: true,  vendorName: "Tops Windhoek",      stockQty: 28,  lowStockAlert: 6,  imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop&auto=format&q=80", createdAt: "2026-06-01T00:00:00Z" },
  { id: "prod8",  name: "Panado 500mg (24s)",       category: "pharmacy", price: 38,    costPrice: 22,    unit: "per box",     description: "Trusted pain and fever relief. 24 tablets of Paracetamol 500mg per box.", inStock: true,  requiresAgeVerification: false, vendorName: "Dis-Chem Windhoek",  stockQty: 60,  lowStockAlert: 15, imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop&auto=format&q=80", createdAt: "2026-06-01T00:00:00Z" },
  { id: "prod9",  name: "Allergex (30 tabs)",       category: "pharmacy", price: 62,    costPrice: 41,    unit: "per box",     description: "Antihistamine for seasonal allergy relief. Non-drowsy, fast-acting. 30 tabs.", inStock: true,  requiresAgeVerification: false, vendorName: "Dis-Chem Windhoek",  stockQty: 45,  lowStockAlert: 10, imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop&auto=format&q=80", createdAt: "2026-06-01T00:00:00Z" },
  { id: "prod10", name: "Vitamin C 1000mg",         category: "pharmacy", price: 85,    costPrice: 55,    unit: "per 30 tabs", description: "Immune support with 1000mg effervescent Vitamin C. Great orange flavour.", inStock: true,  requiresAgeVerification: false, vendorName: "Nampharm",           stockQty: 55,  lowStockAlert: 12, imageUrl: "https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&h=600&fit=crop&auto=format&q=80", createdAt: "2026-06-01T00:00:00Z" },
  { id: "prod11", name: "Unleaded 95 Petrol",       category: "fuel",     price: 23.50, costPrice: 20.10, unit: "per litre",   description: "Unleaded 95 octane petrol delivered to your location. Minimum 10L order.", inStock: true,  requiresAgeVerification: false, vendorName: "Engen Windhoek",     stockQty: 500, lowStockAlert: 50, imageUrl: "https://images.unsplash.com/photo-1545575492-cc03df2eecf5?w=800&h=600&fit=crop&auto=format&q=80", createdAt: "2026-06-01T00:00:00Z" },
  { id: "prod12", name: "Diesel 50ppm",             category: "fuel",     price: 21.80, costPrice: 18.60, unit: "per litre",   description: "Low-sulphur 50ppm diesel. Clean combustion, better fuel economy. Min 10L.", inStock: true,  requiresAgeVerification: false, vendorName: "Engen Windhoek",     stockQty: 500, lowStockAlert: 50, imageUrl: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop&auto=format&q=80", createdAt: "2026-06-01T00:00:00Z" },
];

let PAWN_ITEMS: PawnItem[] = [
  {
    id: "pn1", type: "property", customer: "Festus Mwangi", customerPhone: "+264817654321", customerEmail: "festus@example.com",
    title: "3-Bedroom House, Katutura", description: "Well-maintained family home, recently painted, with garage and garden.",
    estimatedValue: 1200000, status: "pending", submittedAt: "2026-06-15T10:00:00Z",
    propertyDetails: { address: "12 Okambara St, Katutura, Windhoek", propertyType: "house", bedrooms: 3, titleDeedNumber: "T-22345" },
  },
  {
    id: "pn2", type: "vehicle", customer: "Amara Nkosi", customerPhone: "+264811234567", customerEmail: "amara@example.com",
    title: "2019 Toyota Hilux", description: "Single cab, good condition, full service history available.",
    estimatedValue: 280000, status: "reviewed", submittedAt: "2026-06-14T08:00:00Z",
    vehicleDetails: { make: "Toyota", model: "Hilux", year: 2019, licensePlate: "N 12345 W", mileage: 85000, colour: "White" },
  },
];

let SHOP_ORDERS: ShopOrder[] = [
  { id: "ord-001", customer: "Simon Ekandjo",    phone: "+264812345678", email: "simon@example.com",   address: "45 Independence Ave, Windhoek", items: [{ productId: "prod1", productName: "Fresh Milk 2L", qty: 3, price: 28 }, { productId: "prod8", productName: "Panado 500mg (24s)", qty: 2, price: 38 }], total: 160, status: "delivered", createdAt: "2026-06-15T09:00:00Z" },
  { id: "ord-002", customer: "Maria Nghidinua",  phone: "+264818765432", email: "maria@example.com",   address: "12 Sam Nujoma Dr, Windhoek",    items: [{ productId: "prod5", productName: "Windhoek Lager 6-pack", qty: 4, price: 130 }, { productId: "prod7", productName: "Red Wine 750ml", qty: 2, price: 120 }, { productId: "prod6", productName: "Hunters Dry 4-pack", qty: 2, price: 95 }], total: 950, status: "delivered", createdAt: "2026-06-15T14:00:00Z" },
  { id: "ord-003", customer: "Festus Mwangi",    phone: "+264817654321", email: "festus@example.com",  address: "8 Hosea Kutako Dr, Windhoek",   items: [{ productId: "prod2", productName: "Free Range Eggs", qty: 2, price: 55 }, { productId: "prod3", productName: "Bread Loaf (White)", qty: 3, price: 18 }, { productId: "prod4", productName: "Cooking Oil 2L", qty: 1, price: 65 }], total: 229, status: "delivered", createdAt: "2026-06-16T08:30:00Z" },
  { id: "ord-004", customer: "Amara Nkosi",      phone: "+264811234567", email: "amara@example.com",   address: "22 Fidel Castro St, Windhoek",  items: [{ productId: "prod10", productName: "Vitamin C 1000mg", qty: 2, price: 85 }, { productId: "prod9", productName: "Allergex (30 tabs)", qty: 1, price: 62 }, { productId: "prod8", productName: "Panado 500mg (24s)", qty: 3, price: 38 }], total: 346, status: "delivered", createdAt: "2026-06-16T11:00:00Z" },
  { id: "ord-005", customer: "Lerato Dlamini",   phone: "+264819988776", email: "lerato@example.com",  address: "5 Orban St, Klein Windhoek",    items: [{ productId: "prod11", productName: "Unleaded 95 Petrol", qty: 20, price: 23.50 }, { productId: "prod12", productName: "Diesel 50ppm", qty: 30, price: 21.80 }], total: 1124, status: "delivered", createdAt: "2026-06-17T07:00:00Z" },
  { id: "ord-006", customer: "Jonas Nakale",     phone: "+264816543210", email: "jonas@example.com",   address: "18 Dr Frans Indongo St",         items: [{ productId: "prod5", productName: "Windhoek Lager 6-pack", qty: 6, price: 130 }, { productId: "prod1", productName: "Fresh Milk 2L", qty: 4, price: 28 }], total: 892, status: "delivered", createdAt: "2026-06-17T18:00:00Z" },
  { id: "ord-007", customer: "Emma Shikongo",    phone: "+264813344556", email: "emma@example.com",    address: "33 Beethoven St, Windhoek",     items: [{ productId: "prod3", productName: "Bread Loaf (White)", qty: 5, price: 18 }, { productId: "prod2", productName: "Free Range Eggs", qty: 3, price: 55 }, { productId: "prod4", productName: "Cooking Oil 2L", qty: 2, price: 65 }], total: 385, status: "confirmed", createdAt: "2026-06-18T09:30:00Z" },
  { id: "ord-008", customer: "David Haimbodi",   phone: "+264815566778", email: "david@example.com",   address: "7 Lazarett St, Windhoek",       items: [{ productId: "prod11", productName: "Unleaded 95 Petrol", qty: 40, price: 23.50 }], total: 940, status: "out_for_delivery", createdAt: "2026-06-18T11:00:00Z" },
  { id: "ord-009", customer: "Grace Nghidengwa", phone: "+264812233445", email: "grace@example.com",   address: "15 Mandume Ndemufayo Ave",      items: [{ productId: "prod7", productName: "Red Wine 750ml", qty: 3, price: 120 }, { productId: "prod6", productName: "Hunters Dry 4-pack", qty: 4, price: 95 }], total: 740, status: "delivered", createdAt: "2026-06-18T15:00:00Z" },
  { id: "ord-010", customer: "Paul Nghifikwa",   phone: "+264814455667", email: "paul@example.com",    address: "9 Werner List St, Windhoek",    items: [{ productId: "prod9", productName: "Allergex (30 tabs)", qty: 2, price: 62 }, { productId: "prod10", productName: "Vitamin C 1000mg", qty: 3, price: 85 }, { productId: "prod8", productName: "Panado 500mg (24s)", qty: 4, price: 38 }], total: 531, status: "delivered", createdAt: "2026-06-19T10:00:00Z" },
];

const PRICING: PricingRecord[] = [
  { id: "pr1", service: "Local Parcel Delivery", baseRate: 50, perKm: 8, currency: "N$" },
  { id: "pr2", service: "Passenger Transport", baseRate: 40, perKm: 10, currency: "N$" },
  { id: "pr3", service: "Grocery Delivery", baseRate: 60, perKm: 7, currency: "N$" },
  { id: "pr4", service: "Valuables Transport", baseRate: 120, perKm: 15, currency: "N$" },
  { id: "pr5", service: "International Shipping", baseRate: 500, perKm: 20, currency: "N$" },
];

let SETTINGS: Settings = {
  registrationCodeCustomsAgent: "CUSTOMS-2026",
  registrationCodeSupport: "SUPPORT-2026",
  serviceAreas: ["Windhoek", "Swakopmund", "Walvis Bay"],
  platformActive: true,
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export async function getUsers() { return [...USERS]; }
export async function getDrivers() { return [...DRIVERS]; }
export async function getDriverApplications() { return [...APPLICATIONS]; }
export async function getTrips() { return [...TRIPS]; }
export async function getPayments() { return [...PAYMENTS]; }
export async function getWithdrawals() { return [...WITHDRAWALS]; }
export async function getSupportTickets() { return [...TICKETS]; }
export async function getPawningSubmissions() { return [...PAWNING]; }
export async function getGroceryItems() { return [...GROCERY]; }
export async function getSubscribers() { return [...SUBSCRIBERS]; }
export async function getEnquiries() { return [...ENQUIRIES]; }
export async function getNotifications() { return [...NOTIFICATIONS]; }
export async function getPricing() { return [...PRICING]; }
export async function getSettings() { return { ...SETTINGS }; }

export async function suspendUser(id: string) {
  const u = USERS.find(u => u.id === id);
  if (u) u.status = "suspended";
}
export async function activateUser(id: string) {
  const u = USERS.find(u => u.id === id);
  if (u) u.status = "active";
}
export async function deleteUser(id: string) {
  const idx = USERS.findIndex(u => u.id === id);
  if (idx !== -1) USERS.splice(idx, 1);
}
export async function approveDriver(id: string) {
  const d = DRIVERS.find(d => d.id === id);
  if (d) d.verificationStatus = "approved";
}
export async function suspendDriver(id: string) {
  const d = DRIVERS.find(d => d.id === id);
  if (d) d.status = "suspended";
}
export async function updatePricing(records: PricingRecord[]) {
  records.forEach(r => {
    const idx = PRICING.findIndex(p => p.id === r.id);
    if (idx !== -1) PRICING[idx] = r;
  });
}
export async function updateSettings(s: Partial<Settings>) {
  SETTINGS = { ...SETTINGS, ...s };
}
export async function sendNotification(n: Omit<Notification, "id" | "sentAt">) {
  NOTIFICATIONS.unshift({ ...n, id: `notif-${Date.now()}`, sentAt: new Date().toISOString() });
}
export async function getDashboardStats() {
  return {
    totalUsers: USERS.length,
    totalDrivers: DRIVERS.length,
    tripsToday: TRIPS.filter(t => t.createdAt.startsWith(new Date().toISOString().slice(0, 10))).length,
    pendingPayments: PAYMENTS.filter(p => p.status === "pending").length,
    pendingWithdrawals: WITHDRAWALS.filter(w => w.status === "pending").length,
    subscribers: SUBSCRIBERS.length,
    shopProducts: PRODUCTS.length,
    pendingPawnItems: PAWN_ITEMS.filter(p => p.status === "pending").length,
    shopOrders: SHOP_ORDERS.length,
  };
}

// ─── Product CRUD ─────────────────────────────────────────────────────────────

export async function getProducts(category?: ShopCategory) {
  if (category) return PRODUCTS.filter(p => p.category === category);
  return [...PRODUCTS];
}
export async function createProduct(p: Omit<Product, "id" | "createdAt">) {
  const newP: Product = { ...p, id: `prod-${Date.now()}`, createdAt: new Date().toISOString() };
  PRODUCTS.push(newP);
  return newP;
}
export async function updateProduct(id: string, updates: Partial<Product>) {
  const idx = PRODUCTS.findIndex(x => x.id === id);
  if (idx !== -1) PRODUCTS[idx] = { ...PRODUCTS[idx], ...updates };
}
export async function deleteProduct(id: string) {
  PRODUCTS = PRODUCTS.filter(p => p.id !== id);
}



// --- Restock / Inventory ---

export async function getRestockLog(productId?: string) {
  if (productId) return RESTOCK_LOG.filter(r => r.productId === productId);
  return [...RESTOCK_LOG];
}

export async function addRestockEntry(entry: Omit<RestockEntry, "id">) {
  const newEntry: RestockEntry = { ...entry, id: `rst-${Date.now()}` };
  RESTOCK_LOG.push(newEntry);
  const idx = PRODUCTS.findIndex(p => p.id === entry.productId);
  if (idx !== -1) {
    PRODUCTS[idx] = { ...PRODUCTS[idx], stockQty: (PRODUCTS[idx].stockQty ?? 0) + entry.qtyAdded, inStock: true };
  }
  return newEntry;
}

// --- Analytics ---

export async function getProductAnalytics() {
  const delivered = SHOP_ORDERS.filter(o => ["delivered", "confirmed", "out_for_delivery"].includes(o.status));
  const stats: Record<string, { revenue: number; unitsSold: number }> = {};
  for (const order of delivered) {
    for (const item of order.items) {
      if (!stats[item.productId]) stats[item.productId] = { revenue: 0, unitsSold: 0 };
      stats[item.productId].revenue += item.price * item.qty;
      stats[item.productId].unitsSold += item.qty;
    }
  }
  const transportCosts: Record<string, number> = {};
  for (const r of RESTOCK_LOG) {
    transportCosts[r.productId] = (transportCosts[r.productId] ?? 0) + r.transportCost;
  }
  const rows = PRODUCTS.map(p => {
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
}// ─── Pawn CRUD ────────────────────────────────────────────────────────────────

export async function getPawnItems(type?: "property" | "vehicle") {
  if (type) return PAWN_ITEMS.filter(p => p.type === type);
  return [...PAWN_ITEMS];
}
export async function createPawnItem(item: Omit<PawnItem, "id" | "submittedAt">) {
  const newItem: PawnItem = { ...item, id: `pn-${Date.now()}`, submittedAt: new Date().toISOString() };
  PAWN_ITEMS.push(newItem);
  return newItem;
}
export async function updatePawnItemStatus(id: string, status: PawnItem["status"], notes?: string) {
  const item = PAWN_ITEMS.find(p => p.id === id);
  if (item) {
    item.status = status;
    if (notes) item.notes = notes;
    item.reviewedAt = new Date().toISOString();
  }
}

// ─── Shop orders ──────────────────────────────────────────────────────────────

export async function getShopOrders() { return [...SHOP_ORDERS]; }
export async function createShopOrder(order: Omit<ShopOrder, "id" | "createdAt">) {
  const newOrder: ShopOrder = { ...order, id: `ord-${Date.now()}`, createdAt: new Date().toISOString() };
  SHOP_ORDERS.push(newOrder);
  return newOrder;
}
export async function updateShopOrderStatus(id: string, status: ShopOrder["status"], dpoToken?: string) {
  const order = SHOP_ORDERS.find(o => o.id === id);
  if (order) {
    order.status = status;
    if (dpoToken) order.dpoToken = dpoToken;
  }
  return order;
}
export async function getShopOrderById(id: string) {
  return SHOP_ORDERS.find(o => o.id === id) ?? null;
}
