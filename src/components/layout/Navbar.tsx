"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag, Heart, Search, Menu, X,
  Sun, Moon, ChevronDown,
} from "lucide-react";
import { useStore } from "@/context/store";
import { smartSearch } from "@/lib/aiEngine";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const NAV_LINKS = [
  { href: "/home",    label: "Home" },
  { href: "/shop",    label: "Shop",    hasDropdown: true },
  { href: "/about",   label: "About" },
  { href: "/contact", label: "Contact" },
];

const SHOP_CATS = [
  { label: "Travel Bags",  href: "/shop?cat=Travel%20Bags",  emoji: "🧳" },
  { label: "Office Bags",  href: "/shop?cat=Office%20Bags",  emoji: "💼" },
  { label: "Gym Bags",     href: "/shop?cat=Gym%20Bags",     emoji: "🏋️" },
  { label: "Fashion Bags", href: "/shop?cat=Fashion%20Bags", emoji: "👜" },
  { label: "Ladies Bags",  href: "/shop?cat=Ladies%20Bags",  emoji: "👛" },
  { label: "Backpacks",    href: "/shop?cat=Backpacks",      emoji: "🎒" },
  { label: "Laptop Bags",  href: "/shop?cat=Laptop%20Bags",  emoji: "💻" },
  { label: "All Bags",     href: "/shop",                    emoji: "🛍️" },
];

