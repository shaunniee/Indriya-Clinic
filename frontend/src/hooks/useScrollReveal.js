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

    // Graceful degradation: if IntersectionObserver is unavailable, show all elements immediately
    if (!('IntersectionObserver' in window) || !elements?.length) {
      elements?.forEach((el) => el.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return ref
}
