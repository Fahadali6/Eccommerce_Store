import { clsx, type ClassValue } from "clsx";
import type { Product } from "@/types";

export function cn(...inputs: ClassValue[]) { return clsx(inputs); }

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

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * Real bag images from Unsplash mapped to product imageIds.
 * Each imageId (1001–1019) maps to a specific bag photo.
 */
const BAG_IMAGES: Record<number, string> = {
  // Travel Bags
  1001: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=85", // leather duffle
  1002: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&q=85", // canvas weekender
  1003: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=85", // travel backpack
  // Office Bags
  1004: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&q=85", // leather briefcase
  1005: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=85", // tote bag
  1006: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=85", // canvas rolltop
  // Gym Bags
  1007: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=85", // gym duffel
  1008: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=85", // sport bag
  // Fashion Bags
  1009: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85", // structured tote
  1010: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=800&q=85", // crossbody
  // Ladies Bags
  1011: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=85", // quilted handbag
  1012: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=85", // evening clutch
  1013: "https://images.unsplash.com/photo-1614179818511-8851ee9a9f95?w=800&q=85", // hobo shoulder
  // Backpacks
  1014: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=85", // summit backpack
  1015: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=85", // urban backpack
  1016: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=85", // hiking pack
  // Laptop Bags
  1017: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=85", // laptop folio
  1018: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&q=85", // laptop sleeve
  1019: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=85", // exec laptop bag
};

/** Fallback Unsplash bag photos used when imageId not in map */
const FALLBACK_BAGS = [
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=85",
  "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&q=85",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85",
  "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=85",
  "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=85",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=85",
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=85",
];

export function getProductImageUrl(product: Product, index = 0, _w = 600, _h = 600): string {
  // 1. Use uploaded images first
  const uploaded = product.images ?? [];
  if (uploaded.length > 0) {
    const img = uploaded[index] ?? uploaded[0];
    return img.url;
  }
  // 2. Use Unsplash bag image mapped to imageId
  if (BAG_IMAGES[product.imageId]) {
    return BAG_IMAGES[product.imageId];
  }
  // 3. Fallback to another bag photo
  return FALLBACK_BAGS[product.id % FALLBACK_BAGS.length];
}

/** Legacy helper kept for backward compatibility */
export function productImageUrl(imageId: number, _w = 600, _h = 600): string {
  return BAG_IMAGES[imageId] ?? FALLBACK_BAGS[imageId % FALLBACK_BAGS.length];
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const ALLOWED = ["image/jpeg","image/png","image/webp","image/avif"];
  const MAX_MB  = 5;
  if (!ALLOWED.includes(file.type)) return { valid:false, error:"Use JPG, PNG, WebP, or AVIF." };
  if (file.size > MAX_MB * 1024 * 1024) return { valid:false, error:`Max size is ${MAX_MB} MB.` };
  return { valid:true };
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
