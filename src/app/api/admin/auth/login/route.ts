import { NextRequest } from "next/server";
import { signAdminToken } from "@/lib/admin-auth";

function decodeFirebaseToken(idToken: string): { email?: string; uid?: string } | null {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  if (!idToken) {
    return Response.json({ error: "Missing token" }, { status: 400 });
  }

  const payload = decodeFirebaseToken(idToken);
  if (!payload?.email) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const token = await signAdminToken(payload.email);
  const res = Response.json({ success: true });
  res.headers.set(
    "Set-Cookie",
    `admin_token=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Strict`
  );
  return res;
}
