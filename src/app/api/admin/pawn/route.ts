import { NextRequest } from "next/server";
import { getPawnSubmissions, updatePawnStatus } from "@/lib/admin-data";
import type { PawnSubmission } from "@/lib/firestore";

export async function GET(req: NextRequest) {
  const type = new URL(req.url).searchParams.get("type") as "property" | "vehicle" | null;
  return Response.json(await getPawnSubmissions(type ?? undefined));
}

export async function PATCH(req: NextRequest) {
  const { id, status, notes } = await req.json() as { id: string; status: PawnSubmission["status"]; notes?: string };
  await updatePawnStatus(id, status, notes);
  return Response.json({ success: true });
}
