import { NextRequest } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, doc, deleteDoc } from "firebase/firestore";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const snap = await getDocs(query(collection(db, "enquiries"), orderBy("receivedAt", "desc")));
    const data = snap.docs.map(d => {
      const x = d.data();
      return {
        id: d.id,
        name: x.name, email: x.email, phone: x.phone ?? null,
        subject: x.subject, message: x.message,
        status: x.status ?? "new",
        receivedAt: x.receivedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      };
    });
    return Response.json(data);
  } catch {
    return Response.json([]);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await deleteDoc(doc(db, "enquiries", id));
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { to, name, subject, body } = await req.json();
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass || smtpPass === "your-app-password") {
    console.log("📤 Reply (SMTP not configured):", { to, subject, body });
    return Response.json({ success: true, note: "SMTP not configured — reply logged only" });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from: `"Rider Africa" <${smtpUser}>`,
    to,
    replyTo: "admin@riderafrica.com",
    subject: `Re: ${subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0073FF;padding:20px 28px;border-radius:12px 12px 0 0">
          <h2 style="color:#fff;margin:0;font-size:18px">Rider Africa</h2>
        </div>
        <div style="background:#fff;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
          <p style="color:#333;font-size:15px;line-height:1.6">Dear ${name},</p>
          <div style="color:#333;font-size:14px;line-height:1.8;white-space:pre-wrap">${body}</div>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
          <p style="color:#666;font-size:12px;margin:0">Rider Africa · Windhoek, Namibia · admin@riderafrica.com</p>
        </div>
      </div>
    `,
  });

  return Response.json({ success: true });
}
