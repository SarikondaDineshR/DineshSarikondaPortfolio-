import { useEffect, useRef, useState } from "react";
import { profile } from "../data/portfolio";

const TYPING_WORDS = [".NET Architect", "Full Stack Engineer", "Cloud Specialist", "Microservices Expert"];

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const word = TYPING_WORDS[wordIdx];
    if (!deleting && displayed.length < word.length) {
      timeoutRef.current = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIdx((prev) => (prev + 1) % TYPING_WORDS.length);
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayed, deleting, wordIdx]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center z-20 px-6 text-center"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">

        {/* Availability badge */}
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase"
          style={{ border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", background: "rgba(74,222,128,0.05)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Available for opportunities
        </div>

        {/* Profile photo */}
        <div className="relative">
          <div
            className="w-32 h-32 rounded-full overflow-hidden"
            style={{
              border: "2px solid rgba(255,255,255,0.1)",
              boxShadow: "0 0 40px rgba(59,130,246,0.25), 0 0 80px rgba(139,92,246,0.1)",
            }}
          >
            <img src="/profile.png" alt="Dinesh Sarikonda" className="w-full h-full object-cover" />
          </div>
          <div
            className="absolute -inset-1 rounded-full -z-10 blur-xl opacity-30"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          />
        </div>

        {/* Name */}
        <div>
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-2"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            {profile.name.first}{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {profile.name.last}
            </span>
          </h1>
          <div className="text-lg md:text-xl font-light tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>
            {profile.role}
          </div>
        </div>

        {/* Typing animation */}
        <div
          className="text-2xl md:text-3xl font-light"
          style={{ color: "rgba(255,255,255,0.7)", minHeight: "2.5rem" }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {displayed}
          </span>
          <span
            className="ml-0.5 inline-block w-0.5 h-7 align-middle animate-pulse"
            style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)" }}
          />
        </div>

        {/* Bio */}
        <p
          className="max-w-2xl text-base md:text-lg leading-relaxed"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {profile.bio}
        </p>

        {/* Stats */}
        <div className="flex gap-8 md:gap-16">
          {profile.stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span
                className="text-3xl md:text-4xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.value}
              </span>
              <span
                className="text-xs uppercase tracking-widest text-center whitespace-pre-line"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              color: "#fff",
              boxShadow: "0 4px 24px rgba(59,130,246,0.3)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 32px rgba(59,130,246,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 24px rgba(59,130,246,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            Get in touch
          </a>
          <a
            href={`https://${profile.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
              background: "rgba(255,255,255,0.04)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
          >
            LinkedIn
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-8 flex flex-col items-center gap-2 animate-bounce" style={{ color: "rgba(255,255,255,0.2)" }}>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
