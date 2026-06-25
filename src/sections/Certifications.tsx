import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { certifications, education } from "../data/portfolio";
import { useScrollReveal, useScrollFade } from "../hooks/useScrollReveal";

gsap.registerPlugin(ScrollTrigger);

function SectionHeader({ label, title }: { label: string; title: string }) {
  const ref = useScrollFade({ y: 30, duration: 0.8 });
  return (
    <div className="text-center" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className="inline-block text-xs tracking-[0.25em] uppercase mb-4 px-4 py-1.5 rounded-full"
        style={{ border: "1px solid rgba(255,140,60,0.3)", color: "rgba(255,160,80,0.9)", background: "rgba(255,120,40,0.06)" }}>
        {label}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "rgba(255,255,255,0.93)" }}>{title}</h2>
    </div>
  );
}

export default function Certifications() {
  const cardsRef = useScrollReveal({ stagger: 0.15, y: 50, duration: 0.9, start: "top 85%" });
  const eduRef   = useScrollFade({ y: 30, duration: 0.8, start: "top 88%" });

  return (
    <section id="certifications" className="relative z-20 py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label="Credentials" title="Certifications & Education" />

        <div ref={cardsRef} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {certifications.map(cert => (
            <div key={cert.name}
              className="p-6 rounded-2xl flex flex-col items-center text-center gap-4 transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${cert.color}40`; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 48px ${cert.color}12`; }}
              onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-sm"
                style={{ background: `${cert.color}15`, border: `1px solid ${cert.color}30`, color: cert.color }}>
                {cert.badge}
              </div>
              <div>
                <div className="font-semibold text-sm mb-1" style={{ color: "rgba(255,255,255,0.88)" }}>{cert.name}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{cert.issuer}</div>
              </div>
              <div className="text-xs px-3 py-1 rounded-full"
                style={{ background: `${cert.color}15`, color: cert.color, border: `1px solid ${cert.color}25` }}>
                Certified
              </div>
            </div>
          ))}
        </div>

        <div ref={eduRef as React.RefObject<HTMLDivElement>}
          className="p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,140,60,0.1)", border: "1px solid rgba(255,140,60,0.2)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff8c3a" strokeWidth="1.5">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,140,60,0.8)" }}>Education</div>
            <div className="font-semibold text-base mb-1" style={{ color: "rgba(255,255,255,0.88)" }}>{education.degree}</div>
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Graduated {education.year}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
