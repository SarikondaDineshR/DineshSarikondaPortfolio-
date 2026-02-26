import { useState, useEffect, useRef, useCallback } from 'react'

export default function useAmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioCtxRef = useRef(null)
  const gainNodeRef = useRef(null)
  const nodesRef = useRef([])

  // Create ambient drone sound using Web Audio API
  const createAmbientSound = useCallback(() => {
    if (audioCtxRef.current) return

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) {
        setIsSupported(false)
        return
      }

      const ctx = new AudioContext()
      audioCtxRef.current = ctx

      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(0, ctx.currentTime)
      masterGain.connect(ctx.destination)
      gainNodeRef.current = masterGain

      // Create ambient drone with multiple oscillators
      const frequencies = [55, 82.5, 110, 165] // A1, E2, A2, E3
      const nodes = []

      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const oscGain = ctx.createGain()
        const filter = ctx.createBiquadFilter()

        osc.type = i % 2 === 0 ? 'sine' : 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)

        // Slight detune for richness
        osc.detune.setValueAtTime((i - 2) * 5, ctx.currentTime)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(400, ctx.currentTime)
        filter.Q.setValueAtTime(1, ctx.currentTime)

        oscGain.gain.setValueAtTime(0.08 / frequencies.length, ctx.currentTime)

        osc.connect(filter)
        filter.connect(oscGain)
        oscGain.connect(masterGain)
        osc.start()

        // Slow LFO modulation
        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()
        lfo.frequency.setValueAtTime(0.1 + i * 0.05, ctx.currentTime)
        lfoGain.gain.setValueAtTime(2, ctx.currentTime)
        lfo.connect(lfoGain)
        lfoGain.connect(osc.detune)
        lfo.start()

        nodes.push({ osc, oscGain, filter, lfo, lfoGain })
      })

      // Add subtle high-frequency shimmer
      const shimmerOsc = ctx.createOscillator()
      const shimmerGain = ctx.createGain()
      const shimmerFilter = ctx.createBiquadFilter()

      shimmerOsc.type = 'sine'
      shimmerOsc.frequency.setValueAtTime(2200, ctx.currentTime)
      shimmerFilter.type = 'highpass'
      shimmerFilter.frequency.setValueAtTime(1800, ctx.currentTime)
      shimmerGain.gain.setValueAtTime(0.015, ctx.currentTime)

      shimmerOsc.connect(shimmerFilter)
      shimmerFilter.connect(shimmerGain)
      shimmerGain.connect(masterGain)
      shimmerOsc.start()

      nodes.push({ osc: shimmerOsc, oscGain: shimmerGain })
      nodesRef.current = nodes

    } catch (err) {
      console.warn('Audio not supported:', err)
      setIsSupported(false)
    }
  }, [])

  const play = useCallback(() => {
    if (!audioCtxRef.current) {
      createAmbientSound()
    }

    const ctx = audioCtxRef.current
    const gain = gainNodeRef.current

    if (!ctx || !gain) return

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    // Fade in
    gain.gain.cancelScheduledValues(ctx.currentTime)
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2)

    setIsPlaying(true)
  }, [createAmbientSound])

  const pause = useCallback(() => {
    const ctx = audioCtxRef.current
    const gain = gainNodeRef.current

    if (!ctx || !gain) return

    // Fade out
    gain.gain.cancelScheduledValues(ctx.currentTime)
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)

    setTimeout(() => {
      if (ctx.state !== 'closed') {
        ctx.suspend()
      }
    }, 1600)

    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  // Start after first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true)
        document.removeEventListener('click', handleFirstInteraction)
        document.removeEventListener('keydown', handleFirstInteraction)
        document.removeEventListener('touchstart', handleFirstInteraction)
      }
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [hasInteracted])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close()
      }
    }
  }, [])

  return { isPlaying, toggle, isSupported, hasInteracted }
}
