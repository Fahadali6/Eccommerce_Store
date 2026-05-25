import { NextRequest, NextResponse } from "next/server";
import { IMAGE_CONSTRAINTS } from "@/types";

/**
 * POST /api/images
 * Accepts multipart/form-data with:
 *   - file:      the image file
 *   - productId: string
 *   - isPrimary: "true" | "false"
 *
 * In dev: returns a base64 dataURL (handled client-side in imageStorage.ts)
 * In prod: proxies to Supabase Storage
 */
export async function POST(req: NextRequest) {
  try {
    const formData  = await req.formData();
    const file      = formData.get("file") as File | null;
    const productId = formData.get("productId") as string | null;

    if (!file || !productId) {
      return NextResponse.json({ error: "file and productId are required" }, { status: 400 });
    }

    // ── Validation ────────────────────────────────────────────
    if (!IMAGE_CONSTRAINTS.allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: `Invalid file type: ${file.type}. Allowed: JPG, PNG, WebP, AVIF`,
      }, { status: 400 });
    }

    if (file.size > IMAGE_CONSTRAINTS.maxSizeBytes) {
      return NextResponse.json({
        error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max: ${IMAGE_CONSTRAINTS.maxSizeMB} MB`,
      }, { status: 400 });
    }

    // ── Supabase Storage (production) ─────────────────────────
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey && !supabaseUrl.includes("your-project")) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, serviceKey);

      const ext  = file.name.split(".").pop() ?? "jpg";
      const id   = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const path = `products/${productId}/${id}.${ext}`;

      const bytes  = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, buffer, {
          contentType:  file.type,
          cacheControl: "31536000",
          upsert: false,
        });

      if (error) {
        return NextResponse.json({ error: `Storage error: ${error.message}` }, { status: 500 });
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

      return NextResponse.json({
        success: true,
        image: {
          id:        id,
          url:       urlData.publicUrl,
          path:      path,
          isPrimary: formData.get("isPrimary") === "true",
          order:     0,
        },
      });
    }

    // ── Dev mode: client handles base64 conversion ─────────────
    return NextResponse.json({
      success: true,
      mode: "dev",
      message: "In dev mode, images are stored locally via imageStorage.ts",
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * DELETE /api/images?path=products/123/abc.jpg
 */
export async function DELETE(req: NextRequest) {
  try {
    const path = req.nextUrl.searchParams.get("path");
    if (!path) return NextResponse.json({ error: "path is required" }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey && !supabaseUrl.includes("your-project")) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, serviceKey);
      const { error } = await supabase.storage.from("product-images").remove([path]);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
