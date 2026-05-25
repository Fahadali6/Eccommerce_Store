import type { Metadata } from "next";
import { ShopClient } from "./ShopClient";
export const metadata: Metadata = { title: "Shop All Bags", description: "Browse VAULTA's full collection." };
export default function ShopPage() { return <ShopClient />; }
