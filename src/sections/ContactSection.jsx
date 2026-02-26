import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { personal } from '../data/portfolioData'
import useInView from '../hooks/useInView'

const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'
const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'

const contactLinks = [
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/dineshsarikonda',
    href: personal.linkedin,
    color: '#007FFF',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    value: personal.email,
    href: `mailto:${personal.email}`,
    color: '#4285F4',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Phone',
    value: personal.phone,
    href: `tel:${personal.phone.replace(/[^0-9]/g, '')}`,
    color: '#00C896',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.96 5.96l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'github.com/dinesh-sarikonda',
    href: personal.github,
    color: '#AA55FF',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
]

function SuccessCheck() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className="flex flex-col items-center gap-5 py-10"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 220 }}
          className="w-16 h-16 flex items-center justify-center"
          style={{ border: '1px solid rgba(0,200,150,0.4)', background: 'rgba(0,200,150,0.08)' }}
        >
          <motion.svg className="w-8 h-8 text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <motion.polyline points="20 6 9 17 4 12" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.4 }} />
          </motion.svg>
        </motion.div>
        <motion.div className="absolute inset-0 border border-emerald/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }} />
      </div>
      <div className="text-center">
        <h3 className="text-white font-semibold text-xl mb-2">Message Sent!</h3>
        <p className="text-white/35 text-sm">I'll get back to you within 24 hours.</p>
      </div>
    </motion.div>
  )
}

export default function ContactSection() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.08 })
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!formData.name.trim()) e.name = 'Name required'
    if (!formData.email.trim()) e.email = 'Email required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email'
    if (!formData.subject.trim()) e.subject = 'Subject required'
    if (formData.message.trim().length < 10) e.message = 'Message too short'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const submitToSheets = async (data) => {
    if (GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') return
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: new Date().toISOString(), ...data }),
      })
    } catch {}
  }

  const sendEmail = async (data) => {
    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') return
    const emailjs = await import('emailjs-com')
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
      { from_name: data.name, from_email: data.email, subject: data.subject, message: data.message },
      EMAILJS_PUBLIC_KEY
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('submitting')
    try {
      await Promise.allSettled([sendEmail(formData), submitToSheets(formData)])
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch { setStatus('error') }
  }

  const inputClass = (field) =>
    `bg-transparent border px-4 py-3 text-[13px] text-white placeholder-white/18 focus:outline-none transition-all duration-300 w-full ${
      errors[field]
        ? 'border-red-500/40 focus:border-red-400/60'
        : 'border-white/08 focus:border-azure/45 hover:border-white/15'
    }`

  return (
    <section id="contact" className="snap-section relative overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 60%, rgba(0,127,255,0.06) 0%, transparent 50%)' }} />
      </div>
      <div className="absolute inset-0 grid-bg opacity-18" />
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-bg to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* Left */}
          <div ref={ref} className="lg:col-span-2">
            <motion.p initial={{ opacity: 0 }} animate={hasBeenInView ? { opacity: 1 } : {}} className="section-subtitle">
              Get In Touch
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 28 }} animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.1 }}
              className="section-title gradient-heading mb-6"
            >
              Let's
              <span style={{ background: 'linear-gradient(135deg, #007FFF, #512BD4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Build</span>
              <br />Together
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }} animate={hasBeenInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-14 h-px mb-8 origin-left"
              style={{ background: 'linear-gradient(to right, #007FFF, #512BD4)' }}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-white/38 text-[13px] leading-relaxed mb-10"
            >
              Available for senior engineering roles, cloud architecture consulting,
              and technical leadership. Let's discuss how 12+ years of multi-cloud
              enterprise expertise can elevate your team.
            </motion.p>

            {/* Contact links */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col gap-4"
            >
              {contactLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -14 }}
                  animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3.5 group w-fit"
                >
                  <div
                    className="w-9 h-9 flex items-center justify-center border transition-all duration-300 group-hover:scale-105"
                    style={{
                      borderColor: `${link.color}25`,
                      color: `${link.color}70`,
                      backgroundColor: `${link.color}08`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${link.color}60`
                      e.currentTarget.style.color = link.color
                      e.currentTarget.style.boxShadow = `0 0 16px ${link.color}20`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${link.color}25`
                      e.currentTarget.style.color = `${link.color}70`
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {link.icon}
                  </div>
                  <div>
                    <p className="text-[9px] text-white/25 tracking-widest uppercase mb-0.5">{link.label}</p>
                    <p className="text-[12px] text-white/55 group-hover:text-white transition-colors">{link.value}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0 }} animate={hasBeenInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
              className="mt-8 flex items-center gap-2 text-white/20"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="text-[11px]">{personal.location}</span>
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 36 }} animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 premium-card p-8"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <SuccessCheck key="success" />
              ) : (
                <motion.form
                  key="form" onSubmit={handleSubmit}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col gap-5" noValidate
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold tracking-[0.18em] text-white/30 uppercase">Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Smith" className={inputClass('name')} />
                      {errors.name && <span className="text-[11px] text-red-400">{errors.name}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold tracking-[0.18em] text-white/30 uppercase">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@company.com" className={inputClass('email')} />
                      {errors.email && <span className="text-[11px] text-red-400">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-semibold tracking-[0.18em] text-white/30 uppercase">Subject</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Senior Azure .NET Role — [Company Name]" className={inputClass('subject')} />
                    {errors.subject && <span className="text-[11px] text-red-400">{errors.subject}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-semibold tracking-[0.18em] text-white/30 uppercase">Message</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about the opportunity, team, and tech stack..." rows={5} className={inputClass('message') + ' resize-none'} />
                    {errors.message && <span className="text-[11px] text-red-400">{errors.message}</span>}
                  </div>

                  {status === 'error' && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 text-center">
                      Something went wrong. Please reach me directly at {personal.email}
                    </motion.p>
                  )}

                  <motion.button
                    type="submit" disabled={status === 'submitting'}
                    whileHover={{ scale: status === 'submitting' ? 1 : 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`btn-primary w-full flex items-center justify-center gap-3 py-4 mt-1 ${status === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {status === 'submitting' ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-azure/25 border-t-azure rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="22" y1="2" x2="11" y2="13" strokeLinecap="round"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      </>
                    )}
                  </motion.button>
                  <p className="text-[9px] text-white/18 text-center tracking-wider">Sent securely · No spam, ever</p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={hasBeenInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-white/18 text-[11px]">
            © {new Date().getFullYear()} {personal.name}. All rights reserved.
          </p>
          <p className="text-white/12 text-[10px] font-mono tracking-wider">
            Azure · AWS · GCP · .NET · React
          </p>
        </motion.div>
      </div>
    </section>
  )
}
