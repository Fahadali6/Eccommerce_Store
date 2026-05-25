"use client";
import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const COLS = {
  Shop:    [{ label:"All Bags", href:"/shop" },{ label:"Travel", href:"/shop?cat=Travel" },{ label:"Office", href:"/shop?cat=Office" },{ label:"Gym", href:"/shop?cat=Gym" }],
  Company: [{ label:"About", href:"/about" },{ label:"Contact", href:"/contact" },{ label:"Admin", href:"/admin" }],
  Support: [{ label:"FAQ", href:"/contact" },{ label:"Returns", href:"/contact" },{ label:"Warranty", href:"/contact" }],
};

const SOCIALS = [
  {
    label: "Facebook",
    href:  "https://facebook.com/vaulta",
    Icon:  Facebook,
    hoverBg:    "#1877F2",
    hoverColor: "#ffffff",
  },
  {
    label: "Instagram",
    href:  "https://instagram.com/vaulta",
    Icon:  Instagram,
    hoverBg:    "radial-gradient(circle at 30% 110%, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    hoverColor: "#ffffff",
    isGradient: true,
  },
  {
    label: "LinkedIn",
    href:  "https://linkedin.com/company/vaulta",
    Icon:  Linkedin,
    hoverBg:    "#0A66C2",
    hoverColor: "#ffffff",
  },
];

export function Footer() {
  return (
    <footer className="section-subtle" style={{ borderTop:"1px solid var(--border)" }}>
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-4 gap-12 mb-12">

          {/* Brand column */}
          <div>
            <Link href="/home" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background:"var(--text)" }}>
                <span className="text-white font-black text-base font-serif">V</span>
              </div>
              <span className="font-black text-xl tracking-[2.5px] font-serif"
                style={{ color:"var(--text)" }}>VAULTA</span>
            </Link>

            <p className="text-sm leading-relaxed mb-6" style={{ color:"var(--text-muted)" }}>
              Premium bags engineered for extraordinary lives. Lifetime warranty on every product.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {SOCIALS.map(({ label, href, Icon, hoverBg, hoverColor, isGradient }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="social-icon group relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: "var(--bg-muted)",
                    border: "1px solid var(--border)",
                    color: "var(--text-sec)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = isGradient ? hoverBg : hoverBg;
                    el.style.color      = hoverColor;
                    el.style.borderColor = "transparent";
                    el.style.transform  = "translateY(-2px)";
                    el.style.boxShadow  = "0 6px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background  = "var(--bg-muted)";
                    el.style.color       = "var(--text-sec)";
                    el.style.borderColor = "var(--border)";
                    el.style.transform   = "translateY(0)";
                    el.style.boxShadow   = "none";
                  }}
                >
                  <Icon size={16} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(COLS).map(([title, links]) => (
            <div key={title}>
              <p className="label mb-4">{title}</p>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm transition-colors hover:opacity-80"
                      style={{ color:"var(--text-sec)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mb-6" />
        <div className="flex justify-between items-center text-xs"
          style={{ color:"var(--text-faint)" }}>
          <span>© {new Date().getFullYear()} VAULTA. All rights reserved.</span>
          <div className="flex items-center gap-4">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                style={{ color:"var(--text-faint)" }}>
                <Icon size={12} strokeWidth={1.8} />
                <span>{label}</span>
              </a>
            ))}
          </div>
          <span>Designed with obsession in Karachi.</span>
        </div>
      </div>
    </footer>
  );
}
