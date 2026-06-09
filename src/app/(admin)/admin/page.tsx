"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye, EyeOff, LayoutDashboard, Package, ShoppingCart,
  Users, TrendingUp, LogOut, ArrowLeft, Plus, Trash2,
  Edit3, X, ImageIcon, Save, ChevronDown,
} from "lucide-react";
import { PRODUCTS, ORDERS, REVENUE } from "@/lib/data";
import { formatPrice, slugify, getProductImageUrl } from "@/lib/utils";
import { getLocalProductImages } from "@/lib/imageStorage";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Product, Order, OrderStatus, ProductImage } from "@/types";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

type Section = "dashboard" | "products" | "orders" | "users" | "analytics";

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending:    "badge badge-amber",
  Processing: "badge bg-blue-100 text-blue-700",
  Shipped:    "badge bg-purple-100 text-purple-700",
  Delivered:  "badge badge-green",
  Cancelled:  "badge badge-red",
};

const USERS_MOCK = [
  { name:"James Morrison",  email:"james@ex.com",  orders:3, spent:1240, active:true  },
  { name:"Amara Diallo",    email:"amara@ex.com",  orders:2, spent:550,  active:true  },
  { name:"Chen Wei",         email:"chen@ex.com",   orders:5, spent:2100, active:true  },
  { name:"Priya Sharma",    email:"priya@ex.com",  orders:1, spent:425,  active:false },
  { name:"Lucas Ferreira",  email:"lucas@ex.com",  orders:4, spent:1680, active:true  },
];

// ─────────────────────────────────────────────────────────────
// MODULE-LEVEL HELPER COMPONENTS
// These MUST be defined outside any other component to prevent
// React from treating them as new types on every re-render,
// which would cause inputs to lose focus after each keystroke.
// ─────────────────────────────────────────────────────────────

// ── Table helpers ─────────────────────────────────────────────
function Th({ c }: { c: string }) {
  return (
    <th
      className="text-left text-[10px] font-bold uppercase tracking-wider px-5 py-4 table-header"
      style={{ color:"var(--text-muted)", borderBottom:"1px solid var(--border)" }}
    >
      {c}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td
      className={cn("px-5 py-3.5 text-sm", className)}
      style={{ borderBottom:"1px solid var(--border)" }}
    >
      {children}
    </td>
  );
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ title, value, sub, color = "#B8860B" }: {
  title: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="card-flat section-white rounded-2xl p-6">
      <p className="text-xs font-semibold uppercase tracking-wider mb-4"
        style={{ color:"var(--text-muted)" }}>
        {title}
      </p>
      <p className="text-3xl font-black font-serif" style={{ color }}>{value}</p>
      {sub && <p className="text-xs mt-2" style={{ color:"var(--text-faint)" }}>{sub}</p>}
    </div>
  );
}

// ── Text input field ──────────────────────────────────────────
// Defined at module level so its identity is stable across renders.
// value + onChange passed as props — no closure over form state.
function FormField({
  label, value, onChange, placeholder, type = "text", required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color:"var(--text-muted)" }}
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
}

// ── Textarea field ────────────────────────────────────────────
function FormTextarea({
  label, value, onChange, placeholder, rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <div className="col-span-2">
      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color:"var(--text-muted)" }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="input resize-none"
      />
    </div>
  );
}

