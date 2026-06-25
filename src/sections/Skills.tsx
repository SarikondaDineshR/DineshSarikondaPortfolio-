import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "../data/portfolio";
import { useScrollReveal, useScrollFade } from "../hooks/useScrollReveal";

gsap.registerPlugin(ScrollTrigger);

const COLORS: Record<string, string> = {
  "Backend":        "#ff8c3a",
  "Frontend":       "#ffd280",
  "Cloud & DevOps": "#34d399",
  "Architecture":   "#a78bfa",
  "Databases":      "#f472b6",
  "Messaging":      "#60a5fa",
};

function SectionHeader({ label, title }: { label: string; title: string }) {
  const ref = useScrollFade({ y: 30, duration: 0.8 });
  return (
    <div className="text-center" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className="inline-block text-xs tracking-[0.25em] uppercase mb-4 px-4 py-1.5 rounded-full"
        style={{ border: "1px solid rgba(255,140,60,0.3)", color: "rgba(255,160,80,0.9)", background: "rgba(255,120,40,0.06)" }}>
        Expertise
      </div>
      <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "rgba(255,255,255,0.93)" }}>{title}</h2>
    </div>
  );
}

export default function Skills() {
  const gridRef = useScrollReveal({ stagger: 0.1, y: 40, duration: 0.8, start: "top 85%" });

  return (
    <section id="skills" className="relative z-20 py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label="Expertise" title="Technical Skills" />
        <div ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {Object.entries(skills).map(([cat, items]) => {
            const c = COLORS[cat] || "#ff8c3a";
            return (
              <div key={cat}
                className="p-6 rounded-2xl transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${c}30`; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-4 rounded-full" style={{ background: c }} />
                  <h3 className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: c }}>{cat}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full"
                      style={{ background: `${c}10`, border: `1px solid ${c}20`, color: "rgba(255,255,255,0.6)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
