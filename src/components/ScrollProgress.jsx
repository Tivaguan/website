import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function ScrollProgress() {
  const bar = useRef()

  useLayoutEffect(() => {
    const element = bar.current
    let last = -1

    // Read on GSAP's ticker rather than a scroll listener: the pinned Drinks
    // journey keeps changing the document height, and the ticker already runs
    // for the rest of the page's scroll work.
    const update = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      const progress =
        scrollable > 0
          ? Math.min(Math.max(doc.scrollTop / scrollable, 0), 1)
          : 0

      if (Math.abs(progress - last) < 0.0005) return
      last = progress
      element.style.transform = `scaleX(${progress})`
    }

    update()
    gsap.ticker.add(update)

    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-ink/[0.06]"
      aria-hidden
    >
      <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-matcha" />
    </div>
  )
}
