import { NextRequest } from "next/server";
import { getShopProducts, createShopProduct, updateShopProduct, deleteShopProduct } from "@/lib/admin-data";

export async function GET(req: NextRequest) {
  const cat = new URL(req.url).searchParams.get("category") ?? undefined;
  return Response.json(await getShopProducts(cat));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const product = await createShopProduct(body);
  return Response.json(product, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id, ...updates } = await req.json();
  await updateShopProduct(id, updates);
  return Response.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteShopProduct(id);
  return Response.json({ success: true });
}
