import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export async function GET() {
  try {
    const snap = await getDocs(query(collection(db, "subscribers"), orderBy("subscribedAt", "desc")));
    const data = snap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        email: d.email,
        subscribedAt: d.subscribedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      };
    });
    return Response.json(data);
  } catch (err) {
    console.error("subscribers fetch error:", err);
    return Response.json([]);
  }
}
