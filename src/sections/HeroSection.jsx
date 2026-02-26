import React, { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { personal } from '../data/portfolioData'
import TechTicker from '../components/TechTicker'

const CloudInfrastructure = lazy(() => import('../components/CloudInfrastructure'))

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.4 } }
}
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } }
}

const cloudProviders = [
  { label: 'Azure', color: '#007FFF', dotColor: '#007FFF' },
  { label: 'AWS', color: '#FF9900', dotColor: '#FF9900' },
  { label: 'GCP', color: '#4285F4', dotColor: '#4285F4' },
]

export default function HeroSection({ isLowPerf }) {
  return (
    <section id="hero" className="snap-section relative flex flex-col overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 65% 50%, rgba(0,127,255,0.09) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 50% 40% at 20% 70%, rgba(81,43,212,0.07) 0%, transparent 55%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 40% 35% at 75% 20%, rgba(255,153,0,0.04) 0%, transparent 50%)',
        }} />
      </div>
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Top / bottom fades */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-bg to-transparent z-10 pointer-events-none" />

      {/* Main content */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-20">

            {/* Left: Text */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="z-10"
            >
              {/* Availability badge */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-2.5 px-3.5 py-2 border border-emerald/30 bg-emerald/[0.06] backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" style={{ boxShadow: '0 0 6px #00C896' }} />
                  <span className="text-[10px] text-emerald/90 font-semibold tracking-[0.15em] uppercase">
                    {personal.status}
                  </span>
                </div>
              </motion.div>

              {/* Name */}
              <motion.div variants={itemVariants} className="mb-6">
                <p className="section-subtitle mb-2">Senior .NET Full Stack Developer</p>
                <h1 className="font-bold tracking-tight leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
                  <span className="gradient-heading">Dinesh Revanth</span>
                  <span className="block" style={{
                    background: 'linear-gradient(135deg, #007FFF 0%, #4285F4 50%, #512BD4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Sarikonda
                  </span>
                </h1>
              </motion.div>

              {/* Cloud provider badges */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-6">
                {cloudProviders.map((cp) => (
                  <span key={cp.label} className={`cloud-badge cloud-badge-${cp.label.toLowerCase()}`}>
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: cp.dotColor }} />
                    {cp.label}
                  </span>
                ))}
                <span className="cloud-badge" style={{
                  borderColor: 'rgba(81,43,212,0.4)', color: '#9B7CF7',
                  background: 'rgba(81,43,212,0.08)',
                }}>
                  <span className="w-1 h-1 rounded-full bg-[#9B7CF7]" />
                  .NET
                </span>
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants} className="mb-7">
                <div className="line-accent" />
                <p className="text-[15px] text-white/55 font-light leading-relaxed max-w-lg">
                  Architecting enterprise-grade cloud solutions across Azure, AWS & GCP
                  for Banking, Finance, Investment & Insurance — 12+ years building
                  systems that scale, perform, and endure.
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-5 mb-7">
                {personal.stats.map((stat) => (
                  <div key={stat.label} className="relative">
                    <p className="stat-value" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-white/35 font-medium mt-0.5 tracking-wide uppercase">
                      {stat.label}
                    </p>
                    <div className="absolute bottom-0 left-0 w-6 h-px bg-azure/30 mt-2" />
                  </div>
                ))}
              </motion.div>

              {/* Hero tags */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-8">
                {personal.heroTags.map((tag) => (
                  <span key={tag} className="tech-tag">{tag}</span>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <button
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary"
                >
                  View Projects
                </button>
                <a
                  href={personal.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Download Resume
                </a>
              </motion.div>

              {/* Scroll hint */}
              <motion.div variants={itemVariants} className="mt-10 flex items-center gap-3 text-white/20">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="w-4 h-6 border border-white/15 rounded-full flex items-start justify-center pt-1"
                >
                  <div className="w-0.5 h-1.5 bg-white/25 rounded-full" />
                </motion.div>
                <span className="text-[10px] tracking-widest uppercase">Scroll to explore</span>
              </motion.div>
            </motion.div>

            {/* Right: 3D Multi-Cloud */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-[380px] md:h-[480px] lg:h-[580px] relative"
            >
              {/* Multi-color glow behind canvas */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: `
                  radial-gradient(ellipse 60% 60% at 35% 40%, rgba(0,127,255,0.12) 0%, transparent 60%),
                  radial-gradient(ellipse 40% 40% at 70% 30%, rgba(255,153,0,0.07) 0%, transparent 55%),
                  radial-gradient(ellipse 40% 40% at 60% 70%, rgba(66,133,244,0.07) 0%, transparent 55%)
                `,
                filter: 'blur(30px)',
              }} />

              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-azure/20 border-t-azure rounded-full animate-spin" />
                </div>
              }>
                <CloudInfrastructure isLowPerf={isLowPerf} />
              </Suspense>

              {/* Cloud provider legend */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-4 z-10">
                {cloudProviders.map((cp) => (
                  <div key={cp.label} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cp.color }} />
                    <span className="text-[9px] tracking-widest uppercase" style={{ color: `${cp.color}70` }}>{cp.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Tech ticker strip */}
      <div className="relative z-10">
        <TechTicker />
      </div>

      {/* Side decoration */}
      <div className="absolute top-1/3 right-8 text-[9px] text-white/08 font-mono tracking-widest vertical-text hidden xl:block select-none">
        AZURE · AWS · GCP · .NET
      </div>
    </section>
  )
}
