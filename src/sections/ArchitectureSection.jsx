import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { skillCategories } from '../data/portfolioData'
import useInView from '../hooks/useInView'

function SkillCard({ category, index }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.08 })
  const [expanded, setExpanded] = useState(false)
  const visibleSkills = expanded ? category.skills : category.skills.slice(0, 8)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="premium-card card-shine p-6 group transition-all duration-500"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px ${category.color}20`
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Category header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center text-lg transition-all duration-300 group-hover:scale-110"
            style={{
              border: `1px solid ${category.color}25`,
              backgroundColor: `${category.color}0D`,
              color: category.color,
            }}
          >
            {category.icon}
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-white tracking-wide leading-tight">
              {category.label}
            </h3>
            <p className="text-[9px] text-white/25 mt-0.5">{category.skills.length} skills</p>
          </div>
        </div>

        {/* Animated underline on hover */}
        <div
          className="h-px w-0 group-hover:w-10 transition-all duration-500"
          style={{ backgroundColor: `${category.color}50` }}
        />
      </div>

      {/* Skills wrap */}
      <div className="flex flex-wrap gap-1.5">
        <AnimatePresence>
          {visibleSkills.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ delay: hasBeenInView ? index * 0.06 + i * 0.03 : 0, duration: 0.3 }}
              className="text-[10px] px-2.5 py-1 font-medium tracking-wide cursor-default transition-all duration-200"
              style={{
                border: `1px solid ${category.color}18`,
                color: `${category.color}80`,
                backgroundColor: `${category.color}07`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${category.color}55`
                e.currentTarget.style.color = category.color
                e.currentTarget.style.backgroundColor = `${category.color}12`
                e.currentTarget.style.boxShadow = `0 0 10px ${category.color}18`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${category.color}18`
                e.currentTarget.style.color = `${category.color}80`
                e.currentTarget.style.backgroundColor = `${category.color}07`
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {skill}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Expand / collapse */}
      {category.skills.length > 8 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-[10px] tracking-widest font-medium uppercase transition-colors duration-200 flex items-center gap-1.5"
          style={{ color: `${category.color}60` }}
          onMouseEnter={(e) => { e.currentTarget.style.color = category.color }}
          onMouseLeave={(e) => { e.currentTarget.style.color = `${category.color}60` }}
        >
          {expanded ? '− Show less' : `+ ${category.skills.length - 8} more`}
        </button>
      )}
    </motion.div>
  )
}

function ArchitectureLayers() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.2 })

  const layers = [
    { label: 'Client Layer', items: ['React / Angular', 'Blazor WASM', 'Mobile / MAUI'], color: '#61DAFB' },
    { label: 'API Gateway', items: ['Azure API Mgmt', 'AWS API GW', 'Apigee (GCP)'], color: '#007FFF' },
    { label: '.NET Services', items: ['ASP.NET Core 8', 'gRPC / SignalR', 'Worker Services'], color: '#512BD4' },
    { label: 'Messaging', items: ['Kafka', 'Service Bus', 'SQS / SNS'], color: '#FF6B35' },
    { label: 'Data Layer', items: ['SQL Server / PostgreSQL', 'CosmosDB / DynamoDB', 'Redis Cache'], color: '#00C896' },
  ]

  return (
    <div ref={ref} className="mt-16 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={hasBeenInView ? { opacity: 1 } : {}}
        className="text-center mb-8"
      >
        <p className="text-[10px] text-white/25 tracking-widest uppercase mb-1.5">Reference Architecture</p>
        <h3 className="text-base font-medium text-white/50">Multi-Cloud .NET Platform Blueprint</h3>
      </motion.div>

      <div className="space-y-2">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, x: -24 }}
            animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.12 + 0.2, duration: 0.55 }}
            className="flex items-center gap-4"
          >
            <div className="w-28 text-right flex-shrink-0">
              <span className="text-[10px] text-white/25 tracking-wider font-medium">{layer.label}</span>
            </div>
            <div className="text-white/15 text-xs flex-shrink-0">→</div>
            <div className="flex-1 flex gap-2 flex-wrap">
              {layer.items.map((item) => (
                <span
                  key={item}
                  className="text-[11px] px-3 py-1.5 font-medium transition-all duration-200 hover:opacity-80"
                  style={{
                    border: `1px solid ${layer.color}20`,
                    color: `${layer.color}75`,
                    backgroundColor: `${layer.color}07`,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function ArchitectureSection() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.08 })

  return (
    <section id="architecture" className="snap-section relative overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 25%, rgba(0,127,255,0.05) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 75%, rgba(81,43,212,0.04) 0%, transparent 50%)' }} />
      </div>
      <div className="absolute inset-0 grid-bg opacity-18" />
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-bg to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20 lg:py-24">
        {/* Header */}
        <div ref={ref} className="mb-14 max-w-3xl">
          <motion.p initial={{ opacity: 0 }} animate={hasBeenInView ? { opacity: 1 } : {}} className="section-subtitle">
            Technical Proficiency
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 28 }} animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="section-title gradient-heading"
          >
            Architecting
            <span style={{ background: 'linear-gradient(135deg, #512BD4, #007FFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Scalable</span>
            <br />Cloud Systems
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }} animate={hasBeenInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-14 h-px mt-6 origin-left"
            style={{ background: 'linear-gradient(to right, #512BD4, #007FFF)' }}
          />
        </div>

        {/* 4-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillCategories.map((category, i) => (
            <SkillCard key={category.id} category={category} index={i} />
          ))}
        </div>

        <ArchitectureLayers />
      </div>
    </section>
  )
}
