import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { defaultBlogPosts, BLOG_ADMIN_PASSWORD, personal } from '../data/portfolioData'
import useInView from '../hooks/useInView'

const STORAGE_KEY = 'ds_portfolio_blogs'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function BlogCard({ post, index, onDelete, isAdmin }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.1 })
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="blog-card card-shine p-6 flex flex-col group"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-2 py-0.5 border border-azure/20 text-azure/60 bg-azure/05 font-medium tracking-wider uppercase"
              onClick={(e) => e.stopPropagation()}
            >
              {tag}
            </span>
          ))}
        </div>
        {isAdmin && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(post.id) }}
            className="text-white/15 hover:text-red-400 transition-colors text-xs p-1 flex-shrink-0"
            title="Delete post"
          >
            ×
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-bold text-white/85 group-hover:text-white leading-snug mb-3 transition-colors">
        {post.title}
      </h3>

      {/* Excerpt / expanded */}
      <AnimatePresence>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-[12px] text-white/45 leading-relaxed mb-3">{post.excerpt}</p>
            {post.content && post.content !== 'Full article content here...' && (
              <p className="text-[12px] text-white/35 leading-relaxed">{post.content}</p>
            )}
          </motion.div>
        ) : (
          <p className="text-[12px] text-white/40 leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 flex items-center justify-center border border-azure/25 bg-azure/08 text-azure text-[9px] font-bold">
            {post.author?.charAt(0) || 'D'}
          </div>
          <span className="text-[10px] text-white/30">{post.author || personal.name}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/25">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readTime}</span>
          <span className="text-azure/40 group-hover:text-azure transition-colors ml-1">
            {expanded ? '↑' : '↓'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function AdminModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', tags: '', readTime: '5 min read',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title required'
    if (!form.excerpt.trim()) e.excerpt = 'Excerpt required'
    if (!form.tags.trim()) e.tags = 'At least one tag required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (Object.keys(err).length) { setErrors(err); return }
    onSubmit({
      id: Date.now(),
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      readTime: form.readTime || '5 min read',
      date: new Date().toISOString().split('T')[0],
      author: personal.name,
    })
    onClose()
  }

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto modal-scroll"
        style={{ background: '#0C1120', border: '1px solid rgba(0,127,255,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <div>
            <h2 className="text-white font-semibold text-lg">Add New Post</h2>
            <p className="text-white/35 text-xs mt-0.5">Publish to your portfolio blog</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/25 transition-all text-lg">
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {[
            { name: 'title', label: 'Post Title', placeholder: 'Building Microservices with .NET 8...', type: 'input' },
            { name: 'excerpt', label: 'Short Excerpt (shown on card)', placeholder: 'A concise 1-2 sentence summary...', type: 'textarea', rows: 2 },
            { name: 'content', label: 'Full Content (optional)', placeholder: 'Write your full article here...', type: 'textarea', rows: 5 },
            { name: 'tags', label: 'Tags (comma-separated)', placeholder: '.NET 8, Azure, Microservices', type: 'input' },
            { name: 'readTime', label: 'Estimated Read Time', placeholder: '5 min read', type: 'input' },
          ].map(({ name, label, placeholder, type, rows }) => (
            <div key={name} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium tracking-widest text-white/35 uppercase">{label}</label>
              {type === 'input' ? (
                <input
                  type="text" name={name} value={form[name]} placeholder={placeholder}
                  onChange={(e) => { setForm(p => ({ ...p, [name]: e.target.value })); setErrors(p => ({ ...p, [name]: '' })) }}
                  className={`bg-transparent border px-4 py-2.5 text-[13px] text-white placeholder-white/15 focus:outline-none transition-colors ${errors[name] ? 'border-red-500/40' : 'border-white/10 focus:border-azure/40'}`}
                />
              ) : (
                <textarea
                  name={name} value={form[name]} placeholder={placeholder} rows={rows}
                  onChange={(e) => { setForm(p => ({ ...p, [name]: e.target.value })); setErrors(p => ({ ...p, [name]: '' })) }}
                  className={`bg-transparent border px-4 py-2.5 text-[13px] text-white placeholder-white/15 focus:outline-none resize-none transition-colors ${errors[name] ? 'border-red-500/40' : 'border-white/10 focus:border-azure/40'}`}
                />
              )}
              {errors[name] && <span className="text-[11px] text-red-400">{errors[name]}</span>}
            </div>
          ))}

          <div className="flex gap-3 mt-2">
            <button type="submit" className="btn-primary flex-1 py-3 text-xs">Publish Post</button>
            <button type="button" onClick={onClose} className="btn-secondary px-6 py-3 text-xs">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  )
}

function PasswordModal({ onSuccess, onClose }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pwd === BLOG_ADMIN_PASSWORD) {
      onSuccess()
    } else {
      setError('Incorrect password')
      setPwd('')
    }
  }

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-sm p-8"
        style={{ background: '#0C1120', border: '1px solid rgba(0,127,255,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white font-semibold text-lg mb-1.5">Admin Access</h3>
        <p className="text-white/35 text-xs mb-6">Enter your admin password to add or manage posts.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password" value={pwd} autoFocus
            onChange={(e) => { setPwd(e.target.value); setError('') }}
            placeholder="••••••••••"
            className="bg-transparent border border-white/10 focus:border-azure/40 px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none w-full"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" className="btn-primary w-full py-3 text-xs">Unlock</button>
        </form>
      </motion.div>
    </div>,
    document.body
  )
}

