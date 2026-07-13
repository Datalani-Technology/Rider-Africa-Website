import type { Metadata } from "next";
import PawnHero from "./PawnHero";
import PawnClient from "./PawnClient";

export const metadata: Metadata = {
  title: "Pawn Services | Rider Africa",
  description: "Get asset-backed financing by pawning your property or vehicle with Rider Africa. Fast evaluation, fair rates, and professional service in Namibia.",
};

export default function PawnPage() {
  return (
    <>
      <PawnHero />
      <div id="pawn-form" style={{ scrollMarginTop: "80px" }}>
        <PawnClient />
      </div>
    </>
  );
}
