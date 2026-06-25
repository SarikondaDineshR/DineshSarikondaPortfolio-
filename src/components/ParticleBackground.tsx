import { useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

const COLORS = [
  "rgba(96,165,250,1)",
  "rgba(167,139,250,1)",
  "rgba(255,255,255,1)",
  "rgba(147,197,253,1)",
  "rgba(196,181,253,1)",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export default function ParticleBackground() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 180 }, (_, i) => ({
      id: i,
      x: seededRandom(i * 3) * 100,
      y: seededRandom(i * 3 + 1) * 100,
      size: seededRandom(i * 3 + 2) * 2.2 + 0.3,
      opacity: seededRandom(i * 7) * 0.6 + 0.15,
      duration: seededRandom(i * 5) * 6 + 3,
      delay: seededRandom(i * 11) * 8,
      color: COLORS[Math.floor(seededRandom(i * 13) * COLORS.length)],
    }));
  }, []);

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: var(--star-opacity); transform: scale(1); }
          50% { opacity: calc(var(--star-opacity) * 0.2); transform: scale(0.7); }
        }
        @keyframes drift {
          0% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-8px) translateX(4px); }
          66% { transform: translateY(4px) translateX(-6px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes shootingStar {
          0% { transform: translateX(0) translateY(0) rotate(-35deg); opacity: 1; width: 0; }
          10% { width: 120px; opacity: 1; }
          90% { width: 120px; opacity: 0.3; }
          100% { transform: translateX(300px) translateY(150px) rotate(-35deg); opacity: 0; width: 0; }
        }
      `}</style>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep space gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(15,20,40,0.6) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(20,10,35,0.5) 0%, transparent 50%)",
          }}
        />

        {/* Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={
              {
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                background: star.color,
                "--star-opacity": star.opacity,
                opacity: star.opacity,
                animation: `twinkle ${star.duration}s ${star.delay}s ease-in-out infinite, drift ${star.duration * 2.5}s ${star.delay}s ease-in-out infinite`,
                boxShadow:
                  star.size > 1.5
                    ? `0 0 ${star.size * 3}px ${star.color}`
                    : "none",
              } as React.CSSProperties
            }
          />
        ))}

        {/* Shooting stars */}
        {[0, 1, 2].map((i) => (
          <div
            key={`shoot-${i}`}
            className="absolute h-px"
            style={{
              top: `${[15, 35, 55][i]}%`,
              left: `${[5, 25, 60][i]}%`,
              background: "linear-gradient(90deg, transparent, rgba(147,197,253,0.8), transparent)",
              animation: `shootingStar ${[12, 18, 22][i]}s ${[2, 7, 14][i]}s linear infinite`,
              opacity: 0,
            }}
          />
        ))}

        {/* Nebula blobs */}
        <div
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: "500px",
            height: "500px",
            top: "-100px",
            left: "20%",
            background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: "600px",
            height: "600px",
            bottom: "10%",
            right: "10%",
            background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
          }}
        />
      </div>
    </>
  );
}
