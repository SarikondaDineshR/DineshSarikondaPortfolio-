import { useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "../data/portfolio";
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

export default function Experience() {
  const [active, setActive] = useState(0);
  const tabsRef  = useScrollReveal({ stagger: 0.08, y: 30, duration: 0.7, start: "top 88%" });
  const detailRef = useScrollFade({ y: 40, duration: 0.8, start: "top 85%" });
  const exp = experiences[active];

  return (
    <section id="experience" className="relative z-20 py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label="Career" title="Work Experience" />

        <div className="flex flex-col lg:flex-row gap-8 mt-16">
          {/* Company tabs */}
          <div ref={tabsRef}
            className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible lg:w-56 shrink-0 pb-2 lg:pb-0">
            {experiences.map((e, i) => (
              <button key={e.company} onClick={() => setActive(i)}
                className="shrink-0 lg:shrink text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm"
                style={{
                  background: active === i ? "rgba(255,140,60,0.1)" : "transparent",
                  border:     active === i ? "1px solid rgba(255,140,60,0.35)" : "1px solid transparent",
                  color:      active === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                  minWidth: "140px",
                }}
                onMouseEnter={e2 => { if (active !== i) e2.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                onMouseLeave={e2 => { if (active !== i) e2.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}>
                <div className="font-medium truncate">{e.company}</div>
                {e.current && <div className="text-xs mt-0.5" style={{ color: "#fb923c" }}>Current</div>}
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div key={active} ref={detailRef as React.RefObject<HTMLElement>}
            className="flex-1 p-8 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", animation: "fadeInUp 0.35s ease" }}>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1" style={{ color: "rgba(255,255,255,0.92)" }}>{exp.role}</h3>
                <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <span style={{ background: "linear-gradient(135deg,#ff8c3a,#ffd280)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 600 }}>
                    {exp.company}
                  </span>
                  <span>·</span>
                  <span>{exp.location}</span>
                </div>
              </div>
              <div className="text-xs px-3 py-1 rounded-full tracking-wide whitespace-nowrap"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.03)" }}>
                {exp.duration}
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {exp.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <span className="mt-2 shrink-0 w-1 h-1 rounded-full" style={{ background: "linear-gradient(135deg,#ff8c3a,#ffd280)" }} />
                  {h}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {exp.tech.map(t => (
                <span key={t} className="text-xs px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,140,60,0.08)", border: "1px solid rgba(255,140,60,0.2)", color: "rgba(255,190,100,0.85)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
