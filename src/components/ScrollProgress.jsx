import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const sections = [
  { id: 'hero', label: '01' },
  { id: 'industries', label: '02' },
  { id: 'architecture', label: '03' },
  { id: 'projects', label: '04' },
  { id: 'certifications', label: '05' },
  { id: 'blog', label: '06' },
  { id: 'contact', label: '07' },
]

export default function ScrollProgress({ scrollRef }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const container = scrollRef?.current
    if (!container) return

    const handleScroll = () => {
      const totalHeight = container.scrollHeight - container.clientHeight
      const scrolled = container.scrollTop
      setProgress((scrolled / totalHeight) * 100)

      // Find active section
      sections.forEach((section, i) => {
        const el = document.getElementById(section.id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.top <= container.clientHeight / 2 && rect.bottom >= container.clientHeight / 2) {
          setActiveIndex(i)
        }
      })
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [scrollRef])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Vertical progress line - right side */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
        <div className="relative flex flex-col items-center gap-3">
          {sections.map((section, i) => (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="group flex items-center gap-3"
              aria-label={`Navigate to section ${section.label}`}
            >
              <span className="text-[10px] text-white/20 group-hover:text-white/50 transition-colors font-mono tracking-wider hidden xl:block">
                {section.label}
              </span>
              <motion.div
                animate={{
                  scale: activeIndex === i ? 1 : 0.6,
                  backgroundColor: activeIndex === i
                    ? 'rgb(0, 127, 255)'
                    : 'rgba(255,255,255,0.2)',
                }}
                transition={{ duration: 0.3 }}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:bg-azure/60"
              />
            </button>
          ))}

          {/* Connecting line */}
          <div className="absolute right-[2.5px] top-1 bottom-1 w-px bg-white/5 -z-10" />
          <motion.div
            className="absolute right-[2.5px] top-1 w-px bg-azure/30 -z-10 origin-top"
            style={{ height: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-px bg-white/5">
        <motion.div
          className="h-full bg-azure/50"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </>
  )
}
