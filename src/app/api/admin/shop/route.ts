import { NextRequest } from "next/server";
import { getProducts, createProduct, updateProduct, deleteProduct, ShopCategory } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const cat = new URL(req.url).searchParams.get("category") as ShopCategory | null;
  return Response.json(await getProducts(cat ?? undefined));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const product = await createProduct(body);
  return Response.json(product, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id, ...updates } = await req.json();
  await updateProduct(id, updates);
  return Response.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteProduct(id);
  return Response.json({ success: true });
}
