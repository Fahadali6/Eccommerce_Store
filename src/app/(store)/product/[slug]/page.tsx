import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/data";
import { ProductDetailClient } from "./ProductDetailClient";

interface Props { params: Promise<{ slug: string }> }
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = PRODUCTS.find(p => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = PRODUCTS.find(x => x.slug === params.slug);
  if (!p) return { title: "Not Found" };
  return { title: p.name, description: p.description };
}

export default function ProductPage({ params }: Props) {
  const product = PRODUCTS.find(p => p.slug === params.slug);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
