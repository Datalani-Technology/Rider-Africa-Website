// Stub — replace function bodies with real Firestore calls (see src/lib/firestore.ts for the pattern
// already used by pawn/shop). All data shapes match what the admin UI expects.

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
