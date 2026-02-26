import React from 'react'
import { motion } from 'framer-motion'
import { certifications } from '../data/portfolioData'
import useInView from '../hooks/useInView'

const certIcons = {
  'azure-arch': (
    <svg viewBox="0 0 60 60" fill="none" className="w-10 h-10">
      <path d="M30 8L10 48H50L30 8Z" fill="none" stroke="#007FFF" strokeWidth="2"/>
      <path d="M22 35L30 20L38 35" stroke="#007FFF" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="30" cy="20" r="3" fill="#007FFF"/>
      <path d="M18 48L30 28L42 48" stroke="rgba(0,127,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'aws-ai': (
    <svg viewBox="0 0 60 60" fill="none" className="w-10 h-10">
      <path d="M10 38C10 38 15 42 30 42C45 42 50 38 50 38" stroke="#FF9900" strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 38L6 44M50 38L54 44" stroke="#FF9900" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 28V32M22 26V32M26 24V32M30 22V32M34 24V32M38 26V32M42 28V32" stroke="#FF9900" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="30" cy="18" r="4" fill="#FF9900" fillOpacity="0.3" stroke="#FF9900" strokeWidth="1.5"/>
    </svg>
  ),
  'gcp-arch': (
    <svg viewBox="0 0 60 60" fill="none" className="w-10 h-10">
      <circle cx="30" cy="30" r="16" stroke="#4285F4" strokeWidth="1.5" strokeDasharray="4 3"/>
      <circle cx="30" cy="20" r="4" fill="#4285F4" fillOpacity="0.3" stroke="#4285F4" strokeWidth="1.5"/>
      <circle cx="20" cy="36" r="3.5" fill="#EA4335" fillOpacity="0.3" stroke="#EA4335" strokeWidth="1.5"/>
      <circle cx="40" cy="36" r="3.5" fill="#34A853" fillOpacity="0.3" stroke="#34A853" strokeWidth="1.5"/>
      <path d="M30 24L20 33M30 24L40 33" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2"/>
    </svg>
  ),
}

const providerLogos = {
  'azure-arch': { short: 'MSFT', bgColor: 'rgba(0,127,255,0.08)', borderColor: 'rgba(0,127,255,0.2)' },
  'aws-ai':     { short: 'AWS',  bgColor: 'rgba(255,153,0,0.08)',  borderColor: 'rgba(255,153,0,0.2)' },
  'gcp-arch':   { short: 'GCP',  bgColor: 'rgba(66,133,244,0.08)', borderColor: 'rgba(66,133,244,0.2)' },
}

function CertCard({ cert, index }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.2 })
  const logo = providerLogos[cert.id]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="premium-card card-shine group cursor-default transition-all duration-500"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = `0 30px 70px rgba(0,0,0,0.5), 0 0 0 1px ${cert.color}30, 0 0 50px ${cert.color}08`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Top color strip */}
      <div className="h-0.5 w-full"
        style={{ background: `linear-gradient(to right, ${cert.color}, transparent)` }} />

      <div className="p-8 text-center">
        {/* Icon */}
        <div
          className="w-20 h-20 flex items-center justify-center mx-auto mb-5 transition-all duration-400 group-hover:scale-105"
          style={{
            border: `1px solid ${cert.color}25`,
            backgroundColor: `${cert.color}08`,
            boxShadow: `0 0 30px ${cert.color}00`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 30px ${cert.color}20` }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 30px ${cert.color}00` }}
        >
          {certIcons[cert.id]}
        </div>

        {/* Vendor */}
        <p className="text-[9px] font-semibold tracking-[0.2em] uppercase mb-2"
          style={{ color: `${cert.color}70` }}>
          {cert.vendor}
        </p>

        {/* Title */}
        <h3 className="text-xl font-bold text-white leading-tight mb-1">{cert.title}</h3>
        <p className="text-white/35 text-[13px] mb-5">{cert.subtitle}</p>

        {/* Credential + year */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className="px-3 py-1.5 text-[11px] font-mono font-semibold"
            style={{
              border: `1px solid ${cert.color}25`,
              color: `${cert.color}80`,
              backgroundColor: `${cert.color}08`,
            }}
          >
            {cert.credential}
          </div>
          <span className="text-[10px] text-white/25">{cert.year}</span>
        </div>

        {/* Description */}
        <p className="text-[11px] text-white/28 leading-relaxed">{cert.description}</p>

        {/* Verified checkmark */}
        <div className="absolute top-4 right-4">
          <div
            className="w-6 h-6 flex items-center justify-center"
            style={{ border: `1px solid ${cert.color}25`, backgroundColor: `${cert.color}08` }}
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ color: `${cert.color}60` }}>
              <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CertificationsSection() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.08 })

  return (
    <section id="certifications" className="snap-section relative flex items-center overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,127,255,0.06) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 80%, rgba(255,153,0,0.04) 0%, transparent 45%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 20%, rgba(66,133,244,0.04) 0%, transparent 45%)' }} />
      </div>
      <div className="absolute inset-0 grid-bg opacity-22" />
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-bg to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
        {/* Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.p initial={{ opacity: 0 }} animate={hasBeenInView ? { opacity: 1 } : {}} className="section-subtitle">
            Professional Credentials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 28 }} animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="section-title gradient-heading"
          >
            Cloud
            <span style={{ background: 'linear-gradient(135deg, #007FFF 0%, #FF9900 50%, #4285F4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Certifications</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-white/35 text-[14px] max-w-xl mx-auto"
          >
            Industry-recognized credentials validating deep expertise across
            Microsoft Azure, Amazon Web Services, and Google Cloud Platform.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }} animate={hasBeenInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-14 h-px mt-6 origin-center mx-auto"
            style={{ background: 'linear-gradient(to right, #007FFF, #FF9900, #4285F4)' }}
          />
        </div>

        {/* 3-col cert cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {certifications.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: '12+', label: 'Years Experience', color: '#007FFF' },
            { value: '3', label: 'Cloud Platforms', color: '#FF9900' },
            { value: '60+', label: 'Projects Delivered', color: '#4285F4' },
            { value: '3', label: 'Certifications', color: '#512BD4' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold mb-1" style={{
                background: `linear-gradient(135deg, ${stat.color}, ${stat.color}80)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {stat.value}
              </p>
              <p className="text-[10px] text-white/28 font-medium tracking-widest uppercase">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
