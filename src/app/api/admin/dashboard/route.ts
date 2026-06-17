import { db } from "@/lib/firebase";
import { collection, getCountFromServer } from "firebase/firestore";

async function count(col: string) {
  try {
    const snap = await getCountFromServer(collection(db, col));
    return snap.data().count;
  } catch {
    return 0;
  }
}

export async function GET() {
  const [enquiries, subscribers, driverApplications] = await Promise.all([
    count("enquiries"),
    count("subscribers"),
    count("driver-applications"),
  ]);

  return Response.json({
    totalUsers: 0,
    totalDrivers: 0,
    tripsToday: 0,
    pendingPayments: 0,
    withdrawalRequests: 0,
    enquiries,
    subscribers,
    driverApplications,
  });
}
