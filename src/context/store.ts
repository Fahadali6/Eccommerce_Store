"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem } from "@/types";
import { COUPONS } from "@/lib/data";

interface Store {
  // Cart
  cart: CartItem[];
  wishlist: number[];
  couponCode: string;
  discount: number;
  addToCart(product: Product, qty?: number): void;
  removeFromCart(id: number): void;
  updateQty(id: number, qty: number): void;
  clearCart(): void;
  toggleWishlist(id: number): void;
  isWishlisted(id: number): boolean;
  applyCoupon(code: string): "ok" | "invalid";
  clearCoupon(): void;
  // App
  recentlyViewed: Product[];
  addToRecentlyViewed(p: Product): void;
  userCategories: string[];
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // ── Cart ──────────────────────────────────────────────
      cart: [],
      wishlist: [],
      couponCode: "",
      discount: 0,

      addToCart(product, qty = 1) {
        set(s => {
          const found = s.cart.find(i => i.id === product.id);
          if (found) {
            return { cart: s.cart.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i) };
          }
          return { cart: [...s.cart, { ...product, qty }] };
        });
      },

      removeFromCart(id) {
        set(s => ({ cart: s.cart.filter(i => i.id !== id) }));
      },

      updateQty(id, qty) {
        if (qty < 1) { get().removeFromCart(id); return; }
        set(s => ({ cart: s.cart.map(i => i.id === id ? { ...i, qty } : i) }));
      },

      clearCart() { set({ cart: [] }); },

      toggleWishlist(id) {
        set(s => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter(w => w !== id)
            : [...s.wishlist, id],
        }));
      },

      isWishlisted(id) { return get().wishlist.includes(id); },

      applyCoupon(code) {
        const d = COUPONS[code.toUpperCase()];
        if (d !== undefined) {
          set({ couponCode: code.toUpperCase(), discount: d });
          return "ok";
        }
        return "invalid";
      },

      clearCoupon() { set({ couponCode: "", discount: 0 }); },

      // ── App ───────────────────────────────────────────────
      recentlyViewed: [],
      userCategories: [],

      addToRecentlyViewed(p) {
        set(s => {
          const filtered = s.recentlyViewed.filter(x => x.id !== p.id);
          const cats = [...new Set([p.category, ...s.userCategories])].slice(0, 5);
          return {
            recentlyViewed: [p, ...filtered].slice(0, 8),
            userCategories: cats,
          };
        });
      },
    }),
    {
      name: "vaulta-store",
      partialize: s => ({
        cart:           s.cart,
        wishlist:       s.wishlist,
        recentlyViewed: s.recentlyViewed,
        userCategories: s.userCategories,
      }),
    }
  )
);

// ── Derived ───────────────────────────────────────────────────
export function useCartTotals() {
  const { cart, discount } = useStore();
  const subtotal    = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const cartCount   = cart.reduce((a, i) => a + i.qty, 0);
  const shipping    = subtotal > 150 ? 0 : 15;
  const discountAmt = subtotal * discount;
  const total       = subtotal - discountAmt + shipping;
  return { subtotal, cartCount, shipping, discountAmt, total };
}
