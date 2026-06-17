import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export async function GET() {
  try {
    const snap = await getDocs(query(collection(db, "enquiries"), orderBy("receivedAt", "desc")));
    const data = snap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name,
        email: d.email,
        phone: d.phone ?? null,
        subject: d.subject,
        message: d.message,
        status: d.status ?? "new",
        receivedAt: d.receivedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      };
    });
    return Response.json(data);
  } catch (err) {
    console.error("enquiries fetch error:", err);
    return Response.json([]);
  }
}
