import { NextRequest } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, where, Timestamp } from "firebase/firestore";

function startOf(period: string): Date {
  const now = new Date();
  switch (period) {
    case "today":     return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "week":      { const d = new Date(now); d.setDate(now.getDate() - 7); return d; }
    case "month":     return new Date(now.getFullYear(), now.getMonth(), 1);
    case "quarter":   return new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    case "year":      return new Date(now.getFullYear(), 0, 1);
    case "last_year": return new Date(now.getFullYear() - 1, 0, 1);
    default:          return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}

async function countInRange(col: string, field: string, from: Date, to?: Date) {
  try {
    let q = query(collection(db, col), where(field, ">=", Timestamp.fromDate(from)));
    if (to) q = query(collection(db, col), where(field, ">=", Timestamp.fromDate(from)), where(field, "<=", Timestamp.fromDate(to)));
    const snap = await getDocs(q);
    return snap.size;
  } catch { return 0; }
}

async function timeSeriesData(col: string, field: string, from: Date, buckets: number, bucketDays: number) {
  try {
    const snap = await getDocs(query(collection(db, col), where(field, ">=", Timestamp.fromDate(from)), orderBy(field)));
    const result: { label: string; count: number }[] = [];
    for (let i = 0; i < buckets; i++) {
      const start = new Date(from);
      start.setDate(from.getDate() + i * bucketDays);
      const end = new Date(start);
      end.setDate(start.getDate() + bucketDays);
      const label = start.toLocaleDateString("en-NA", { day: "numeric", month: "short" });
      const count = snap.docs.filter(d => {
        const t = d.data()[field]?.toDate?.();
        return t && t >= start && t < end;
      }).length;
      result.push({ label, count });
    }
    return result;
  } catch { return []; }
}

export async function GET(req: NextRequest) {
  const period = new URL(req.url).searchParams.get("period") || "month";
  const from = startOf(period);
  const now = new Date();

  const prevFrom = new Date(from);
  prevFrom.setTime(prevFrom.getTime() - (now.getTime() - from.getTime()));

  const [
    enquiriesNow, enquiriesPrev,
    subscribersNow, subscribersPrev,
    driverAppsNow, driverAppsPrev,
  ] = await Promise.all([
    countInRange("enquiries", "receivedAt", from),
    countInRange("enquiries", "receivedAt", prevFrom, from),
    countInRange("subscribers", "subscribedAt", from),
    countInRange("subscribers", "subscribedAt", prevFrom, from),
    countInRange("driver-applications", "receivedAt", from),
    countInRange("driver-applications", "receivedAt", prevFrom, from),
  ]);

  const bucketDays = period === "today" ? 1 : period === "week" ? 1 : period === "month" ? 3 : 30;
  const buckets = period === "today" ? 1 : period === "week" ? 7 : period === "month" ? 10 : 12;

  const [enquiriesChart, subscribersChart] = await Promise.all([
    timeSeriesData("enquiries", "receivedAt", from, buckets, bucketDays),
    timeSeriesData("subscribers", "subscribedAt", from, buckets, bucketDays),
  ]);

  const pctChange = (now: number, prev: number) =>
    prev === 0 ? (now > 0 ? 100 : 0) : Math.round(((now - prev) / prev) * 100);

  return Response.json({
    period,
    from: from.toISOString(),
    to: now.toISOString(),
    metrics: {
      enquiries:      { value: enquiriesNow,    change: pctChange(enquiriesNow, enquiriesPrev) },
      subscribers:    { value: subscribersNow,  change: pctChange(subscribersNow, subscribersPrev) },
      driverApps:     { value: driverAppsNow,   change: pctChange(driverAppsNow, driverAppsPrev) },
    },
    charts: {
      enquiries:   enquiriesChart,
      subscribers: subscribersChart,
    },
  });
}
