import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/data";
import { ProductDetailClient } from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const p = PRODUCTS.find(x => x.slug === slug);

  if (!p) return { title: "Not Found" };

  return { title: p.name, description: p.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = PRODUCTS.find(p => p.slug === slug);

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
