import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const sort     = searchParams.get("sort");
  const q        = searchParams.get("q");
  const limit    = Number(searchParams.get("limit") ?? "100");

  let products = [...PRODUCTS];

  if (category) products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  if (q)        products = products.filter(p => [p.name, p.description, ...p.tags].join(" ").toLowerCase().includes(q.toLowerCase()));
  if (sort === "price-asc")  products.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
  if (sort === "rating")     products.sort((a, b) => b.rating - a.rating);
  if (sort === "trending")   products = [...products.filter(p => p.trending), ...products.filter(p => !p.trending)];

  return NextResponse.json({ data: products.slice(0, limit), total: products.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ data: { ...body, id: Date.now() }, message: "Product created" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
