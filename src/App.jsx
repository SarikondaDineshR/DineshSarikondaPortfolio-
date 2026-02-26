import React, { Suspense, lazy, useRef } from 'react'
import Navbar from './components/Navbar'
import SoundToggle from './components/SoundToggle'
import NoiseOverlay from './components/NoiseOverlay'
import ScrollProgress from './components/ScrollProgress'
import ParticleField from './components/ParticleField'
import useAmbientSound from './hooks/useAmbientSound'
import usePerformance from './hooks/usePerformance'

const HeroSection          = lazy(() => import('./sections/HeroSection'))
const IndustriesSection    = lazy(() => import('./sections/IndustriesSection'))
const ArchitectureSection  = lazy(() => import('./sections/ArchitectureSection'))
const ProjectsSection      = lazy(() => import('./sections/ProjectsSection'))
const CertificationsSection = lazy(() => import('./sections/CertificationsSection'))
const BlogSection          = lazy(() => import('./sections/BlogSection'))
const ContactSection       = lazy(() => import('./sections/ContactSection'))

function SectionLoader() {
  return (
    <div className="snap-section flex items-center justify-center" style={{ background: '#080C15' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border border-azure/20 border-t-azure rounded-full animate-spin" />
        <div className="w-1 h-1 rounded-full bg-azure/40 animate-pulse" />
      </div>
    </div>
  )
}

export default function App() {
  const scrollRef = useRef(null)
  const { isPlaying, toggle, isSupported } = useAmbientSound()
  const { isLowPerf } = usePerformance()

  return (
    <div className="relative" style={{ background: '#080C15' }}>
      {/* Fixed backgrounds */}
      <NoiseOverlay />
      {!isLowPerf && <ParticleField />}

      {/* UI chrome */}
      <Navbar scrollRef={scrollRef} />
      <ScrollProgress scrollRef={scrollRef} />
      <SoundToggle isPlaying={isPlaying} toggle={toggle} isSupported={isSupported} />

      {/* Scroll container */}
      <div ref={scrollRef} className="scroll-container" id="scroll-container">
        <Suspense fallback={<SectionLoader />}>
          <HeroSection isLowPerf={isLowPerf} />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <IndustriesSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ArchitectureSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ProjectsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <CertificationsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <BlogSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ContactSection />
        </Suspense>
      </div>
    </div>
  )
}
