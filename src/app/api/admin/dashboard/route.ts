import { getUsers, getDrivers, getDriverApplications, getSubscribers, getEnquiries } from "@/lib/firebase-admin";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer } from "firebase/firestore";

async function firestoreCount(col: string) {
  try {
    const snap = await getCountFromServer(collection(db, col));
    return snap.data().count;
  } catch {
    return 0;
  }
}

export async function GET() {
  const [users, drivers, driverApplications, subscribers, enquiries, firestoreEnquiries, firestoreSubscribers] = await Promise.all([
    getUsers(),
    getDrivers(),
    getDriverApplications(),
    getSubscribers(),
    getEnquiries(),
    firestoreCount("enquiries"),
    firestoreCount("subscribers"),
  ]);

  // Use Firestore count if it has real data, otherwise fall back to stub array length
  const enquiryCount = firestoreEnquiries > 0 ? firestoreEnquiries : enquiries.length;
  const subscriberCount = firestoreSubscribers > 0 ? firestoreSubscribers : subscribers.length;

  return Response.json({
    totalUsers: users.length,
    totalDrivers: drivers.length,
    tripsToday: 0,
    pendingPayments: 0,
    withdrawalRequests: 0,
    enquiries: enquiryCount,
    subscribers: subscriberCount,
    driverApplications: driverApplications.length,
  });
}
