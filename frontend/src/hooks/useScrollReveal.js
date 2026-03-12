import { useEffect, useRef } from 'react'

/**
 * Scroll-reveal animation hook.
 * Observes all `.fade-up` children inside the returned ref and adds
 * the `visible` class when they enter the viewport.
 */
export function useScrollReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const elements = ref.current?.querySelectorAll('.fade-up')

    // Graceful degradation: if IntersectionObserver is unavailable, leave everything visible
    if (!('IntersectionObserver' in window) || !elements?.length) {
      return
    }

    // Only hide elements that are BELOW the viewport — above-fold stays visible always
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top >= window.innerHeight) {
        el.style.opacity = '0'
        el.style.transform = 'translateY(30px)'
      }
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    elements.forEach((el) => {
      // Only observe elements we actually hid
      if (el.style.opacity === '0') {
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [])

  return ref
}
