import { NextRequest, NextResponse } from "next/server";
import { generateOrderId } from "@/lib/utils";

export async function GET() {
  return NextResponse.json({ data: [], message: "Connect Supabase for real orders" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customerName, customerEmail, total } = body;
    if (!items?.length || !customerName || !customerEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const order = {
      id: generateOrderId(),
      customerName, customerEmail, items, total,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };
    return NextResponse.json({ data: order, message: "Order placed successfully" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
