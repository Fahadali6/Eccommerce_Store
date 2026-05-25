export type Category    = "Travel" | "Office" | "Fashion" | "Gym";
export type Size        = "Small" | "Medium" | "Large";
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface ProductImage {
  id:        string;   // uuid
  url:       string;   // full public URL
  path:      string;   // storage path e.g. "products/abc123.jpg"
  isPrimary: boolean;
  order:     number;   // 0 = first in gallery
}

export interface Product {
  id:            number;
  name:          string;
  slug:          string;
  price:         number;
  originalPrice: number | null;
  category:      Category;
  material:      string;
  color:         string;
  size:          Size;
  capacity:      number;
  laptopFit:     string | null;
  tags:          string[];
  stock:         number;
  rating:        number;
  reviewCount:   number;
  trending:      boolean;
  featured:      boolean;
  description:   string;
  imageId:       number;          // fallback picsum seed (used when no custom images)
  images:        ProductImage[];  // uploaded images (empty = use picsum fallback)
}

export interface CartItem extends Product { qty: number; }

export interface Order {
  id:            string;
  customerName:  string;
  customerEmail: string;
  status:        OrderStatus;
  total:         number;
  date:          string;
  items:         { name: string; qty: number; price: number }[];
}

// ── Image Upload ──────────────────────────────────────────────
export interface UploadResult {
  success: boolean;
  image?:  ProductImage;
  error?:  string;
}

export const IMAGE_CONSTRAINTS = {
  maxSizeBytes:   5 * 1024 * 1024,   // 5 MB
  maxSizeMB:      5,
  allowedTypes:   ["image/jpeg", "image/png", "image/webp", "image/avif"] as string[],
  allowedExts:    [".jpg", ".jpeg", ".png", ".webp", ".avif"],
  maxPerProduct:  8,
  thumbSize:      400,
  displaySize:    800,
} as const;
