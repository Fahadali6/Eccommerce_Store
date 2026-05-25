"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/lib/data";
import { getLocalProductImages } from "@/lib/imageStorage";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type SortKey = "featured"|"price-asc"|"price-desc"|"rating"|"trending"|"newest";
interface Filters {
  category: string[]; material: string[];
  size: string[]; maxPrice: number; sort: SortKey;
}
const INIT: Filters = { category:[], material:[], size:[], maxPrice:500, sort:"featured" };

function applyFilters(products: Product[], f: Filters): Product[] {
  let r = [...products];
  if (f.category.length) r = r.filter(p => f.category.includes(p.category));
  if (f.material.length) r = r.filter(p => f.material.includes(p.material));
  if (f.size.length)     r = r.filter(p => f.size.includes(p.size));
  r = r.filter(p => p.price <= f.maxPrice);
  if (f.sort==="price-asc")  r.sort((a,b)=>a.price-b.price);
  if (f.sort==="price-desc") r.sort((a,b)=>b.price-a.price);
  if (f.sort==="rating")     r.sort((a,b)=>b.rating-a.rating);
  if (f.sort==="trending")   r=[...r.filter(p=>p.trending),...r.filter(p=>!p.trending)];
  if (f.sort==="newest")     r.reverse();
  if (f.sort==="featured")   r=[...r.filter(p=>p.featured),...r.filter(p=>!p.featured)];
  return r;
}

function ShopInner() {
  const params = useSearchParams();
  const [filters, setFilters]     = useState<Filters>(INIT);
  const [loading, setLoading]     = useState(false);
  const [allProducts, setAll]     = useState<Product[]>(PRODUCTS);

  // Load locally-stored images (dev mode)
  useEffect(() => {
    const enriched = PRODUCTS.map(p => {
      if (p.images.length > 0) return p;
      const local = getLocalProductImages(p.id);
      return local.length > 0 ? { ...p, images: local } : p;
    });
    setAll(enriched);
  }, []);

  useEffect(() => {
    const cat  = params.get("cat");
    const sort = params.get("sort") as SortKey | null;
    setFilters(prev => ({
      ...prev,
      category: cat ? [cat] : prev.category,
      sort: sort ?? prev.sort,
    }));
  }, [params]);

  const products = applyFilters(allProducts, filters);

  function toggle(key: "category"|"material"|"size", val: string) {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(val)
        ? prev[key].filter(v => v !== val)
        : [...prev[key], val],
    }));
    setLoading(true);
    setTimeout(() => setLoading(false), 280);
  }

  const cats  = [...new Set(PRODUCTS.map(p => p.category))];
  const mats  = [...new Set(PRODUCTS.map(p => p.material))];
  const sizes = ["Small","Medium","Large"];

  const Check = ({ label, checked, onClick }: { label:string; checked:boolean; onClick:()=>void }) => (
    <label onClick={onClick} className="flex items-center gap-2.5 cursor-pointer group mb-2.5">
      <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          background:  checked ? "var(--gold)" : "var(--bg-white)",
          border:      checked ? "1.5px solid var(--gold)" : "1.5px solid var(--border-dark)",
        }}>
        {checked && <span className="text-white text-[9px] font-black">✓</span>}
      </div>
      <span className="text-sm transition-colors"
        style={{ color: checked ? "var(--text)" : "var(--text-sec)" }}>{label}</span>
    </label>
  );

  const Group = ({ title, children }: { title:string; children:React.ReactNode }) => (
    <div className="mb-6">
      <p className="label mb-3" style={{ fontSize:"10px" }}>{title}</p>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen section-subtle pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-10 pt-4">
          <h1 className="text-5xl font-black font-serif mb-2">Shop All Bags</h1>
          <p className="text-sm" style={{ color:"var(--text-muted)" }}>{products.length} products found</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-60 flex-shrink-0">
            <div className="card-flat section-white rounded-2xl p-6 sticky top-24">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2 font-semibold text-sm" style={{ color:"var(--text)" }}>
                  <SlidersHorizontal size={15} style={{ color:"var(--gold)" }} />Filters
                </div>
                <button onClick={() => { setFilters(INIT); setLoading(true); setTimeout(()=>setLoading(false),280); }}
                  className="flex items-center gap-1 text-xs transition-colors hover:opacity-70"
                  style={{ color:"var(--gold)" }}>
                  <RotateCcw size={11} />Clear all
                </button>
              </div>
              <div className="divider mb-5" />

              <Group title="Category">
                {cats.map(c => <Check key={c} label={c} checked={filters.category.includes(c)} onClick={() => toggle("category",c)} />)}
              </Group>
              <Group title="Material">
                {mats.map(m => <Check key={m} label={m} checked={filters.material.includes(m)} onClick={() => toggle("material",m)} />)}
              </Group>
              <Group title="Size">
                {sizes.map(s => <Check key={s} label={s} checked={filters.size.includes(s)} onClick={() => toggle("size",s)} />)}
              </Group>
              <Group title="Max Price">
                <div className="flex justify-between text-xs mb-2" style={{ color:"var(--text-muted)" }}>
                  <span>$0</span>
                  <span className="font-semibold" style={{ color:"var(--gold)" }}>${filters.maxPrice}</span>
                </div>
                <input type="range" min={50} max={500} step={10} value={filters.maxPrice}
                  onChange={e => { setFilters(p=>({...p,maxPrice:+e.target.value})); setLoading(true); setTimeout(()=>setLoading(false),280); }}
                  className="w-full cursor-pointer" style={{ accentColor:"var(--gold)" }} />
              </Group>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm" style={{ color:"var(--text-muted)" }}>
                {filters.category.length > 0 && (
                  <span className="font-medium" style={{ color:"var(--text)" }}>
                    {filters.category.join(", ")} ·{" "}
                  </span>
                )}
                {products.length} results
              </p>
              <select
                value={filters.sort}
                onChange={e => setFilters(p => ({...p, sort:e.target.value as SortKey}))}
                className="input text-sm"
                style={{ width:"auto", padding:"8px 14px" }}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="trending">Trending</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-3 gap-5">
                {Array.from({length:6}).map((_,i) => (
                  <div key={i} className="card-flat rounded-2xl overflow-hidden section-white">
                    <div className="skeleton h-56" />
                    <div className="p-4 space-y-2">
                      <div className="skeleton h-3 w-1/3 rounded" />
                      <div className="skeleton h-5 w-3/4 rounded" />
                      <div className="skeleton h-4 w-1/2 rounded" />
                      <div className="skeleton h-10 w-full rounded mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-3 gap-5">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-5"
                  style={{ background:"var(--bg-muted)" }}>🔍</div>
                <h3 className="text-xl font-bold font-serif mb-2" style={{ color:"var(--text)" }}>
                  No products found
                </h3>
                <p className="text-sm mb-6" style={{ color:"var(--text-muted)" }}>
                  Try adjusting your filters
                </p>
                <button onClick={() => setFilters(INIT)} className="btn-outline text-sm">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShopClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen section-subtle pt-24 flex items-center justify-center">
        <p style={{ color:"var(--text-muted)" }}>Loading shop...</p>
      </div>
    }>
      <ShopInner />
    </Suspense>
  );
}
