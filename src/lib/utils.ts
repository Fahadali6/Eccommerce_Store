import { clsx, type ClassValue } from "clsx";
import type { Product } from "@/types";
import { getDefaultBagImageUrl } from "@/lib/productImages";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n);
}

export function generateOrderId(): string {
  return "VLT-" + Date.now().toString().slice(-6);
}

export function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Returns the display URL for a product image.
 * Priority: 1) catalog/uploaded images  2) Unsplash bag catalog by slug
 */
export function getProductImageUrl(product: Product, index = 0, w = 600, h = 600): string {
  const uploaded = product.images ?? [];
  if (uploaded.length > 0) {
    const sorted = [...uploaded].sort((a, b) => a.order - b.order);
    const img = sorted[index] ?? sorted[0];
    return img.url;
  }
  return getDefaultBagImageUrl(product.slug, index, w, h);
}

/** Bag image fallback by product slug */
export function productImageUrl(slug: string, index = 0, w = 600, h = 600): string {
  return getDefaultBagImageUrl(slug, index, w, h);
}

/**
 * Validate an image File before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  const MAX_MB  = 5;

  if (!ALLOWED.includes(file.type)) {
    return { valid: false, error: `File type not allowed. Use: JPG, PNG, WebP, or AVIF.` };
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    return { valid: false, error: `File too large. Max size is ${MAX_MB} MB.` };
  }
  return { valid: true };
}

/**
 * Convert a File to a base64 data URL (for local preview before upload)
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
