export type Category =
  | "Travel Bags"
  | "Office Bags"
  | "Gym Bags"
  | "Fashion Bags"
  | "Ladies Bags"
  | "Backpacks"
  | "Laptop Bags";

export type Size        = "Small" | "Medium" | "Large";
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface ProductImage {
  id:        string;
  url:       string;
  path:      string;
  isPrimary: boolean;
  order:     number;
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
  imageId:       number;
  images:        ProductImage[];
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

export interface UploadResult {
  success: boolean;
  image?:  ProductImage;
  error?:  string;
}

export const IMAGE_CONSTRAINTS = {
  maxSizeBytes:  5 * 1024 * 1024,
  maxSizeMB:     5,
  allowedTypes:  ["image/jpeg","image/png","image/webp","image/avif"] as string[],
  allowedExts:   [".jpg",".jpeg",".png",".webp",".avif"],
  maxPerProduct: 8,
  thumbSize:     400,
  displaySize:   800,
} as const;