// ── Select field ──────────────────────────────────────────────
function FormSelect({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color:"var(--text-muted)" }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Toggle flag ───────────────────────────────────────────────
function FormToggle({
  label, desc, checked, onChange,
}: {
  label: string; desc: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label
      className="flex items-start gap-3 cursor-pointer flex-1 p-4 rounded-xl border-2 transition-all"
      style={{
        borderColor: checked ? "var(--gold)"      : "var(--border)",
        background:  checked ? "var(--gold-pale)" : "var(--bg-white)",
      }}
    >
      <div
        className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
        style={{
          background:  checked ? "var(--gold)"       : "transparent",
          borderColor: checked ? "var(--gold)"       : "var(--border-dark)",
        }}
        onClick={() => onChange(!checked)}
      >
        {checked && <span className="text-white text-[11px] font-black">✓</span>}
      </div>
      <div onClick={() => onChange(!checked)}>
        <p className="text-sm font-semibold" style={{ color:"var(--text)" }}>{label}</p>
        <p className="text-xs" style={{ color:"var(--text-muted)" }}>{desc}</p>
      </div>
    </label>
  );
}

// ─── Revenue Bar Chart ────────────────────────────────────────
function RevenueChart() {
  const maxRev = Math.max(...REVENUE.map(d => d.revenue));
  return (
    <div className="card-flat section-white rounded-2xl p-7">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold font-serif text-lg" style={{ color:"var(--text)" }}>
          Revenue (6 months)
        </h3>
        <span className="badge badge-gold">Last 6 Months</span>
      </div>
      <div className="flex items-end gap-3 h-28">
        {REVENUE.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full rounded-t-md"
              style={{ height:`${(d.revenue/maxRev)*100}%`, minHeight:"4px", background:"var(--gold)" }}
            />
            <span className="text-[10px]" style={{ color:"var(--text-muted)" }}>{d.month}</span>
          </div>
        ))}
      </div>
      <div className="divider mt-5 mb-4" />
      <div className="flex justify-between">
        <div>
          <p className="text-xs" style={{ color:"var(--text-muted)" }}>Total Revenue</p>
          <p className="text-xl font-black font-serif" style={{ color:"var(--gold)" }}>
            {formatPrice(REVENUE.reduce((a, d) => a + d.revenue, 0))}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color:"var(--text-muted)" }}>Total Orders</p>
          <p className="text-xl font-black font-serif" style={{ color:"var(--text)" }}>
            {REVENUE.reduce((a, d) => a + d.orders, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRODUCT FORM — uses stable module-level field components
// ─────────────────────────────────────────────────────────────
interface ProductFormProps {
  initial?: Product;
  onSave:   (p: Product) => void;
  onCancel: () => void;
}

function ProductForm({ initial, onSave, onCancel }: ProductFormProps) {
  const isEdit = !!initial;

  const [images, setImages] = useState<ProductImage[]>(initial?.images ?? []);

  // All form fields as individual state pieces to avoid object spread
  // that would cause full re-renders
  const [name,          setName]          = useState(initial?.name ?? "");
  const [price,         setPrice]         = useState(initial?.price ? String(initial.price) : "");
  const [originalPrice, setOriginalPrice] = useState(initial?.originalPrice ? String(initial.originalPrice) : "");
  const [category,      setCategory]      = useState<string>(initial?.category ?? "Travel Bags");
  const [material,      setMaterial]      = useState(initial?.material ?? "");
  const [color,         setColor]         = useState(initial?.color ?? "");
  const [size,          setSize]          = useState<string>(initial?.size ?? "Medium");
  const [capacity,      setCapacity]      = useState(initial?.capacity ? String(initial.capacity) : "");
  const [stock,         setStock]         = useState(initial?.stock ? String(initial.stock) : "");
  const [laptopFit,     setLaptopFit]     = useState(initial?.laptopFit ?? "");
  const [description,   setDescription]   = useState(initial?.description ?? "");
  const [tags,          setTags]          = useState(initial?.tags?.join(", ") ?? "");
  const [trending,      setTrending]      = useState(initial?.trending ?? false);
  const [featured,      setFeatured]      = useState(initial?.featured ?? false);

  // Load locally-stored images for this product (dev mode)
  useEffect(() => {
    if (initial && initial.images.length === 0) {
      const local = getLocalProductImages(initial.id);
      if (local.length > 0) setImages(local);
    }
  }, [initial]);

  // Stable image change handler
  const handleImagesChange = useCallback((imgs: ProductImage[]) => {
    setImages(imgs);
  }, []);

  function handleSave() {
    if (!name.trim())     { toast.error("Product name is required"); return; }
    if (!price)           { toast.error("Price is required");         return; }
    if (!material.trim()) { toast.error("Material is required");      return; }

    const product: Product = {
      id:            initial?.id ?? Date.now(),
      name:          name.trim(),
      slug:          slugify(name.trim()),
      price:         parseFloat(price) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      category:      (category as Product["category"]),
      material:      material.trim(),
      color:         color.trim() || "Black",
      size:          (size as Product["size"]),
      capacity:      parseInt(capacity) || 0,
      stock:         parseInt(stock) || 0,
      laptopFit:     laptopFit.trim() || null,
      description:   description.trim(),
      tags:          tags.split(",").map(t => t.trim()).filter(Boolean),
      trending,
      featured,
      imageId:       initial?.imageId ?? Math.floor(Math.random() * 200) + 1,
      rating:        initial?.rating      ?? 5.0,
      reviewCount:   initial?.reviewCount ?? 0,
      images,
    };
    onSave(product);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto py-8 px-4"
      style={{ background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)" }}
    >
      <div className="w-full max-w-3xl section-white rounded-3xl shadow-2xl">

        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-6"
          style={{ borderBottom:"1px solid var(--border)" }}
        >
          <div>
            <h2 className="text-2xl font-black font-serif" style={{ color:"var(--text)" }}>
              {isEdit ? `Edit: ${initial!.name}` : "Add New Product"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color:"var(--text-muted)" }}>
              {isEdit ? "Update product details and manage images" : "Fill in details and upload images"}
            </p>
          </div>
          <button onClick={onCancel} className="btn-ghost p-2 rounded-xl"><X size={20} /></button>
        </div>

        <div className="p-8 space-y-8">

          {/* ── 1. Images ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background:"var(--gold-pale)" }}>
                <ImageIcon size={14} style={{ color:"var(--gold)" }} />
              </div>
              <h3 className="font-bold font-serif" style={{ color:"var(--text)" }}>
                Product Images
              </h3>
              <span className="badge badge-gold ml-auto">{images.length} uploaded</span>
            </div>
            <div className="p-5 rounded-2xl"
              style={{ background:"var(--bg-subtle)", border:"1px solid var(--border)" }}>
              <ImageUploader
                productId={initial?.id ?? 0}
                images={images}
                onChange={handleImagesChange}
              />
            </div>
            {images.length === 0 && (
              <p className="text-xs mt-2 flex items-center gap-1.5"
                style={{ color:"var(--text-muted)" }}>
                <span className="text-amber-500">⚠</span>
                No images yet — product will show a placeholder until you upload one.
              </p>
            )}
          </div>

          {/* ── 2. Basic Info ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background:"var(--gold-pale)" }}>
                <Package size={14} style={{ color:"var(--gold)" }} />
              </div>
              <h3 className="font-bold font-serif" style={{ color:"var(--text)" }}>
                Basic Information
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField
                  label="Product Name"
                  value={name}
                  onChange={setName}
                  placeholder="e.g. Summit Ridge Backpack"
                  required
                />
              </div>

              <FormTextarea
                label="Description"
                value={description}
                onChange={setDescription}
                placeholder="Describe the product..."
                rows={3}
              />

              <FormField
                label="Price ($)"
                value={price}
                onChange={setPrice}
                placeholder="299"
                type="number"
                required
              />
              <FormField
                label="Original Price ($)"
                value={originalPrice}
                onChange={setOriginalPrice}
                placeholder="399 (leave empty if no discount)"
                type="number"
              />

              <div className="col-span-2">
                <FormField
                  label="Tags (comma-separated)"
                  value={tags}
                  onChange={setTags}
                  placeholder="Travel, Leather, Waterproof"
                />
              </div>
            </div>
          </div>

          {/* ── 3. Details ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background:"var(--gold-pale)" }}>
                <ChevronDown size={14} style={{ color:"var(--gold)" }} />
              </div>
              <h3 className="font-bold font-serif" style={{ color:"var(--text)" }}>
                Product Details
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormSelect
                label="Category"
                value={category}
                onChange={setCategory}
                options={["Travel Bags","Office Bags","Gym Bags","Fashion Bags","Ladies Bags","Backpacks","Laptop Bags"]}
              />
              <FormSelect
                label="Size"
                value={size}
                onChange={setSize}
                options={["Small","Medium","Large"]}
              />
              <FormField
                label="Material"
                value={material}
                onChange={setMaterial}
                placeholder="Full-Grain Leather"
                required
              />
              <FormField
                label="Color"
                value={color}
                onChange={setColor}
                placeholder="Midnight Black"
              />
              <FormField
                label="Capacity (L)"
                value={capacity}
                onChange={setCapacity}
                placeholder="30"
                type="number"
              />
              <FormField
                label="Laptop Fit"
                value={laptopFit}
                onChange={setLaptopFit}
                placeholder='15" (leave empty if none)'
              />
              <FormField
                label="Stock Qty"
                value={stock}
                onChange={setStock}
                placeholder="25"
                type="number"
              />
            </div>
          </div>

          {/* ── 4. Flags ── */}
          <div className="flex gap-5">
            <FormToggle
              label="Mark as Trending"
              desc="Shows TRENDING badge on product cards"
              checked={trending}
              onChange={setTrending}
            />
            <FormToggle
              label="Mark as Featured"
              desc="Appears in Editor's Picks section"
              checked={featured}
              onChange={setFeatured}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-8 py-5"
          style={{ borderTop:"1px solid var(--border)" }}
        >
          <p className="text-xs" style={{ color:"var(--text-faint)" }}>
            {images.length > 0
              ? `${images.length} image${images.length > 1 ? "s" : ""} ready · ${
                  images.find(i => i.isPrimary) ? "Primary set ✓" : "No primary set"
                }`
              : "No images — product will show placeholder"}
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="btn-outline text-sm">Cancel</button>
            <button onClick={handleSave}
              className="btn-gold text-sm flex items-center gap-2">
              <Save size={14} />
              {isEdit ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err,      setErr]      = useState("");
  const [loading,  setLoading]  = useState(false);

  function login() {
    if (!username || !password) { setErr("Please enter credentials"); return; }
    setLoading(true); setErr("");
    setTimeout(() => {
      if (username === "admin" && password === "vaulta2025") { onLogin(); }
      else { setErr("Invalid credentials. Try: admin / vaulta2025"); setLoading(false); }
    }, 700);
  }

  return (
    <div className="min-h-screen section-subtle flex items-center justify-center px-6">
      <Toaster position="bottom-right" toastOptions={{ style:{ background:"#fff", color:"#1A1917", border:"1px solid #E5E4DF", borderRadius:"12px" } }} />
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background:"var(--text)" }}>
            <span className="text-white font-black text-2xl font-serif">V</span>
          </div>
          <h1 className="text-2xl font-black font-serif" style={{ color:"var(--text)" }}>Admin Panel</h1>
          <p className="text-sm mt-1" style={{ color:"var(--text-muted)" }}>VAULTA Internal Portal</p>
        </div>

        <div className="card-flat section-white rounded-2xl p-8">
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color:"var(--text-muted)" }}>Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === "Enter" && login()}
                placeholder="admin"
                className="input"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color:"var(--text-muted)" }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && login()}
                  placeholder="••••••••"
                  className="input"
                  style={{ paddingRight:"44px" }}
                  autoComplete="current-password"
                />
                <button onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn-ghost p-1">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          {err && (
            <div className="rounded-xl p-3 mb-4 text-sm"
              style={{ background:"#FEE2E2", color:"#991B1B" }}>{err}</div>
          )}

          <button onClick={login} disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
            style={loading ? { opacity:0.7, cursor:"not-allowed" } : {}}>
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-xs mt-4" style={{ color:"var(--text-faint)" }}>
            admin / vaulta2025
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN SHELL
// ─────────────────────────────────────────────────────────────
function AdminShell({ onLogout }: { onLogout: () => void }) {
  const [section,  setSection]  = useState<Section>("dashboard");
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders,   setOrders]   = useState<Order[]>(ORDERS);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<Product | null>(null);

  const totalRev = orders.reduce((a, o) => a + o.total, 0);

  // Load locally-stored images on mount
  useEffect(() => {
    setProducts(prev => prev.map(p => {
      if (p.images.length > 0) return p;
      const local = getLocalProductImages(p.id);
      return local.length > 0 ? { ...p, images: local } : p;
    }));
  }, []);

  const handleSaveProduct = useCallback((product: Product) => {
    setProducts(prev =>
      editing
        ? prev.map(p => p.id === product.id ? product : p)
        : [product, ...prev]
    );
    toast.success(editing ? "Product updated!" : "Product created!");
    setShowForm(false);
    setEditing(null);
  }, [editing]);

  const handleDeleteProduct = useCallback((id: number) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success("Product deleted");
  }, []);

  const openEdit = useCallback((p: Product) => { setEditing(p); setShowForm(true); }, []);
  const openAdd  = useCallback(() => { setEditing(null); setShowForm(true); }, []);
  const closeForm = useCallback(() => { setShowForm(false); setEditing(null); }, []);

  const NAV = [
    { id:"dashboard" as Section, label:"Dashboard", Icon:LayoutDashboard },
    { id:"products"  as Section, label:"Products",  Icon:Package },
    { id:"orders"    as Section, label:"Orders",    Icon:ShoppingCart },
    { id:"users"     as Section, label:"Users",     Icon:Users },
    { id:"analytics" as Section, label:"Analytics", Icon:TrendingUp },
  ];

  return (
    <div className="flex min-h-screen section-subtle">
      <Toaster position="bottom-right" toastOptions={{ style:{ background:"#fff", color:"#1A1917", border:"1px solid #E5E4DF", borderRadius:"12px" } }} />

      {/* Product form modal */}
      {showForm && (
        <ProductForm
          initial={editing ?? undefined}
          onSave={handleSaveProduct}
          onCancel={closeForm}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className="w-56 section-white flex flex-col px-3 py-6 fixed top-0 left-0 h-full z-50"
        style={{ borderRight:"1px solid var(--border)" }}>
        <div className="flex items-center gap-2.5 px-3 mb-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background:"var(--text)" }}>
            <span className="text-white font-black text-base font-serif">V</span>
          </div>
          <div>
            <p className="font-black font-serif text-sm tracking-wider"
              style={{ color:"var(--text)" }}>VAULTA</p>
            <p className="text-[9px] font-bold uppercase tracking-widest"
              style={{ color:"var(--text-faint)" }}>Admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setSection(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
              style={{
                background: section===id ? "var(--gold-pale)" : "transparent",
                color:      section===id ? "var(--gold)"      : "var(--text-sec)",
              }}>
              <Icon size={16} />{label}
            </button>
          ))}
        </nav>

        <div className="space-y-1 pt-4" style={{ borderTop:"1px solid var(--border)" }}>
          <Link href="/home"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm btn-ghost">
            <ArrowLeft size={15} />Back to Store
          </Link>
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm btn-ghost text-left hover:text-red-500">
            <LogOut size={15} />Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-56 flex-1 p-10 overflow-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black font-serif capitalize"
            style={{ color:"var(--text)" }}>{section}</h1>
          <p className="text-sm mt-1" style={{ color:"var(--text-muted)" }}>
            {new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
          </p>
        </div>

        {/* ── DASHBOARD ── */}
        {section === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-5">
              <StatCard title="Total Revenue"  value={formatPrice(totalRev)} sub="+18.4% vs last month" color="var(--gold)" />
              <StatCard title="Total Orders"   value={orders.length}         sub="+12 this week"         color="#059669" />
              <StatCard title="Products"       value={products.length}       sub="8 trending"            color="#2563EB" />
              <StatCard title="Customers"      value="2,847"                 sub="+234 new this month"   color="#7C3AED" />
            </div>
            <div className="grid grid-cols-[2fr_1fr] gap-5">
              <RevenueChart />
              <div className="card-flat section-white rounded-2xl p-7">
                <h3 className="font-bold font-serif text-lg mb-5" style={{ color:"var(--text)" }}>
                  Top Products
                </h3>
                {[...products].sort((a,b) => b.reviewCount - a.reviewCount).slice(0,5).map((p, i) => {
                  const imgSrc   = getProductImageUrl(p, 0, 64, 64);
                  const isBase64 = imgSrc.startsWith("data:");
                  return (
                    <div key={p.id} className="flex items-center gap-3 mb-4 last:mb-0">
                      <span className="text-sm font-bold w-5" style={{ color:"var(--gold)" }}>#{i+1}</span>
                      <div className="w-8 h-8 rounded-lg overflow-hidden relative flex-shrink-0"
                        style={{ background:"var(--bg-subtle)" }}>
                        <Image src={imgSrc} alt={p.name} fill className="object-cover" sizes="32px" unoptimized={isBase64} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color:"var(--text)" }}>{p.name}</p>
                        <p className="text-xs" style={{ color:"var(--text-muted)" }}>{p.reviewCount} reviews</p>
                      </div>
                      <span className="text-xs font-bold text-amber-500">★{p.rating}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card-flat section-white rounded-2xl overflow-hidden">
              <div className="px-6 py-4 font-bold font-serif"
                style={{ color:"var(--text)", borderBottom:"1px solid var(--border)" }}>
                Recent Orders
              </div>
              <table className="w-full">
                <thead><tr>
                  <Th c="Order ID"/><Th c="Customer"/><Th c="Date"/><Th c="Status"/><Th c="Total"/>
                </tr></thead>
                <tbody>
                  {orders.slice(0,5).map(o => (
                    <tr key={o.id} className="table-row">
                      <Td><span className="font-mono text-xs font-bold" style={{ color:"var(--gold)" }}>{o.id}</span></Td>
                      <Td><span style={{ color:"var(--text)" }}>{o.customerName}</span></Td>
                      <Td><span style={{ color:"var(--text-muted)" }}>{o.date}</span></Td>
                      <Td><span className={STATUS_STYLES[o.status]}>{o.status}</span></Td>
                      <Td><span className="font-semibold text-emerald-600">{formatPrice(o.total)}</span></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {section === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm" style={{ color:"var(--text-muted)" }}>
                {products.length} products total
              </p>
              <button onClick={openAdd} className="btn-gold flex items-center gap-2 text-sm">
                <Plus size={14}/>Add Product
              </button>
            </div>

            <div className="card-flat section-white rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead><tr>
                  <Th c="Product"/><Th c="Category"/><Th c="Price"/>
                  <Th c="Stock"/><Th c="Images"/><Th c="Rating"/><Th c="Actions"/>
                </tr></thead>
                <tbody>
                  {products.map(p => {
                    const imgSrc   = getProductImageUrl(p, 0, 96, 96);
                    const isBase64 = imgSrc.startsWith("data:");
                    const imgCount = p.images?.length ?? 0;
                    return (
                      <tr key={p.id} className="table-row">
                        <Td>
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                              style={{ background:"var(--bg-subtle)" }}>
                              <Image src={imgSrc} alt={p.name} fill className="object-cover"
                                sizes="48px" unoptimized={isBase64} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold truncate"
                                style={{ color:"var(--text)", maxWidth:"180px" }}>{p.name}</p>
                              <p className="text-xs" style={{ color:"var(--text-muted)" }}>{p.material}</p>
                            </div>
                          </div>
                        </Td>
                        <Td><span className="badge badge-gold">{p.category}</span></Td>
                        <Td><span className="font-bold" style={{ color:"var(--text)" }}>{formatPrice(p.price)}</span></Td>
                        <Td>
                          <span className={p.stock < 10 ? "text-red-500 font-semibold" : "text-emerald-600"}>
                            {p.stock}{p.stock < 10 ? " ⚠" : ""}
                          </span>
                        </Td>
                        <Td>
                          <div className="flex items-center gap-1.5">
                            <ImageIcon size={13} style={{ color: imgCount > 0 ? "var(--gold)" : "var(--text-faint)" }} />
                            <span className="text-xs font-semibold"
                              style={{ color: imgCount > 0 ? "var(--text)" : "var(--text-faint)" }}>
                              {imgCount > 0 ? `${imgCount} photo${imgCount > 1 ? "s" : ""}` : "No images"}
                            </span>
                          </div>
                        </Td>
                        <Td><span className="text-amber-500 font-semibold">★{p.rating}</span></Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(p)} className="btn-ghost p-1.5 rounded-lg"
                              title="Edit product & images">
                              <Edit3 size={14} style={{ color:"var(--gold)" }} />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)}
                              className="btn-ghost p-1.5 rounded-lg hover:text-red-400"
                              title="Delete product">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 rounded-xl text-xs flex items-start gap-2"
              style={{ background:"#EFF6FF", border:"1px solid #BFDBFE" }}>
              <span className="text-blue-500 flex-shrink-0 mt-0.5">ℹ</span>
              <div style={{ color:"#1D4ED8" }}>
                <strong>Dev Mode:</strong> Images are stored in your browser&apos;s localStorage.
                Add Supabase credentials to <code className="bg-blue-100 px-1 rounded">.env.local</code> for
                permanent cloud storage.
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {section === "orders" && (
          <div className="card-flat section-white rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead><tr>
                <Th c="Order ID"/><Th c="Customer"/><Th c="Date"/>
                <Th c="Total"/><Th c="Status"/><Th c="Update"/>
              </tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="table-row">
                    <Td><span className="font-mono text-xs font-bold" style={{ color:"var(--gold)" }}>{o.id}</span></Td>
                    <Td>
                      <p className="font-semibold" style={{ color:"var(--text)" }}>{o.customerName}</p>
                      <p className="text-xs" style={{ color:"var(--text-muted)" }}>{o.customerEmail}</p>
                    </Td>
                    <Td><span style={{ color:"var(--text-muted)" }}>{o.date}</span></Td>
                    <Td><span className="font-semibold text-emerald-600">{formatPrice(o.total)}</span></Td>
                    <Td><span className={STATUS_STYLES[o.status]}>{o.status}</span></Td>
                    <Td>
                      <select
                        value={o.status}
                        onChange={e => {
                          setOrders(prev => prev.map(x =>
                            x.id === o.id ? { ...x, status: e.target.value as OrderStatus } : x
                          ));
                          toast.success("Status updated");
                        }}
                        className="input text-xs"
                        style={{ padding:"5px 10px", width:"auto" }}
                      >
                        {["Pending","Processing","Shipped","Delivered","Cancelled"].map(s => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── USERS ── */}
        {section === "users" && (
          <div className="card-flat section-white rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead><tr>
                <Th c="User"/><Th c="Email"/><Th c="Orders"/>
                <Th c="Total Spent"/><Th c="Status"/>
              </tr></thead>
              <tbody>
                {USERS_MOCK.map((u, i) => (
                  <tr key={i} className="table-row">
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                          style={{ background:"var(--gold-pale)", color:"var(--gold)" }}>
                          {u.name[0]}
                        </div>
                        <span className="font-semibold" style={{ color:"var(--text)" }}>{u.name}</span>
                      </div>
                    </Td>
                    <Td><span style={{ color:"var(--text-sec)" }}>{u.email}</span></Td>
                    <Td><span style={{ color:"var(--text-sec)" }}>{u.orders}</span></Td>
                    <Td><span className="font-bold" style={{ color:"var(--text)" }}>{formatPrice(u.spent)}</span></Td>
                    <Td>
                      <span className={u.active ? "badge badge-green" : "badge badge-red"}>
                        {u.active ? "Active" : "Inactive"}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {section === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-5">
              <StatCard title="Conversion Rate" value="3.2%"  sub="+0.4% this month"   color="#059669" />
              <StatCard title="Avg Order Value" value="$287"  sub="+$23 vs last month" color="var(--gold)" />
              <StatCard title="Customer LTV"    value="$840"  sub="Lifetime value"      color="#7C3AED" />
            </div>
            <div className="grid grid-cols-[2fr_1fr] gap-5">
              <RevenueChart />
              <div className="card-flat section-white rounded-2xl p-7">
                <h3 className="font-bold font-serif text-lg mb-6" style={{ color:"var(--text)" }}>
                  Sales by Category
                </h3>
                {[
                  ["Travel Bags",32,"#B8860B"],
                  ["Office Bags",22,"#2563EB"],
                  ["Ladies Bags",18,"#E879A0"],
                  ["Backpacks",14,"#7C3AED"],
                  ["Laptop Bags",8,"#059669"],
                  ["Gym Bags",4,"#F59E0B"],
                  ["Fashion Bags",2,"#EC4899"],
                ].map(([cat,pct,color]) => (
                  <div key={String(cat)} className="mb-5">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span style={{ color:"var(--text-sec)" }}>{cat}</span>
                      <span className="font-bold" style={{ color:String(color) }}>{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background:"var(--bg-muted)" }}>
                      <div className="h-full rounded-full"
                        style={{ width:`${pct}%`, background:String(color) }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ENTRY POINT
// ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;
  return <AdminShell onLogout={() => setAuthed(false)} />;
}