export function Navbar() {
  const pathname  = usePathname();
  const cartCount = useStore(s => s.cart.reduce((a, i) => a + i.qty, 0));

  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [shopOpen,    setShopOpen]    = useState(false);
  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState<Product[]>([]);
  const [darkMode,    setDarkMode]    = useState(false);

  const searchRef  = useRef<HTMLDivElement>(null);
  const shopRef    = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  // Scroll handler
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Dark mode
  useEffect(() => {
    const saved = localStorage.getItem("vaulta-dark") === "true";
    setDarkMode(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  const toggleDark = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("vaulta-dark", String(next));
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  // Search
  useEffect(() => {
    setResults(query.length > 1 ? smartSearch(query) : []);
  }, [query]);

  // Click outside
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false); setQuery("");
      }
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <nav className={cn("navbar", scrolled && "navbar-scrolled")}>
        <div className="container">
          <div className="flex items-center h-[68px] gap-6">

            {/* Logo */}
            <Link href="/home" className="flex items-center gap-2.5 flex-shrink-0 group mr-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
                style={{ background: "var(--text)" }}>
                <span className="text-white font-black text-lg" style={{ fontFamily:"'Playfair Display',serif" }}>V</span>
              </div>
              <span className="font-black text-[22px] tracking-[2px] hidden sm:block"
                style={{ fontFamily:"'Playfair Display',serif", color:"var(--text)" }}>
                VAULTA
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1 flex-1">
              {NAV_LINKS.map(link => (
                link.hasDropdown ? (
                  <div key={link.href} ref={shopRef} className="relative">
                    <button
                      onClick={() => setShopOpen(o => !o)}
                      className={cn("nav-link flex items-center gap-1", isActive(link.href) && "active")}
                    >
                      {link.label}
                      <ChevronDown size={14} className={cn("transition-transform", shopOpen && "rotate-180")} />
                    </button>

                    {/* Dropdown */}
                    {shopOpen && (
                      <div className="absolute top-full left-0 mt-2 w-52 card-flat rounded-2xl overflow-hidden z-50"
                        style={{ boxShadow:"var(--shadow-lg)", animation:"fadeUp 0.2s ease both" }}>
                        {SHOP_CATS.map(cat => (
                          <Link key={cat.href} href={cat.href}
                            onClick={() => setShopOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors"
                            style={{ color:"var(--text-sec)", borderBottom:"1px solid var(--border)" }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.background = "var(--gold-pale)";
                              (e.currentTarget as HTMLElement).style.color = "var(--gold)";
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                              (e.currentTarget as HTMLElement).style.color = "var(--text-sec)";
                            }}
                          >
                            <span>{cat.emoji}</span>{cat.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={link.href} href={link.href}
                    className={cn("nav-link", isActive(link.href) && "active")}>
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1 ml-auto">

              {/* Search */}
              <div ref={searchRef} className="relative">
                {searchOpen ? (
                  // <div className="flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all"
                  //   style={{
                  //     width:"280px", background:"var(--bg-input)",
                  //     border:"1.5px solid var(--gold)",
                  //     boxShadow:"0 0 0 3px rgba(184,134,11,0.1)",
                  //   }}>
                  <div
                   className="flex items-center gap-2 px-3.5 py-1 rounded-full transition-all"
                   style={{
                   width: "280px",
                   background: "transparent",
                   border: "1px solid var(--gold)",
                   }}>
                    <Search size={15} style={{ color:"var(--text-muted)", flexShrink:0 }} />
                    {/* <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                      placeholder="Search bags, materials..."
                      className="bg-transparent outline-none text-sm flex-1 font-sans border-none"
                      style={{ color:"var(--text)",      
                               boxShadow: "none",
                               background: "transparent", }} /> */}
                     <input
                       ref={inputRef}
                       value={query}
                       onChange={(e) => setQuery(e.target.value)}
                       placeholder="Search bags, materials..."
                       className="flex-1 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0"
                       style={{
                             color: "var(--text)",
                              border: "none",
                              outline: "none",
                             boxShadow: "none", }}/>          
                    <button onClick={() => { setSearchOpen(false); setQuery(""); }}
                      style={{ color:"var(--text-muted)" }} className="hover:opacity-70 transition-opacity">
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setSearchOpen(true)} className="btn-icon">
                    <Search size={18} />
                  </button>
                )}

                {/* Search results */}
                {results.length > 0 && searchOpen && (
                  <div className="absolute top-full mt-2 left-0 w-80 card-flat overflow-hidden z-50"
                    style={{ boxShadow:"var(--shadow-xl)", animation:"fadeUp 0.2s ease both" }}>
                    <div className="px-4 py-2.5 border-b" style={{ borderColor:"var(--border)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color:"var(--text-muted)" }}>
                        {results.length} results for &ldquo;{query}&rdquo;
                      </p>
                    </div>
                    {results.map(p => (
                      <Link key={p.id} href={`/product/${p.slug}`}
                        onClick={() => { setSearchOpen(false); setQuery(""); }}
                        className="flex items-center gap-3 px-4 py-3 transition-colors border-b last:border-0"
                        style={{ borderColor:"var(--border)" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-subtle)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://picsum.photos/seed/vaulta${p.imageId}/48/48`} alt={p.name}
                          className="w-11 h-11 rounded-xl object-cover flex-shrink-0" loading="lazy" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate" style={{ color:"var(--text)" }}>{p.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold" style={{ color:"var(--gold)" }}>${p.price}</p>
                            <span className="text-[10px]" style={{ color:"var(--text-faint)" }}>· {p.category}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link href={`/shop?q=${query}`}
                      onClick={() => { setSearchOpen(false); setQuery(""); }}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold transition-colors"
                      style={{ color:"var(--gold)", background:"var(--gold-pale)" }}>
                      View all results for &ldquo;{query}&rdquo; →
                    </Link>
                  </div>
                )}
              </div>

              {/* Dark mode */}
              <button onClick={toggleDark} className="btn-icon hidden md:flex" title="Toggle theme">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="btn-icon hidden sm:flex">
                <Heart size={18} />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative btn-icon"
                style={{ background:"var(--gold-pale)", color:"var(--gold)" }}>
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 text-[10px] font-black rounded-full flex items-center justify-center text-white animate-scale-in"
                    style={{ background:"var(--gold)" }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Admin */}
              <Link href="/admin"
                className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl ml-1 transition-all"
                style={{ color:"var(--gold)", background:"var(--gold-pale)", border:"1px solid var(--gold-border)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.8"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}>
                Admin
              </Link>

              {/* Mobile menu button */}
              <button onClick={() => setMobileOpen(o => !o)}
                className="btn-icon lg:hidden ml-1">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99]" style={{ background:"rgba(0,0,0,0.4)", backdropFilter:"blur(4px)" }}
          onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 max-w-[85vw] z-[100] flex flex-col transition-transform duration-300 lg:hidden",
        mobileOpen ? "translate-x-0" : "translate-x-full"
      )} style={{ background:"var(--bg-white)", boxShadow:"var(--shadow-xl)" }}>

        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom:"1px solid var(--border)" }}>
          <Link href="/home" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:"var(--text)" }}>
              <span className="text-white font-black text-sm" style={{ fontFamily:"'Playfair Display',serif" }}>V</span>
            </div>
            <span className="font-black text-lg tracking-[2px]"
              style={{ fontFamily:"'Playfair Display',serif", color:"var(--text)" }}>VAULTA</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Drawer links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn("flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all",
                isActive(link.href) ? "text-gold" : "text-secondary")}
              style={{
                color: isActive(link.href) ? "var(--gold)" : "var(--text-sec)",
                background: isActive(link.href) ? "var(--gold-pale)" : "transparent",
              }}>
              {link.label}
            </Link>
          ))}

          <div className="divider my-4" />

          {SHOP_CATS.map(cat => (
            <Link key={cat.href} href={cat.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all"
              style={{ color:"var(--text-sec)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-subtle)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
              <span>{cat.emoji}</span>{cat.label}
            </Link>
          ))}
        </div>

        {/* Drawer footer */}
        <div className="px-6 py-5 space-y-3" style={{ borderTop:"1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <Link href="/wishlist" onClick={() => setMobileOpen(false)}
              className="btn-outline btn-sm flex-1 flex items-center justify-center gap-2">
              <Heart size={15} />Wishlist
            </Link>
            <button onClick={toggleDark} className="btn-icon">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <Link href="/admin" onClick={() => setMobileOpen(false)}
            className="block text-center text-sm font-semibold py-2.5 rounded-xl transition-all"
            style={{ color:"var(--gold)", background:"var(--gold-pale)" }}>
            Admin Panel →
          </Link>
        </div>
      </div>
    </>
  );
}
