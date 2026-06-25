import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Attach a scroll-reveal animation to a container element.
 * Children animate in with a staggered fade-up when the container enters the viewport.
 */
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

    const ctx = gsap.context(() => {
      gsap.from(children, {
        opacity: 0,
        y: options?.y ?? 50,
        duration: options?.duration ?? 0.9,
        stagger: options?.stagger ?? 0.12,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: el,
          start: options?.start ?? "top 82%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

/** Fade-up a single element on scroll */
export function useScrollFade(options?: { y?: number; duration?: number; start?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y: options?.y ?? 40,
        duration: options?.duration ?? 1.0,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: el,
          start: options?.start ?? "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
