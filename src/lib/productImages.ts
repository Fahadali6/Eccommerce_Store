import type { ProductImage } from "@/types";

/**
 * Curated Unsplash bag/backpack photos (free to use via Unsplash CDN).
 * Each product slug maps to 3–4 gallery images.
 */
const POOLS = {
  travel: [
    // backpacks / travel bags
    "photo-1553062407-98eeb64c6a62",
    "photo-1547949003-979cc4e533c6",
    "photo-1491637639811-60e2756cc1c7",
    "photo-1578662996442-48f60103fc96",
  ] as const,
  office: [
    // briefcase / commuter / laptop vibe
    "photo-1627123424574-10b995aabc35",
    "photo-1590874101-5c2440707502",
    "photo-1553062407-98eeb64c6a62",
    "photo-1491637639811-60e2756cc1c7",
  ] as const,
  fashion: [
    // tote / purse / lifestyle
    "photo-1594633312681-425c7b97ccd1",
    "photo-1590874101-5c2440707502",
    "photo-1548036328-c9fa89d128fa",
    "photo-1578662996442-48f60103fc96",
  ] as const,
  gym: [
    // duffel / training vibe
    "photo-1581605405669-fcdf81165afa",
    "photo-1571907481-fbd2404e67ec",
    "photo-1547949003-979cc4e533c6",
    "photo-1553062407-98eeb64c6a62",
  ] as const,
  camera: [
    // camera pack / photography vibe
    "photo-1516035069371-29a1b244cc32",
    "photo-1547949003-979cc4e533c6",
    "photo-1553062407-98eeb64c6a62",
    "photo-1491637639811-60e2756cc1c7",
  ] as const,
} as const;

const BAG_PHOTOS: Record<string, readonly string[]> = {
  // Travel
  "obsidian-transit-pro": POOLS.travel,
  "atlas-weekender": POOLS.travel,
  "summit-ridge-backpack": POOLS.travel,
  "heritage-rolltop": POOLS.travel,

  // Office
  "neural-laptop-folio": POOLS.office,
  "ivory-executive-briefcase": POOLS.office,
  "lux-commuter-tote": POOLS.office,

  // Fashion
  "meridian-tote": POOLS.fashion,
  "phantom-mini-crossbody": POOLS.fashion,

  // Gym
  "forge-gym-duffel": POOLS.gym,

  // Specialty
  "nomad-camera-pack": POOLS.camera,
};

/** Default travel/backpack set when slug is unknown */
const DEFAULT_BAG_PHOTOS = POOLS.travel;

/** Category hero images for shop/marketing */
export const CATEGORY_BAG_IMAGES: Record<string, string> = {
  "Travel Bags": POOLS.travel[0],
  "Office Bags": POOLS.office[0],
  "Gym Bags": POOLS.gym[0],
  "Fashion Bags": POOLS.fashion[0],
  "Ladies Bags": POOLS.fashion[0],
  Backpacks: POOLS.travel[0],
  "Laptop Bags": POOLS.office[0],
};

export function unsplashBagUrl(
  photoRef: string,
  w = 800,
  h = 800
): string {
  return `https://images.unsplash.com/${photoRef}?w=${w}&h=${h}&fit=crop&q=85&auto=format`;
}

export function getBagPhotoRefs(slug: string): readonly string[] {
  return BAG_PHOTOS[slug] ?? DEFAULT_BAG_PHOTOS;
}

export function buildProductImages(slug: string): ProductImage[] {
  const refs = getBagPhotoRefs(slug);
  return refs.map((photoRef, order) => ({
    id:        `${slug}-img-${order}`,
    url:       unsplashBagUrl(photoRef, 1200, 1200),
    path:      `catalog/${slug}/${order}.jpg`,
    isPrimary: order === 0,
    order,
  }));
}

export function getDefaultBagImageUrl(
  slug: string,
  index = 0,
  w = 600,
  h = 600
): string {
  const refs = getBagPhotoRefs(slug);
  const photoRef = refs[index] ?? refs[0];
  return unsplashBagUrl(photoRef, w, h);
}
