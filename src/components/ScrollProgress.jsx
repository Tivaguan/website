import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function ScrollProgress() {
  const bar = useRef()

  useLayoutEffect(() => {
    const element = bar.current
    let last = -1

    const update = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      const scrolled = window.scrollY ?? doc.scrollTop
      const progress =
        scrollable > 0 ? Math.min(Math.max(scrolled / scrollable, 0), 1) : 0

      if (Math.abs(progress - last) < 0.0005) return
      last = progress
      element.style.transform = `scaleX(${progress})`
    }

    // Drive from scroll events AND GSAP's ticker: the ticker keeps the bar in
    // step with the pinned sections' height changes, the listeners guarantee
    // updates even when no animation frame work is scheduled.
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    document.addEventListener('scroll', update, { passive: true, capture: true })
    gsap.ticker.add(update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      document.removeEventListener('scroll', update, { capture: true })
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[3px] bg-ink/[0.06]"
      aria-hidden
    >
      <div ref={bar} className="h-full w-full origin-left bg-matcha" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}
