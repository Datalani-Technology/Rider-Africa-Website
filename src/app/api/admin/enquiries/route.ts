import { NextRequest } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, doc, deleteDoc } from "firebase/firestore";
import nodemailer from "nodemailer";
import { emailTemplate } from "@/lib/email-template";

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

  const htmlBody = `
    <p>Dear ${name},</p>
    <div style="line-height:1.8;white-space:pre-wrap;">${body.replace(/\n/g, "<br>")}</div>
    <p style="margin-top:24px;color:#6B7280;font-size:13px;">
      Kind regards,<br/>
      <strong style="color:#0A0F2E;">Rider Africa Team</strong><br/>
      +264 81 469 8594 · admin@riderafrica.com
    </p>
  `;

  await transporter.sendMail({
    from: `"Rider Africa" <${smtpUser}>`,
    to,
    replyTo: "admin@riderafrica.com",
    subject: `Re: ${subject}`,
    html: emailTemplate({
      title: `Re: ${subject}`,
      preheader: `Reply from Rider Africa regarding your enquiry`,
      body: htmlBody,
      ctaLabel: "Visit Our Website",
      ctaHref: "https://riderafrica.com",
    }),
  });

  return Response.json({ success: true });
}
