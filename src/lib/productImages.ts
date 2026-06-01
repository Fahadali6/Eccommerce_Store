import type { ProductImage } from "@/types";

/**
 * Curated Unsplash bag/backpack photos (free to use via Unsplash CDN).
 * Each product slug maps to 3–4 gallery images.
 */
const BAG_PHOTOS: Record<string, readonly string[]> = {
  "obsidian-transit-pro": [
    "photo-1553062407-98eeb64c6a62",
    "photo-1547949003-979cc4e533c6",
    "photo-1578662996442-48f60103fc96",
    "photo-1491637639811-60e2756cc1c7",
  ],
  "atlas-weekender": [
    "photo-1548036328-c9fa89d128fa",
    "photo-1491637639811-60e2756cc1c7",
    "photo-1553062407-98eeb64c6a62",
    "photo-1578662996442-48f60103fc96",
  ],
  "neural-laptop-folio": [
    "photo-1627123424574-10b995aabc35",
    "photo-1553062407-98eeb64c6a62",
    "photo-1590874101-5c2440707502",
    "photo-1548036328-c9fa89d128fa",
  ],
  "meridian-tote": [
    "photo-1594633312681-425c7b97ccd1",
    "photo-1590874101-5c2440707502",
    "photo-1548036328-c9fa89d128fa",
    "photo-1578662996442-48f60103fc96",
  ],
  "summit-ridge-backpack": [
    "photo-1547949003-979cc4e533c6",
    "photo-1553062407-98eeb64c6a62",
    "photo-1491637639811-60e2756cc1c7",
    "photo-1581605405669-fcdf81165afa",
  ],
  "forge-gym-duffel": [
    "photo-1581605405669-fcdf81165afa",
    "photo-1571907481-fbd2404e67ec",
    "photo-1547949003-979cc4e533c6",
    "photo-1553062407-98eeb64c6a62",
  ],
  "ivory-executive-briefcase": [
    "photo-1627123424574-10b995aabc35",
    "photo-1553062407-98eeb64c6a62",
    "photo-1590874101-5c2440707502",
    "photo-1594633312681-425c7b97ccd1",
  ],
  "phantom-mini-crossbody": [
    "photo-1590874101-5c2440707502",
    "photo-1548036328-c9fa89d128fa",
    "photo-1594633312681-425c7b97ccd1",
    "photo-1578662996442-48f60103fc96",
  ],
  "nomad-camera-pack": [
    "photo-1516035069371-29a1b244cc32",
    "photo-1547949003-979cc4e533c6",
    "photo-1553062407-98eeb64c6a62",
    "photo-1491637639811-60e2756cc1c7",
  ],
  "lux-commuter-tote": [
    "photo-1594633312681-425c7b97ccd1",
    "photo-1590874101-5c2440707502",
    "photo-1627123424574-10b995aabc35",
    "photo-1548036328-c9fa89d128fa",
  ],
  "heritage-rolltop": [
    "photo-1491637639811-60e2756cc1c7",
    "photo-1547949003-979cc4e533c6",
    "photo-1578662996442-48f60103fc96",
    "photo-1553062407-98eeb64c6a62",
  ],
  "carbon-slim-wallet": [
    "photo-1564422170194-896b89128c79",
    "photo-1627123424574-10b995aabc35",
    "photo-1590874101-5c2440707502",
  ],
};

/** Default travel/backpack set when slug is unknown */
const DEFAULT_BAG_PHOTOS = [
  "photo-1553062407-98eeb64c6a62",
  "photo-1547949003-979cc4e533c6",
  "photo-1590874101-5c2440707502",
  "photo-1491637639811-60e2756cc1c7",
] as const;

/** Category hero images for shop/marketing */
export const CATEGORY_BAG_IMAGES: Record<string, string> = {
  Travel:  "photo-1553062407-98eeb64c6a62",
  Office:  "photo-1627123424574-10b995aabc35",
  Fashion: "photo-1594633312681-425c7b97ccd1",
  Gym:     "photo-1581605405669-fcdf81165afa",
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
