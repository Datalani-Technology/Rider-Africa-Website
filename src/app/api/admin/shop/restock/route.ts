import { NextRequest } from "next/server";
import { getRestockLog, addRestockEntry } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const productId = new URL(req.url).searchParams.get("productId") ?? undefined;
  return Response.json(await getRestockLog(productId));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry = await addRestockEntry(body);
  return Response.json(entry, { status: 201 });
}
