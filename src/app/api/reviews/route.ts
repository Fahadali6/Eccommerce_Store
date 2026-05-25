import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  return NextResponse.json({ data: [], productId, message: "Connect Supabase for real reviews" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, userName, rating, comment } = body;
    if (!productId || !userName || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (Number(rating) < 1 || Number(rating) > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }
    const review = { id: Date.now(), productId: Number(productId), userName, rating: Number(rating), comment, verified: false, createdAt: new Date().toISOString() };
    return NextResponse.json({ data: review, message: "Review submitted" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
