import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../data/portfolio";
import { useScrollReveal, useScrollFade } from "../hooks/useScrollReveal";

gsap.registerPlugin(ScrollTrigger);

const items = [
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>, label: "Email",    value: profile.email,    href: `mailto:${profile.email}`,            color: "#ff8c3a" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z" /></svg>, label: "Phone",    value: profile.phone,    href: `tel:${profile.phone}`,               color: "#34d399" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>, label: "LinkedIn",  value: profile.linkedin, href: `https://${profile.linkedin}`,         color: "#60a5fa" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>, label: "Website",  value: profile.website,  href: `https://${profile.website}`,         color: "#a78bfa" },
];

export default function Contact() {
  const headRef  = useScrollFade({ y: 30, duration: 0.8 });
  const cardsRef = useScrollReveal({ stagger: 0.1, y: 40, duration: 0.8, start: "top 88%" });
  const ctaRef   = useScrollFade({ y: 30, duration: 0.8, start: "top 90%" });

  return (
    <section id="contact" className="relative z-20 py-32 px-6 pb-40">
      <div className="max-w-3xl mx-auto text-center">

        <div ref={headRef as React.RefObject<HTMLDivElement>}>
          <div className="inline-block text-xs tracking-[0.25em] uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{ border: "1px solid rgba(255,140,60,0.3)", color: "rgba(255,160,80,0.9)", background: "rgba(255,120,40,0.06)" }}>
            Let's Talk
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: "rgba(255,255,255,0.93)" }}>Get in Touch</h2>
          <p className="text-base mb-16" style={{ color: "rgba(255,255,255,0.4)" }}>
            Open to new opportunities, collaborations, and interesting conversations.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {items.map(item => (
            <a key={item.label} href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-300 group"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${item.color}30`; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${item.color}15`, color: item.color }}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{item.label}</div>
                <div className="text-sm font-medium truncate" style={{ color: "rgba(255,255,255,0.7)" }}>{item.value}</div>
              </div>
              <svg className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2">
                <path d="M7 7h10v10M7 17 17 7" />
              </svg>
            </a>
          ))}
        </div>

        <div ref={ctaRef as React.RefObject<HTMLDivElement>}>
          <a href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-base transition-all duration-300"
            style={{ background: "linear-gradient(135deg,#ff8c3a,#e8631a)", color: "#fff", boxShadow: "0 4px 32px rgba(255,120,40,0.4)" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 48px rgba(255,120,40,0.6)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 32px rgba(255,120,40,0.4)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            Send me an email
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <div className="mt-24 text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
            © {new Date().getFullYear()} Dinesh Sarikonda · Built with precision
          </div>
        </div>
      </div>
    </section>
  );
}
