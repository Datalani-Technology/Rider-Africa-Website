import { NextRequest } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }

    // Check for duplicate
    const existing = await getDocs(query(collection(db, "subscribers"), where("email", "==", email)));
    if (!existing.empty) {
      return Response.json({ success: true, already: true });
    }

    await addDoc(collection(db, "subscribers"), {
      email,
      subscribedAt: serverTimestamp(),
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("subscribe error:", err);
    return Response.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
