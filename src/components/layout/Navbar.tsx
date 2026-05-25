"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, Search, Menu, X } from "lucide-react";
import { useStore } from "@/context/store";
import { smartSearch } from "@/lib/aiEngine";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const LINKS = [
  { href:"/home",    label:"Home" },
  { href:"/shop",    label:"Shop" },
  { href:"/about",   label:"About" },
  { href:"/contact", label:"Contact" },
];

export function Navbar() {
  const pathname  = usePathname();
  const cartCount = useStore(s => s.cart.reduce((a,i) => a + i.qty, 0));
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobile] = useState(false);
  const [searchOpen, setSearch] = useState(false);
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setResults(query.length > 1 ? smartSearch(query) : []); }, [query]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) { setSearch(false); setQuery(""); }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <nav className={cn("fixed top-0 inset-x-0 z-50 transition-all duration-300 navbar", scrolled && "navbar-scrolled")}>
      <div className="max-w-[1400px] mx-auto px-6 h-[68px] flex items-center gap-8">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:"var(--text)" }}>
            <span className="text-white font-black text-base font-serif">V</span>
          </div>
          <span className="font-black text-xl tracking-[2.5px] font-serif" style={{ color:"var(--text)" }}>VAULTA</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {LINKS.map(l => {
            const active = pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href}
                className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  active ? "font-semibold" : "hover:opacity-80")}
                style={{
                  color:      active ? "var(--gold)" : "var(--text-sec)",
                  background: active ? "var(--gold-pale)" : "transparent",
                }}>
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative" ref={searchRef}>
          {searchOpen ? (
            <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 w-72"
              style={{ background:"var(--bg-white)", border:"1.5px solid var(--gold)", boxShadow:"0 0 0 3px rgba(184,134,11,0.08)" }}>
              <Search size={15} style={{ color:"var(--text-muted)", flexShrink:0 }} />
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search bags, materials..." className="bg-transparent outline-none text-sm flex-1 font-sans"
                style={{ color:"var(--text)" }} />
              <button onClick={() => { setSearch(false); setQuery(""); }} style={{ color:"var(--text-muted)" }}>
                <X size={15} />
              </button>
            </div>
          ) : (
            <button onClick={() => setSearch(true)} className="btn-ghost p-2">
              <Search size={19} />
            </button>
          )}
          {results.length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-80 card-flat rounded-2xl overflow-hidden z-50"
              style={{ boxShadow:"var(--shadow-lg)" }}>
              {results.map(p => (
                <Link key={p.id} href={`/product/${p.slug}`}
                  onClick={() => { setSearch(false); setQuery(""); }}
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ borderBottom:"1px solid var(--border)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background="var(--bg-subtle)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background="transparent"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://picsum.photos/seed/vaulta${p.imageId}/40/40`} alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color:"var(--text)" }}>{p.name}</p>
                    <p className="text-xs" style={{ color:"var(--gold)" }}>${p.price} · {p.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1">
          <Link href="/wishlist" className="btn-ghost p-2"><Heart size={19} /></Link>
          <Link href="/cart" className="relative btn-ghost p-2">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-[10px] font-black rounded-full flex items-center justify-center"
                style={{ background:"var(--gold)", color:"#fff" }}>
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/admin" className="hidden md:flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg ml-1"
            style={{ color:"var(--gold)", background:"var(--gold-pale)", border:"1px solid #E8D5A3" }}>
            Admin
          </Link>
          <button onClick={() => setMobile(!mobileOpen)} className="md:hidden btn-ghost p-2">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 py-5 flex flex-col gap-1 section-white"
          style={{ borderTop:"1px solid var(--border)", boxShadow:"var(--shadow-md)" }}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobile(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium"
              style={{ color: pathname.startsWith(l.href) ? "var(--gold)" : "var(--text-sec)",
                       background: pathname.startsWith(l.href) ? "var(--gold-pale)" : "transparent" }}>
              {l.label}
            </Link>
          ))}
          <Link href="/admin" onClick={() => setMobile(false)} className="px-4 py-2.5 text-sm font-semibold mt-1"
            style={{ color:"var(--gold)" }}>Admin Panel →</Link>
        </div>
      )}
    </nav>
  );
}
