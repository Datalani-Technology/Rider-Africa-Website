import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

export async function GET() {
  try {
    const snap = await getDocs(
      query(collection(db, "blog-posts"), where("published", "==", true), orderBy("createdAt", "desc"))
    );
    const posts = snap.docs.map(d => {
      const x = d.data();
      return {
        id: d.id,
        title: x.title,
        excerpt: x.excerpt,
        content: x.content,
        category: x.category,
        author: x.author || "Rider Africa Team",
        createdAt: x.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      };
    });
    return Response.json(posts);
  } catch {
    return Response.json([]);
  }
}
