"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, RotateCcw, Grid3X3, List } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/lib/data";
import { getLocalProductImages } from "@/lib/imageStorage";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type SortKey = "featured"|"price-asc"|"price-desc"|"rating"|"trending"|"newest";
interface Filters { category:string[]; material:string[]; size:string[]; maxPrice:number; sort:SortKey; }
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

function CheckFilter({ label, checked, count, onClick }: {
  label:string; checked:boolean; count?:number; onClick:()=>void;
}) {
  return (
    <label onClick={onClick}
      className="flex items-center justify-between gap-3 cursor-pointer group py-1.5">
      <div className="flex items-center gap-2.5">
        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: checked ? "var(--gold)" : "transparent",
            border: checked ? "1.5px solid var(--gold)" : "1.5px solid var(--border-dark)",
          }}>
          {checked && <span className="text-white text-[9px] font-black">✓</span>}
        </div>
        <span className="text-sm transition-colors"
          style={{ color: checked ? "var(--text)" : "var(--text-sec)", fontWeight: checked ? 600 : 400 }}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full"
          style={{ background: "var(--bg-muted)", color: "var(--text-muted)" }}>
          {count}
        </span>
      )}
    </label>
  );
}

function FilterGroup({ title, children }: { title:string; children:React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-6">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full mb-3 group">
        <span className="label" style={{ fontSize:"10px" }}>{title}</span>
        <span className="text-xs transition-transform" style={{ color:"var(--text-muted)", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function ShopInner() {
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>(INIT);
  const [allProducts, setAll] = useState<Product[]>(PRODUCTS);
  const [gridView, setGridView] = useState<"grid"|"list">("grid");
  const [loading, setLoading]   = useState(false);

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
    const sort = params.get("sort") as SortKey|null;
    if (cat || sort) {
      // Decode URL-encoded category names like "Travel%20Bags" → "Travel Bags"
      const decoded = cat ? decodeURIComponent(cat) : null;
      setFilters(prev => ({ ...prev, category: decoded ? [decoded] : prev.category, sort: sort ?? prev.sort }));
    }
  }, [params]);

  const products = applyFilters(allProducts, filters);

  function toggle(key: "category"|"material"|"size", val: string) {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(v => v!==val) : [...prev[key], val],
    }));
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  }

  const cats  = [...new Set(PRODUCTS.map(p => p.category))];
  const mats  = [...new Set(PRODUCTS.map(p => p.material))];
  const sizes = ["Small","Medium","Large"];

  const catCounts  = Object.fromEntries(cats.map(c => [c, PRODUCTS.filter(p => p.category === c).length]));
  const matCounts  = Object.fromEntries(mats.map(m => [m, PRODUCTS.filter(p => p.material === m).length]));

  const activeFilters = [
    ...filters.category.map(c => ({ type:"category", val:c })),
    ...filters.material.map(m => ({ type:"material", val:m })),
    ...filters.size.map(s => ({ type:"size", val:s })),
    ...(filters.maxPrice < 500 ? [{ type:"price", val:`Under $${filters.maxPrice}` }] : []),
  ];

  return (
    <div className="min-h-screen" style={{ background:"var(--bg)" }}>
      {/* Header */}
      <div style={{ background:"var(--bg-white)", borderBottom:"1px solid var(--border)" }}>
        <div className="container py-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="label mb-2">Our Collection</p>
              <h1 className="text-5xl font-black font-serif">Shop All Bags</h1>
              <p className="text-sm mt-2" style={{ color:"var(--text-muted)" }}>
                {products.length} premium products
                {filters.category.length > 0 && ` in ${filters.category.join(", ")}`}
              </p>
            </div>
            {/* View toggle */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl"
              style={{ background:"var(--bg-subtle)", border:"1px solid var(--border)" }}>
              <button onClick={() => setGridView("grid")}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{ background: gridView==="grid" ? "var(--bg-white)" : "transparent",
                         color: gridView==="grid" ? "var(--gold)" : "var(--text-muted)",
                         boxShadow: gridView==="grid" ? "var(--shadow-sm)" : "none" }}>
                <Grid3X3 size={16} />
              </button>
              <button onClick={() => setGridView("list")}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{ background: gridView==="list" ? "var(--bg-white)" : "transparent",
                         color: gridView==="list" ? "var(--gold)" : "var(--text-muted)",
                         boxShadow: gridView==="list" ? "var(--shadow-sm)" : "none" }}>
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeFilters.map((f, i) => (
                <button key={i}
                  onClick={() => {
                    if (f.type === "price") setFilters(p => ({ ...p, maxPrice:500 }));
                    else toggle(f.type as "category"|"material"|"size", f.val);
                  }}
                  className="badge badge-gold flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                  {f.val} <span className="text-xs">×</span>
                </button>
              ))}
              <button onClick={() => setFilters(INIT)}
                className="badge badge-gray flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                Clear all ×
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden md:block">
            <div className="sticky top-24 rounded-3xl p-6"
              style={{ background:"var(--bg-white)", border:"1px solid var(--border)", boxShadow:"var(--shadow-sm)" }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 font-semibold text-sm" style={{ color:"var(--text)" }}>
                  <SlidersHorizontal size={15} style={{ color:"var(--gold)" }} />Filters
                </div>
                <button onClick={() => setFilters(INIT)}
                  className="flex items-center gap-1 text-xs transition-colors hover:opacity-70"
                  style={{ color:"var(--gold)" }}>
                  <RotateCcw size={11} />Reset
                </button>
              </div>
              <div className="divider mb-5" />

              <FilterGroup title="Category">
                {cats.map(c => (
                  <CheckFilter key={c} label={c} checked={filters.category.includes(c)}
                    count={catCounts[c]} onClick={() => toggle("category", c)} />
                ))}
              </FilterGroup>

              <FilterGroup title="Material">
                {mats.map(m => (
                  <CheckFilter key={m} label={m} checked={filters.material.includes(m)}
                    count={matCounts[m]} onClick={() => toggle("material", m)} />
                ))}
              </FilterGroup>

              <FilterGroup title="Size">
                <div className="flex gap-2 flex-wrap">
                  {sizes.map(s => (
                    <button key={s} onClick={() => toggle("size", s)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: filters.size.includes(s) ? "var(--gold)" : "var(--bg-muted)",
                        color:      filters.size.includes(s) ? "#fff" : "var(--text-sec)",
                        border:     `1px solid ${filters.size.includes(s) ? "var(--gold)" : "var(--border)"}`,
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Max Price">
                <div className="flex justify-between text-xs mb-3" style={{ color:"var(--text-muted)" }}>
                  <span>$0</span>
                  <span className="font-bold" style={{ color:"var(--gold)" }}>${filters.maxPrice}</span>
                </div>
                <input type="range" min={50} max={500} step={10} value={filters.maxPrice}
                  onChange={e => setFilters(p => ({ ...p, maxPrice:+e.target.value }))}
                  className="w-full cursor-pointer" style={{ accentColor:"var(--gold)" }} />
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[150,300,500].map(v => (
                    <button key={v} onClick={() => setFilters(p => ({ ...p, maxPrice:v }))}
                      className="py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: filters.maxPrice===v ? "var(--gold-pale)" : "var(--bg-muted)",
                        color: filters.maxPrice===v ? "var(--gold)" : "var(--text-muted)",
                        border: `1px solid ${filters.maxPrice===v ? "var(--gold-border)" : "var(--border)"}`,
                      }}>
                      ${v}
                    </button>
                  ))}
                </div>
              </FilterGroup>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm" style={{ color:"var(--text-muted)" }}>
                Showing <strong style={{ color:"var(--text)" }}>{products.length}</strong> products
              </p>
              <select value={filters.sort}
                onChange={e => setFilters(p => ({ ...p, sort:e.target.value as SortKey }))}
                className="input text-sm" style={{ width:"auto", padding:"8px 14px" }}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="trending">Trending</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {loading ? (
              <div className={cn("grid gap-5", gridView==="grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
                {Array.from({length:6}).map((_, i) => (
                  <div key={i} className="rounded-3xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
                    <div className="skeleton" style={{ height:"240px" }} />
                    <div className="p-4 space-y-3" style={{ background:"var(--bg-card)" }}>
                      <div className="skeleton rounded" style={{ height:"12px", width:"40%" }} />
                      <div className="skeleton rounded" style={{ height:"20px", width:"75%" }} />
                      <div className="skeleton rounded" style={{ height:"36px" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={cn("grid gap-5", gridView==="grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6"
                  style={{ background:"var(--bg-muted)" }}>🔍</div>
                <h3 className="text-2xl font-bold font-serif mb-3" style={{ color:"var(--text)" }}>No products found</h3>
                <p className="text-sm mb-8" style={{ color:"var(--text-muted)" }}>Try different filters or browse all products</p>
                <button onClick={() => setFilters(INIT)} className="btn-gold">Clear All Filters</button>
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
      <div className="min-h-screen flex items-center justify-center" style={{ background:"var(--bg)" }}>
        <div className="text-center">
          <div className="spin inline-block w-10 h-10 rounded-full border-4 mb-4"
            style={{ borderColor:"var(--border)", borderTopColor:"var(--gold)" }} />
          <p style={{ color:"var(--text-muted)" }}>Loading shop...</p>
        </div>
      </div>
    }>
      <ShopInner />
    </Suspense>
  );
}
