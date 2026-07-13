import { NextRequest } from "next/server";
import { createShopOrder, getShopOrders } from "@/lib/admin-data";

export async function GET() {
  return Response.json(await getShopOrders());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const order = await createShopOrder(body);
  return Response.json(order, { status: 201 });
}
