import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { emailTemplate } from "@/lib/email-template";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isDriverApp = subject === "Driver Partner Application";

    // Save to Firestore
    const collectionName = isDriverApp ? "driver-applications" : "enquiries";
    await addDoc(collection(db, collectionName), {
      name,
      email,
      phone: phone || null,
      subject,
      message,
      receivedAt: serverTimestamp(),
      status: "new",
    });

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass || smtpPass === "your-app-password") {
      console.log("📬 Contact form submission (SMTP not configured):", {
        name, email, phone, subject, message, receivedAt: new Date().toISOString(),
      });
      return Response.json({ success: true });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const toEmail = isDriverApp
      ? "registration@riderafrica.com"
      : (process.env.CONTACT_EMAIL || "admin@riderafrica.com");

    const title = isDriverApp ? "New Driver Partner Application" : "New Contact Enquiry";

    const htmlBody = `
      <p>Hello,</p>
      <p>A new ${isDriverApp ? "driver application" : "enquiry"} has been submitted via the Rider Africa website.</p>
      <table cellpadding="0" cellspacing="0" style="font-size:14px;color:#1a1a1a;width:100%;margin-top:16px;">
        <tr><td style="padding:8px 16px 8px 0;color:#6B7280;width:120px;vertical-align:top;"><strong>Name</strong></td><td style="padding:8px 0;">${name}</td></tr>
        <tr><td style="padding:8px 16px 8px 0;color:#6B7280;vertical-align:top;"><strong>Email</strong></td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#0073FF;">${email}</a></td></tr>
        <tr><td style="padding:8px 16px 8px 0;color:#6B7280;vertical-align:top;"><strong>Phone</strong></td><td style="padding:8px 0;">${phone || "—"}</td></tr>
        <tr><td style="padding:8px 16px 8px 0;color:#6B7280;vertical-align:top;"><strong>Subject</strong></td><td style="padding:8px 0;">${subject}</td></tr>
        <tr>
          <td style="padding:8px 16px 8px 0;color:#6B7280;vertical-align:top;"><strong>Message</strong></td>
          <td style="padding:8px 0;line-height:1.6;">${message.replace(/\n/g, "<br>")}</td>
        </tr>
      </table>
      <p style="margin-top:20px;color:#6B7280;font-size:13px;">Reply directly to this email to respond to ${name}.</p>
    `;

    await transporter.sendMail({
      from: `"Rider Africa Website" <${smtpUser}>`,
      to: toEmail,
      replyTo: email,
      subject: `[Rider Africa] ${subject} — from ${name}`,
      html: emailTemplate({ title, preheader: `New submission from ${name}`, body: htmlBody }),
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
