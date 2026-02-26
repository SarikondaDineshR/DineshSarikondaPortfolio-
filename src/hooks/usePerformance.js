import { useState, useEffect } from 'react'

export default function usePerformance() {
  const [isLowPerf, setIsLowPerf] = useState(false)

  useEffect(() => {
    // Check device capabilities
    const checkPerformance = () => {
      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 4

      // Check device memory (if available)
      const memory = navigator.deviceMemory || 4

      // Check if mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )

      // Check connection speed
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      const isSlowConnection = connection &&
        (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g')

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const lowPerf = cores < 4 || memory < 4 || (isMobile && cores < 6) || isSlowConnection || prefersReducedMotion

      setIsLowPerf(lowPerf)
    }

    checkPerformance()

    // Also run a quick frame rate check
    let frameCount = 0
    let startTime = performance.now()
    let rafId

    const measureFPS = () => {
      frameCount++
      const elapsed = performance.now() - startTime

      if (elapsed >= 1000) {
        const fps = frameCount / (elapsed / 1000)
        if (fps < 30) {
          setIsLowPerf(true)
        }
        cancelAnimationFrame(rafId)
        return
      }

      rafId = requestAnimationFrame(measureFPS)
    }

    rafId = requestAnimationFrame(measureFPS)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return { isLowPerf }
}
