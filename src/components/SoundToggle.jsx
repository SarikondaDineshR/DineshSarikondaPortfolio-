import React from 'react'
import { motion } from 'framer-motion'

export default function SoundToggle({ isPlaying, toggle, isSupported }) {
  if (!isSupported) return null

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5 }}
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center border border-white/20 bg-bg/60 backdrop-blur-md hover:border-azure/50 hover:bg-azure/10 transition-all duration-300 group"
      aria-label={isPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
      title={isPlaying ? 'Mute ambient sound' : 'Enable ambient sound'}
    >
      {isPlaying ? (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="relative"
        >
          {/* Sound waves animation */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-azure">
            <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
            <motion.path
              d="M15.54 8.46a5 5 0 0 1 0 7.07"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.path
              d="M19.07 4.93a10 10 0 0 1 0 14.14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
          </svg>
        </motion.div>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/40 group-hover:text-white/70 transition-colors">
          <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
          <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )}

      {/* Ripple effect when playing */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 border border-azure/20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  )
}
