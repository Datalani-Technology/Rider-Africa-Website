import { NextRequest } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection, addDoc, getDocs, orderBy, query,
  serverTimestamp, doc, updateDoc, deleteDoc,
} from "firebase/firestore";

export async function GET() {
  try {
    const snap = await getDocs(query(collection(db, "blog-posts"), orderBy("createdAt", "desc")));
    const posts = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        author: data.author || "Rider Africa Team",
        published: data.published ?? false,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      };
    });
    return Response.json(posts);
  } catch {
    return Response.json([]);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, excerpt, content, category, author, published } = body;
  if (!title || !excerpt) return Response.json({ error: "Title and excerpt required" }, { status: 400 });

  const ref = await addDoc(collection(db, "blog-posts"), {
    title, excerpt, content: content || "", category: category || "Company News",
    author: author || "Rider Africa Team",
    published: published ?? false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return Response.json({ id: ref.id });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return Response.json({ error: "ID required" }, { status: 400 });
  await updateDoc(doc(db, "blog-posts", id), { ...data, updatedAt: serverTimestamp() });
  return Response.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return Response.json({ error: "ID required" }, { status: 400 });
  await deleteDoc(doc(db, "blog-posts", id));
  return Response.json({ success: true });
}
