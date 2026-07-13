import { NextRequest } from "next/server";
import { createShopOrder, updateShopOrderStatus } from "@/lib/firebase-admin";
import { createPaymentToken } from "@/lib/dpo";

export async function POST(req: NextRequest) {
  const { cart, customer } = await req.json();

  const items = cart.map((i: { product: { id: string; name: string; price: number }; qty: number }) => ({
    productId: i.product.id,
    productName: i.product.name,
    qty: i.qty,
    price: i.product.price,
  }));

  const total: number = items.reduce((s: number, i: { price: number; qty: number }) => s + i.price * i.qty, 0);

  const order = await createShopOrder({
    customer: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    items,
    total,
    status: "pending_payment",
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  try {
    const { token, paymentUrl } = await createPaymentToken({
      amount: total,
      orderId: order.id,
      description: `Rider Africa Shop Order #${order.id}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerName: customer.name,
      returnUrl: `${baseUrl}/shop/payment-success?token={{TransactionToken}}&orderId=${order.id}`,
      backUrl: `${baseUrl}/shop/payment-failed?orderId=${order.id}`,
    });

    await updateShopOrderStatus(order.id, "pending_payment", token);

    return Response.json({ orderId: order.id, paymentUrl });
  } catch {
    // DPO not configured (e.g. dev env) — return order directly as confirmed
    await updateShopOrderStatus(order.id, "paid");
    return Response.json({ orderId: order.id, paymentUrl: null, devMode: true });
  }
}
