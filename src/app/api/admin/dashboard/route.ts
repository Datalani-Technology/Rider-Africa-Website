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
  const [users, drivers, enquiries, subscribers, driverApplications] = await Promise.all([
    count("users"),
    count("drivers"),
    count("enquiries"),
    count("subscribers"),
    count("driver-applications"),
  ]);

  return Response.json({
    totalUsers: users,
    totalDrivers: drivers,
    tripsToday: 0,
    pendingPayments: 0,
    withdrawalRequests: 0,
    enquiries,
    subscribers,
    driverApplications,
  });
}
