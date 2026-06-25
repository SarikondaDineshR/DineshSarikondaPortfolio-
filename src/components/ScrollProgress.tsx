import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const fn = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px]" style={{ background:"rgba(255,255,255,0.04)" }}>
      <div
        className="h-full transition-all duration-75"
        style={{ width:`${p}%`, background:"linear-gradient(90deg,#ff8c3a,#ffd280)" }}
      />
    </div>
  );
}
