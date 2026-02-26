import React from 'react'
import { motion } from 'framer-motion'
import { industries } from '../data/portfolioData'
import useInView from '../hooks/useInView'

const industryIcons = {
  banking: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M8 10v11M12 10v11M16 10v11M20 10v11" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  finance: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="16 7 22 7 22 13" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  investment: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  insurance: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

function IndustryCard({ industry, index }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.15 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="premium-card card-shine p-7 group transition-all duration-500 cursor-default"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${industry.color}25, inset 0 0 40px ${industry.color}05`
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Large background number */}
      <div className="section-num">{industry.number}</div>

      {/* Header */}
      <div className="flex items-start justify-between mb-5 relative">
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 flex items-center justify-center transition-all duration-400 group-hover:scale-110"
            style={{
              border: `1px solid ${industry.color}35`,
              color: industry.color,
              backgroundColor: `${industry.color}0D`,
              boxShadow: `0 0 20px ${industry.color}00`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 20px ${industry.color}30` }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 20px ${industry.color}00` }}
          >
            {industryIcons[industry.id]}
          </div>
          <div>
            <p className="text-[9px] font-semibold tracking-[0.18em] uppercase mb-0.5"
              style={{ color: `${industry.color}80` }}>
              {industry.number} · Industry
            </p>
            <h3 className="text-lg font-bold text-white leading-tight">{industry.title}</h3>
          </div>
        </div>

        <motion.div
          whileHover={{ rotate: 45, scale: 1.1 }}
          transition={{ duration: 0.25 }}
          className="text-white/15 group-hover:text-white/35 transition-colors mt-0.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>

      {/* Color divider */}
      <div className="h-px w-full mb-5 transition-all duration-500 group-hover:w-full"
        style={{ background: `linear-gradient(to right, ${industry.color}30, transparent)` }} />

      {/* Impact points */}
      <ul className="space-y-2.5">
        {industry.impacts.map((impact, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.12 + i * 0.08 + 0.4, duration: 0.45 }}
            className="flex items-start gap-2.5 text-[13px] text-white/50 leading-snug"
          >
            <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
              style={{ backgroundColor: industry.color, opacity: 0.65 }} />
            {impact}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function IndustriesSection() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.08 })

  return (
    <section id="industries" className="snap-section relative overflow-y-auto">
      {/* Backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 15% 50%, rgba(0,127,255,0.05) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 85% 30%, rgba(81,43,212,0.04) 0%, transparent 50%)' }} />
      </div>
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-bg to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20 lg:py-24">
        {/* Header */}
        <div ref={ref} className="mb-14 max-w-3xl">
          <motion.p initial={{ opacity: 0 }} animate={hasBeenInView ? { opacity: 1 } : {}} className="section-subtitle">
            Domain Expertise
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 28 }} animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="section-title gradient-heading"
          >
            Industries I've
            <span style={{ background: 'linear-gradient(135deg, #007FFF, #4285F4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Engineered</span>
            <br />Solutions For
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="mt-5 text-white/38 text-[15px] leading-relaxed max-w-xl"
          >
            12+ years building mission-critical systems where performance, compliance,
            and reliability aren't optional — they define the product.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }} animate={hasBeenInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-14 h-px mt-6 origin-left"
            style={{ background: 'linear-gradient(to right, #007FFF, #4285F4)' }}
          />
        </div>

        {/* 2×2 grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {industries.map((industry, i) => (
            <IndustryCard key={industry.id} industry={industry} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