export default function BlogSection() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.08 })
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultBlogPosts
    } catch { return defaultBlogPosts }
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPwdModal, setShowPwdModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)) } catch {}
  }, [posts])

  const addPost = (post) => setPosts(prev => [post, ...prev])
  const deletePost = (id) => setPosts(prev => prev.filter(p => p.id !== id))

  const handleAdminClick = () => {
    if (isAdmin) setShowAddModal(true)
    else setShowPwdModal(true)
  }

  return (
    <section id="blog" className="snap-section relative overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(0,127,255,0.05) 0%, transparent 55%)' }} />
      </div>
      <div className="absolute inset-0 grid-bg opacity-18" />
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-bg to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20 lg:py-24">
        {/* Header */}
        <div ref={ref} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={hasBeenInView ? { opacity: 1 } : {}} className="section-subtitle">
              Writing
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 28 }} animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.1 }}
              className="section-title gradient-heading"
            >
              Insights &
              <span style={{ background: 'linear-gradient(135deg, #007FFF, #512BD4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Articles</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }} animate={hasBeenInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-14 h-px mt-5 origin-left"
              style={{ background: 'linear-gradient(to right, #007FFF, #512BD4)' }}
            />
          </div>

          {/* Admin controls */}
          <motion.div
            initial={{ opacity: 0 }} animate={hasBeenInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3"
          >
            {isAdmin && (
              <span className="text-[10px] text-emerald/70 border border-emerald/25 px-2.5 py-1 tracking-widest">
                ADMIN MODE
              </span>
            )}
            <button
              onClick={handleAdminClick}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-widest uppercase border border-azure/30 text-azure/70 bg-azure/05 hover:border-azure hover:text-azure hover:bg-azure/10 transition-all duration-300"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
              </svg>
              {isAdmin ? 'Add Post' : 'Write Here'}
            </button>
            {isAdmin && (
              <button onClick={() => setIsAdmin(false)}
                className="text-[10px] text-white/25 hover:text-white/50 transition-colors">
                Sign out
              </button>
            )}
          </motion.div>
        </div>

        {/* Blog grid */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={hasBeenInView ? { opacity: 1 } : {}}
            className="text-center py-20 text-white/20"
          >
            <div className="text-5xl mb-4 opacity-20">✍</div>
            <p className="text-sm tracking-widest">No posts yet. Be the first to write!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <BlogCard
                key={post.id}
                post={post}
                index={i}
                isAdmin={isAdmin}
                onDelete={deletePost}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPwdModal && (
          <PasswordModal
            onSuccess={() => { setIsAdmin(true); setShowPwdModal(false); setShowAddModal(true) }}
            onClose={() => setShowPwdModal(false)}
          />
        )}
        {showAddModal && (
          <AdminModal
            onSubmit={addPost}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
