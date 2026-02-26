import React, { useMemo } from 'react'

export default function ParticleField() {
  const particles = useMemo(() => {
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 20,
      dy: (Math.random() - 0.5) * 20,
      duration: Math.random() * 12 + 6,
      delay: Math.random() * -15,
      opacity: Math.random() * 0.4 + 0.1,
      color: ['#007FFF', '#4285F4', '#FF9900', '#512BD4', '#00C896'][Math.floor(Math.random() * 5)],
    }))
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ overflow: 'hidden' }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle-dot"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            '--duration': `${p.duration}s`,
            '--delay': `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}
