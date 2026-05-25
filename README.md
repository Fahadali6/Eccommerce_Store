# VAULTA — Premium Bag Store

> AI-powered ecommerce built with Next.js 14 App Router, Tailwind CSS, TypeScript & Zustand.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000  (redirects to /home)
# → http://localhost:3000/admin  (login: admin / vaulta2025)
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              ← Root layout (fonts + Providers)
│   ├── page.tsx                ← Redirects / → /home
│   ├── globals.css
│   │
│   ├── (store)/                ← Route group: Navbar + Footer
│   │   ├── layout.tsx
│   │   ├── home/page.tsx       → /home
│   │   ├── shop/               → /shop
│   │   ├── product/[slug]/     → /product/:slug
│   │   ├── cart/               → /cart
│   │   ├── checkout/           → /checkout
│   │   ├── order-success/      → /order-success
│   │   ├── wishlist/           → /wishlist
│   │   ├── about/              → /about
│   │   └── contact/            → /contact
│   │
│   ├── (admin)/                ← Route group: no Navbar/Footer
│   │   └── admin/page.tsx      → /admin
│   │
│   └── api/
│       ├── products/route.ts   → GET/POST /api/products
│       ├── orders/route.ts     → GET/POST /api/orders
│       └── reviews/route.ts    → GET/POST /api/reviews
│
├── components/
│   ├── layout/Navbar.tsx       Smart navbar + search + cart badge
│   ├── layout/Footer.tsx
│   └── ui/ProductCard.tsx      Real images from picsum.photos
│
├── context/
│   ├── store.ts                Zustand store (cart + wishlist + app)
│   └── Providers.tsx           Dark mode sync
│
├── lib/
│   ├── data.ts                 All product, order, seed data
│   ├── aiEngine.ts             Smart search + recommendations
│   └── utils.ts                formatPrice, productImageUrl, cn
│
└── types/index.ts
```

---

## 🔑 Key URLs

| URL | Page |
|-----|------|
| `/home` | Homepage with AI picks |
| `/shop` | Shop with filters + sort |
| `/shop?cat=Travel` | Pre-filtered by category |
| `/product/summit-ridge-backpack` | Product detail |
| `/cart` | Cart with coupons |
| `/checkout` | Checkout (Stripe-ready) |
| `/order-success` | Confirmation |
| `/wishlist` | Saved products |
| `/about` | Brand story |
| `/contact` | Contact form |
| `/admin` | Admin panel |

---

## 🛒 Cart & Coupons

```
Coupon Codes:
VAULTA20  →  20% off
FIRST10   →  10% off
SAVE15    →  15% off

Free shipping on orders over $150
```

---

## 🧠 AI Features

- **Smart Search** — Synonym expansion (bag→backpack), multi-field scoring
- **Recommendations** — Category match (+30), tag overlap (+10ea), price range (+15), recency boost
- **Personalized Homepage** — Shows AI picks after browsing, defaults to editor's picks
- **Recently Viewed** — Appears on homepage after viewing products

---

## 🖼 Images

Real photos from [picsum.photos](https://picsum.photos) keyed by `product.imageId`.
Replace with your own CDN/Supabase storage URLs in production.

---

## 👨‍💼 Admin Panel

URL: `/admin` · Login: `admin` / `vaulta2025`

- **Dashboard** — Revenue KPIs, bar chart, top products, recent orders
- **Products** — Add/delete products, stock warnings
- **Orders** — Status management (Pending → Delivered)
- **Users** — Customer table with spend tracking
- **Analytics** — Revenue trend, category breakdown

---

## 🚀 Deploy

```bash
# Vercel (recommended)
npm i -g vercel
vercel

# Add environment variables in Vercel dashboard
```
