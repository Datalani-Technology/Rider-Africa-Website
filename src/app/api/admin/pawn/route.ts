import { NextRequest } from "next/server";
import { getPawnItems, createPawnItem, updatePawnItemStatus, PawnItem } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const type = new URL(req.url).searchParams.get("type") as "property" | "vehicle" | null;
  return Response.json(await getPawnItems(type ?? undefined));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await createPawnItem(body);
  return Response.json(item, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, status, notes } = await req.json() as { id: string; status: PawnItem["status"]; notes?: string };
  await updatePawnItemStatus(id, status, notes);
  return Response.json({ success: true });
}
