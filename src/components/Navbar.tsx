import { useState, useEffect } from "react";

const links = [
  { label: "About",          href: "#hero" },
  { label: "Experience",     href: "#experience" },
  { label: "Skills",         href: "#skills" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact",        href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-3 left-0 right-0 z-40 flex justify-center px-4">
      <div
        className="flex items-center gap-8 px-6 py-3 rounded-full transition-all duration-500"
        style={{
          background: scrolled ? "rgba(8,12,21,0.88)" : "rgba(8,12,21,0.35)",
          backdropFilter: "blur(24px)",
          border: scrolled ? "1px solid rgba(255,140,60,0.15)" : "1px solid rgba(255,255,255,0.07)",
          boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.5)" : "none",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => go("#hero")}
          className="font-black text-sm tracking-widest"
          style={{
            background: "linear-gradient(135deg,#ff8c3a,#ffd280)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          DS
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="text-xs tracking-[0.18em] uppercase transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.45)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Hire me */}
        <a
          href="mailto:Dinesh.work009@gmail.com"
          className="hidden md:flex items-center gap-2 text-xs px-4 py-2 rounded-full font-semibold transition-all duration-200"
          style={{
            background: "linear-gradient(135deg,#ff8c3a,#e8631a)",
            color: "#fff",
            boxShadow: "0 2px 16px rgba(255,120,40,0.35)",
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 24px rgba(255,120,40,0.6)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 16px rgba(255,120,40,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Hire me
        </a>

        {/* Mobile burger */}
        <button
          className="md:hidden"
          style={{ color: "rgba(255,255,255,0.6)" }}
          onClick={() => setOpen(o => !o)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open
              ? <path d="M18 6L6 18M6 6l12 12" />
              : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="absolute top-16 left-4 right-4 rounded-2xl p-4 flex flex-col gap-2"
          style={{ background: "rgba(8,12,21,0.96)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {links.map(l => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="text-left text-sm py-2.5 px-4 rounded-xl transition-colors"
              style={{ color: "rgba(255,255,255,0.65)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,140,60,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {l.label}
            </button>
          ))}
          <a
            href="mailto:Dinesh.work009@gmail.com"
            className="mt-2 text-center text-sm py-2.5 px-4 rounded-xl font-semibold"
            style={{ background: "linear-gradient(135deg,#ff8c3a,#e8631a)", color: "#fff" }}
          >
            Hire me
          </a>
        </div>
      )}
    </nav>
  );
}
