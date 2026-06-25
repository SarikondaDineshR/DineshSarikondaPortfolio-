import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(options?: {
  stagger?: number;
  y?: number;
  duration?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = Array.from(el.children) as HTMLElement[];
    if (!children.length) return;

    children.forEach(c => { c.style.willChange = "opacity, transform"; });

    const ctx = gsap.context(() => {
      gsap.from(children, {
        opacity: 0,
        y: options?.y ?? 30,
        duration: options?.duration ?? 0.7,
        stagger: options?.stagger ?? 0.1,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: el,
          start: options?.start ?? "top 88%",
          toggleActions: "play none none none",
          fastScrollEnd: true,
          preventOverlaps: true,
        },
        onComplete: () => {
          children.forEach(c => { c.style.willChange = "auto"; });
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

export function useScrollFade(options?: { y?: number; duration?: number; start?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    (el as HTMLElement).style.willChange = "opacity, transform";

    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y: options?.y ?? 24,
        duration: options?.duration ?? 0.7,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: el,
          start: options?.start ?? "top 90%",
          toggleActions: "play none none none",
          fastScrollEnd: true,
          preventOverlaps: true,
        },
        onComplete: () => { (el as HTMLElement).style.willChange = "auto"; },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
