import type { Metadata } from "next";
import { HomeClient } from "./HomeClient";

export const metadata: Metadata = {
  title: "VAULTA — Premium Bags Engineered for Life",
  description: "Discover VAULTA's collection of premium travel, office, fashion, and gym bags.",
};

export default function HomePage() {
  return <HomeClient />;
}
