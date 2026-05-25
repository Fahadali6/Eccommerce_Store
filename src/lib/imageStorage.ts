/**
 * Image Storage Layer
 * ─────────────────────────────────────────────────────────────
 * Strategy:
 *   • In development (no Supabase env vars) → stores as base64 in localStorage.
 *     This gives instant working upload/preview without any cloud setup.
 *   • In production (Supabase configured)   → uploads to Supabase Storage bucket
 *     "product-images" and returns a permanent CDN URL.
 *
 * Both modes expose the same interface so components don't need to care.
 */

import type { ProductImage } from "@/types";
import { generateImageId, validateImageFile } from "@/lib/utils";

const isDev = () =>
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

// ── Local (dev) storage key ───────────────────────────────────
const LOCAL_KEY = "vaulta_product_images";

function loadLocalImages(): Record<string, ProductImage[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveLocalImages(data: Record<string, ProductImage[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

// ── Public API ────────────────────────────────────────────────

/**
 * Upload a single image for a product.
 * Returns the resulting ProductImage object.
 */
export async function uploadProductImage(
  productId: number,
  file: File,
  isPrimary = false
): Promise<ProductImage> {
  const validation = validateImageFile(file);
  if (!validation.valid) throw new Error(validation.error);

  if (isDev()) {
    return uploadLocalImage(productId, file, isPrimary);
  }
  return uploadSupabaseImage(productId, file, isPrimary);
}

/**
 * Delete a product image by its storage path.
 */
export async function deleteProductImage(
  productId: number,
  image: ProductImage
): Promise<void> {
  if (isDev()) {
    const all = loadLocalImages();
    const imgs = all[productId] ?? [];
    all[productId] = imgs.filter(i => i.id !== image.id);
    saveLocalImages(all);
    return;
  }

  const { supabase, STORAGE_BUCKET } = await import("@/lib/supabase/client");
  await supabase.storage.from(STORAGE_BUCKET).remove([image.path]);
}

/**
 * Get all stored images for a product (dev mode only).
 * In production, images come from the database.
 */
export function getLocalProductImages(productId: number): ProductImage[] {
  const all = loadLocalImages();
  return all[productId] ?? [];
}

// ── Local / Dev upload ────────────────────────────────────────
async function uploadLocalImage(
  productId: number,
  file: File,
  isPrimary: boolean
): Promise<ProductImage> {
  // Convert to base64 for localStorage
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("FileReader failed"));
    reader.readAsDataURL(file);
  });

  const all  = loadLocalImages();
  const imgs = all[productId] ?? [];

  const newImg: ProductImage = {
    id:        generateImageId(),
    url:       dataUrl,        // base64 data URL
    path:      `local/${productId}/${generateImageId()}`,
    isPrimary: isPrimary || imgs.length === 0,
    order:     imgs.length,
  };

  // If setting as primary, unset others
  if (newImg.isPrimary) {
    imgs.forEach(i => (i.isPrimary = false));
  }

  all[productId] = [...imgs, newImg];
  saveLocalImages(all);
  return newImg;
}

// ── Supabase / Production upload ─────────────────────────────
async function uploadSupabaseImage(
  productId: number,
  file: File,
  isPrimary: boolean
): Promise<ProductImage> {
  const { supabase, STORAGE_BUCKET } = await import("@/lib/supabase/client");

  const ext      = file.name.split(".").pop() ?? "jpg";
  const path     = `products/${productId}/${generateImageId()}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "31536000",   // 1 year cache
      upsert:       false,
      contentType:  file.type,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return {
    id:        generateImageId(),
    url:       urlData.publicUrl,
    path,
    isPrimary,
    order:     0,
  };
}

// ── Supabase bucket setup instructions ───────────────────────
export const SUPABASE_SETUP = `
-- Run this in Supabase SQL editor to create the storage bucket:

-- 1. Create bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg','image/png','image/webp','image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- 3. Allow authenticated write (admin)
CREATE POLICY "Admin upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');
`;
