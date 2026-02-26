import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { label: 'Home', id: 'hero' },
  { label: 'Industries', id: 'industries' },
  { label: 'Skills', id: 'architecture' },
  { label: 'Projects', id: 'projects' },
  { label: 'Certifications', id: 'certifications' },
  { label: 'Blog', id: 'blog' },
  { label: 'Contact', id: 'contact' },
]

export default function Navbar({ scrollRef }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const container = scrollRef?.current
    if (!container) return

    const handleScroll = () => {
      setScrolled(container.scrollTop > 50)

      // Determine active section
      const sections = navItems.map(item => ({
        id: item.id,
        el: document.getElementById(item.id)
      }))

      const viewportMid = container.scrollTop + container.clientHeight / 2

      for (const section of sections) {
        if (!section.el) continue
        const top = section.el.offsetTop
        const bottom = top + section.el.offsetHeight

        if (viewportMid >= top && viewportMid < bottom) {
          setActiveSection(section.id)
          break
        }
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [scrollRef])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-bg/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 border border-azure/50 flex items-center justify-center group-hover:border-azure group-hover:shadow-[0_0_15px_rgba(0,127,255,0.4)] transition-all duration-300">
              <span className="text-azure font-bold text-sm">DS</span>
            </div>
            <span className="text-white/70 font-medium text-sm tracking-wider hidden sm:block">
              DINESH SARIKONDA
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-xs font-medium tracking-widest uppercase transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-azure'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="navIndicator"
                    className="h-px bg-azure mt-1 w-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <button
              onClick={() => scrollTo('contact')}
              className="btn-primary text-xs py-2 px-5"
            >
              Hire Me
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white/70 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-bg/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-left text-sm font-medium tracking-widest uppercase py-2 transition-colors ${
                    activeSection === item.id ? 'text-azure' : 'text-white/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo('contact')}
                className="btn-primary text-xs py-2 mt-2"
              >
                Hire Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
