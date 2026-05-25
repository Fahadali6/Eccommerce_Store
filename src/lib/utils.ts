import { clsx, type ClassValue } from "clsx";
import type { Product } from "@/types";

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
 * Returns the primary display URL for a product.
 * Priority: 1) uploaded images  2) picsum fallback
 */
export function getProductImageUrl(product: Product, index = 0, w = 600, h = 600): string {
  const uploaded = product.images ?? [];
  if (uploaded.length > 0) {
    const img = uploaded[index] ?? uploaded[0];
    return img.url;
  }
  // Fallback to picsum with stable seed
  return `https://picsum.photos/seed/vaulta${product.imageId}/${w}/${h}`;
}

/**
 * Picsum fallback only (used when no product available)
 */
export function productImageUrl(imageId: number, w = 600, h = 600): string {
  return `https://picsum.photos/seed/vaulta${imageId}/${w}/${h}`;
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
