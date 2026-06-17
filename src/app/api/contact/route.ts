import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
    const emailTitle = isDriverApp ? "🚗 New Driver Application" : "📬 New Contact Form Submission";

    await transporter.sendMail({
      from: `"Rider Africa Website" <${smtpUser}>`,
      to: toEmail,
      replyTo: email,
      subject: `[Rider Africa] ${subject} — from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#F4F7FF;padding:0">
          <div style="background:#0073FF;padding:24px 32px;border-radius:12px 12px 0 0">
            <h2 style="color:#fff;margin:0;font-size:20px">${emailTitle}</h2>
            <p style="color:#b3d4ff;margin:6px 0 0;font-size:14px">Rider Africa Website — riderafrica.com</p>
          </div>
          <div style="background:#fff;padding:32px;border-radius:0 0 12px 12px">
            <table cellpadding="0" cellspacing="0" style="font-size:14px;color:#1a1a1a;width:100%">
              <tr><td style="padding:8px 0;color:#666;width:120px"><strong>Name</strong></td><td style="padding:8px 0">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#666"><strong>Email</strong></td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#0073FF">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#666"><strong>Phone</strong></td><td style="padding:8px 0">${phone || "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#666"><strong>Subject</strong></td><td style="padding:8px 0">${subject}</td></tr>
              <tr><td style="padding:8px 12px 8px 0;color:#666;vertical-align:top"><strong>Message</strong></td><td style="padding:8px 0">${message.replace(/\n/g, "<br>")}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
            <p style="color:#999;font-size:12px;margin:0">Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
