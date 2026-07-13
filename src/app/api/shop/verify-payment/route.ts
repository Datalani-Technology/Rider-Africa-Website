import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { verifyPaymentToken } from "@/lib/dpo";
import { getShopOrderById, updateShopOrderStatus } from "@/lib/admin-data";
import { emailTemplate } from "@/lib/email-template";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") ?? "";
  const orderId = searchParams.get("orderId") ?? "";

  if (!token || !orderId) {
    return Response.json({ success: false, error: "Missing token or orderId" }, { status: 400 });
  }

  try {
    const { paid, transRef } = await verifyPaymentToken(token);

    if (!paid) {
      return Response.json({ success: false, error: "Payment not verified" }, { status: 402 });
    }

    const order = await updateShopOrderStatus(orderId, "paid", token);
    if (!order) return Response.json({ success: false, error: "Order not found" }, { status: 404 });

    // Send confirmation email
    await sendOrderConfirmationEmail(order.customer, order.email, orderId, order.items, order.total, order.address, transRef);

    return Response.json({ success: true, order });
  } catch (err) {
    console.error("Payment verification error:", err);
    return Response.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}

async function sendOrderConfirmationEmail(
  name: string,
  email: string,
  orderId: string,
  items: { productName: string; qty: number; price: number }[],
  total: number,
  address: string,
  transRef: string,
) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass || smtpPass === "your-app-password") {
    console.log("Order confirmation email (SMTP not configured):", { orderId, email });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) ?? 587,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const itemRows = items.map(i =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #E5EBF8;">${i.productName}</td>
      <td style="padding:8px 0;border-bottom:1px solid #E5EBF8;text-align:center;">${i.qty}</td>
      <td style="padding:8px 0;border-bottom:1px solid #E5EBF8;text-align:right;font-weight:600;">N$ ${(i.price * i.qty).toFixed(2)}</td>
    </tr>`
  ).join("");

  const body = `
    <p>Dear ${name},</p>
    <p>Your order from <strong>Rider Africa Shop</strong> has been confirmed and is being prepared for delivery. Thank you for shopping with us!</p>

    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;margin:20px 0;border-collapse:collapse;">
      <thead>
        <tr style="border-bottom:2px solid #0073FF;">
          <th style="padding:8px 0;text-align:left;color:#6B7280;">Item</th>
          <th style="padding:8px 0;text-align:center;color:#6B7280;">Qty</th>
          <th style="padding:8px 0;text-align:right;color:#6B7280;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding:12px 0;font-weight:800;font-size:15px;">Total</td>
          <td style="padding:12px 0;font-weight:900;font-size:16px;color:#0073FF;text-align:right;">N$ ${total.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>

    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:13px;color:#374151;background:#F4F8FF;border-radius:10px;padding:16px;">
      <tr><td style="padding:4px 0;"><strong>Order Reference:</strong></td><td style="padding:4px 0;font-family:monospace;">${orderId}</td></tr>
      <tr><td style="padding:4px 0;"><strong>Transaction Ref:</strong></td><td style="padding:4px 0;font-family:monospace;">${transRef || "—"}</td></tr>
      <tr><td style="padding:4px 0;"><strong>Delivery Address:</strong></td><td style="padding:4px 0;">${address}</td></tr>
      <tr><td style="padding:4px 0;"><strong>Estimated Delivery:</strong></td><td style="padding:4px 0;">30 – 60 minutes</td></tr>
    </table>

    <p style="margin-top:20px;">Questions? Call <strong>+264 81 469 8594</strong> / <strong>+264 81 732 7089</strong> or email <a href="mailto:admin@riderafrica.com" style="color:#0073FF;">admin@riderafrica.com</a>.</p>
  `;

  await transporter.sendMail({
    from: `"Rider Africa Shop" <${smtpUser}>`,
    to: email,
    subject: `Order Confirmed — Ref #${orderId} | Rider Africa`,
    html: emailTemplate({
      title: "Order Confirmed",
      preheader: `Your Rider Africa order #${orderId} is confirmed.`,
      body,
    }),
  });
}
