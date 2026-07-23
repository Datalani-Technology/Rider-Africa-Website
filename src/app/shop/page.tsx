import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Rider Store | Rider Africa",
  description: "Order groceries, pharmacy, alcohol (18+), and fuel delivered fast in Windhoek, Namibia.",
};

export default function ShopPage() {
  return <ShopClient />;
}
