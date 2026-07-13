import { getProductAnalytics } from "@/lib/admin-data";

export async function GET() {
  return Response.json(await getProductAnalytics());
}
