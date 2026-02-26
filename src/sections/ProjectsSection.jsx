import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '../data/portfolioData'
import useInView from '../hooks/useInView'

function ArchViz({ architecture, isActive }) {
  const { nodes, connections } = architecture
  return (
    <div className="w-full rounded-sm overflow-hidden" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <svg viewBox="0 0 100 100" className="w-full" style={{ height: '130px' }} preserveAspectRatio="xMidYMid meet">
        {connections.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ delay: i * 0.07 + 0.25, duration: 0.4 }}
          />
        ))}
        {nodes.map((node, i) => (
          <g key={node.label}>
            <motion.circle
              cx={node.x} cy={node.y} r="3.5"
              fill={node.color}
              initial={{ scale: 0, opacity: 0 }}
              animate={isActive ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: i * 0.09 + 0.2, duration: 0.35 }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            />
            <motion.circle
              cx={node.x} cy={node.y} r="6"
              fill={node.color} fillOpacity="0.08"
              initial={{ scale: 0, opacity: 0 }}
              animate={isActive ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: i * 0.09 + 0.3 }}
            />
            <motion.text
              x={node.x} y={node.y + 10}
              textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="4.5"
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.09 + 0.5 }}
            >
              {node.label}
            </motion.text>
          </g>
        ))}
        {/* Animated data pulse */}
        {isActive && connections.slice(0, 3).map(([a, b], i) => (
          <motion.circle
            key={`pulse-${i}`}
            r="1.8" fill={nodes[a].color}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.9, 0],
              x: [nodes[a].x, nodes[b].x],
              y: [nodes[a].y, nodes[b].y],
            }}
            transition={{ duration: 1.8, delay: i * 0.6 + 1.2, repeat: Infinity, repeatDelay: 0.8 }}
          />
        ))}
      </svg>
    </div>
  )
}

function ProjectTab({ project, isActive, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className={`w-full text-left p-4 transition-all duration-300 border-l-2 ${
        isActive
          ? 'bg-white/[0.03] border-azure'
          : 'border-transparent hover:border-white/15 hover:bg-white/[0.02]'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[9px] font-semibold tracking-[0.15em] px-2 py-0.5 uppercase"
          style={{
            color: project.industryColor,
            border: `1px solid ${project.industryColor}30`,
            backgroundColor: `${project.industryColor}0D`,
          }}
        >
          {project.industry}
        </span>
        <span className="text-[10px] text-white/20 font-mono">{project.number}</span>
      </div>
      <h3 className={`text-[13px] font-semibold leading-snug transition-colors ${isActive ? 'text-white' : 'text-white/55'}`}>
        {project.title}
      </h3>
      <p className="text-[11px] text-white/28 mt-1">{project.subtitle}</p>

      {/* Cloud badge */}
      <div className="mt-2">
        <span className="text-[9px] text-white/20 font-mono">{project.cloud}</span>
      </div>
    </motion.button>
  )
}

export default function ProjectsSection() {
  const [active, setActive] = useState(0)
  const { ref, hasBeenInView } = useInView({ threshold: 0.08 })
  const project = projects[active]

  return (
    <section id="projects" className="snap-section relative overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 80%, rgba(0,127,255,0.05) 0%, transparent 55%)' }} />
      </div>
      <div className="absolute inset-0 grid-bg opacity-18" />
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-bg to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20 lg:py-24">
        {/* Header */}
        <div ref={ref} className="mb-12">
          <motion.p initial={{ opacity: 0 }} animate={hasBeenInView ? { opacity: 1 } : {}} className="section-subtitle">
            Selected Work
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 28 }} animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="section-title gradient-heading"
          >
            Enterprise
            <span style={{ background: 'linear-gradient(135deg, #007FFF, #512BD4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Projects</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }} animate={hasBeenInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-14 h-px mt-5 origin-left"
            style={{ background: 'linear-gradient(to right, #007FFF, #512BD4)' }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: project list — independently scrollable */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div
              className="border border-white/[0.06] divide-y divide-white/[0.04]"
              style={{ maxHeight: '65vh', overflowY: 'auto', overflowX: 'hidden' }}
            >
              {projects.map((proj, i) => (
                <ProjectTab
                  key={proj.id}
                  project={proj}
                  isActive={active === i}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
            <p className="text-[9px] text-white/20 mt-2 ml-1 tracking-wider">
              {projects.length} projects · scroll to see all
            </p>
          </div>

          {/* Right: detail panel */}
          <div className="lg:col-span-8 xl:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                {/* Project top */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className="text-[10px] font-semibold tracking-[0.14em] px-3 py-1 uppercase"
                        style={{
                          color: project.industryColor,
                          border: `1px solid ${project.industryColor}35`,
                          backgroundColor: `${project.industryColor}0D`,
                        }}
                      >
                        {project.industry}
                      </span>
                      <span
                        className="text-[10px] font-medium tracking-widest px-3 py-1 uppercase"
                        style={{
                          color: `${project.cloudColor}90`,
                          border: `1px solid ${project.cloudColor}25`,
                          backgroundColor: `${project.cloudColor}08`,
                        }}
                      >
                        {project.cloud}
                      </span>
                      <span className="text-white/20 font-mono text-[11px]">{project.number} / 0{projects.length}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold gradient-heading leading-tight">{project.title}</h3>
                    <p className="mt-1.5 text-sm text-white/40">{project.subtitle}</p>
                  </div>
                </div>

                {/* Architecture viz */}
                <ArchViz architecture={project.architecture} isActive={true} />

                {/* Description */}
                <p className="mt-5 text-[13px] text-white/45 leading-relaxed">{project.description}</p>

                {/* Impact */}
                <div className="mt-5">
                  <p className="text-[9px] text-white/25 tracking-[0.18em] uppercase mb-3">Key Impact</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {project.impact.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-start gap-2.5 text-[12px] text-white/52"
                      >
                        <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: project.industryColor }} />
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Stack */}
                <div className="mt-5">
                  <p className="text-[9px] text-white/25 tracking-[0.18em] uppercase mb-3">Technology Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
