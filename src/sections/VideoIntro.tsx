import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { profile } from "../data/portfolio";

interface VideoIntroProps {
  onScrollDown: () => void;
}

export default function VideoIntro({ onScrollDown }: VideoIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const ambientRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted]       = useState(true);
  const [soundHint, setSoundHint] = useState(true);
  const hasVideo = true;

  const toggleMute = async () => {
    const v = videoRef.current;
    if (!v) return;

    const newMuted = !muted;
    v.muted = newMuted;

    if (!newMuted) {
      try {
        await v.play();
      } catch (_) {
        v.muted = true;
        setMuted(true);
        setSoundHint(false);
        return;
      }
    }

    setMuted(newMuted);
    setSoundHint(false);
  };

  useEffect(() => {
    if (!contentRef.current) return;
    const children = Array.from(contentRef.current.children);
    const ctx = gsap.context(() => {
      gsap.from(children, {
        opacity: 0, y: 40,
        duration: 1.0,
        stagger: 0.18,
        ease: "power3.out",
        delay: 0.2,
        clearProps: "all",
      });
    }, sectionRef);

    const t = setTimeout(() => setSoundHint(false), 5000);
    return () => { ctx.revert(); clearTimeout(t); };
  }, []);

  return (
    <section ref={sectionRef} id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {hasVideo ? (
        <>
          {/* Blurred ambient layer — always muted, never plays audio */}
          <video ref={ambientRef} src="/hero-video.mp4"
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-30 pointer-events-none"
            aria-hidden="true" />
          {/* Foreground video — audio toggled by user */}
          <video ref={videoRef} src="/hero-video.mp4"
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ objectPosition: "center center" }} />
        </>
      ) : (
        <div className="absolute inset-0 scale-110 blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundImage: "url('/profile.png')", backgroundSize: "cover", backgroundPosition: "center top" }} />
      )}

      {/* Cinematic gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(8,12,21,0.55) 0%, rgba(8,12,21,0.05) 30%, rgba(8,12,21,0.05) 65%, rgba(8,12,21,0.92) 100%)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 10%, rgba(8,12,21,0.45) 100%)",
      }} />

      {/* Hero content */}
      <div ref={contentRef}
        className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs tracking-[0.28em] uppercase"
            style={{ border: "1px solid rgba(255,140,60,0.4)", color: "rgba(255,165,80,1)", background: "rgba(255,120,40,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Available for opportunities
          </div>
        </div>

        <div className="mb-5">
          <h1 className="font-black leading-[0.88] tracking-tight"
            style={{ fontSize: "clamp(3.8rem, 11vw, 9rem)" }}>
            <span className="block" style={{ color: "rgba(255,255,255,0.97)", textShadow: "0 2px 40px rgba(0,0,0,0.6)" }}>
              {profile.name.first.toUpperCase()}
            </span>
            <span className="block" style={{
              background: "linear-gradient(135deg, #ff8c3a 0%, #ffbf60 55%, #ffd280 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(255,140,60,0.45))",
            }}>
              {profile.name.last.toUpperCase()}
            </span>
          </h1>
        </div>

        <div className="mb-10">
          <p className="text-sm md:text-base tracking-[0.25em] uppercase font-light"
            style={{ color: "rgba(255,255,255,0.5)", textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
            {profile.role}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={onScrollDown}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300"
            style={{ background: "linear-gradient(135deg,#ff8c3a,#e8631a)", color: "#fff", boxShadow: "0 4px 32px rgba(255,120,40,0.45)" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 48px rgba(255,120,40,0.65)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 32px rgba(255,120,40,0.45)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            View Work
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
          <a href={`mailto:${profile.email}`}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm transition-all duration-300"
            style={{ border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.06)" }}
            onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.35)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.18)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}>
            Get in touch
          </a>
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-10 md:gap-20 px-10 py-5 rounded-2xl"
        style={{
          background: "rgba(8,12,21,0.7)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          whiteSpace: "nowrap",
        }}>
        {profile.stats.map(s => (
          <div key={s.label} className="flex flex-col items-center gap-1">
            <span className="text-2xl md:text-3xl font-bold" style={{
              background: "linear-gradient(135deg,#ff8c3a,#ffd280)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>{s.value}</span>
            <span className="text-[10px] uppercase tracking-widest text-center whitespace-pre-line"
              style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Mute / unmute control */}
      <div className="absolute top-20 right-5 z-30 flex items-center gap-3">
        {soundHint && (
          <div className="text-[11px] px-3 py-1.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
            Tap for sound
          </div>
        )}
        <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.14)" }}
          onMouseEnter={e => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.3)"}
          onMouseLeave={e => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.14)"}>
          {muted
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
          }
        </button>
      </div>

      {/* Scroll indicator */}
      <button onClick={onScrollDown}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        style={{ color: "rgba(255,255,255,0.25)" }}>
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="relative w-px h-10 overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div className="absolute top-0 left-0 w-full h-1/2" style={{
            background: "linear-gradient(to bottom, rgba(255,140,60,0.9), transparent)",
            animation: "scrollPulse 1.8s ease-in-out infinite",
          }} />
        </div>
      </button>

      <style>{`@keyframes scrollPulse{0%{transform:translateY(-100%);opacity:1}100%{transform:translateY(250%);opacity:0}}`}</style>
    </section>
  );
}
