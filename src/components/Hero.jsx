import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function Hero({ ready }) {
  const root = useRef()

  useLayoutEffect(() => {
    if (!ready) return

    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('[data-hero-wordmark], [data-hero-splash]', {
          opacity: 1,
        })
        return
      }

      const intro = gsap.timeline()

      intro
        .fromTo(
          '[data-hero-wordmark]',
          { opacity: 0, scale: 0.965 },
          { opacity: 1, scale: 1, duration: 0.58, ease: 'power2.out' },
        )
        .fromTo(
          '[data-hero-splash]',
          {
            y: '15vh',
            scaleX: 0.72,
            scaleY: 0.42,
            opacity: 0,
            transformOrigin: '50% 88%',
          },
          {
            y: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 0.92,
            duration: 1.12,
            ease: 'power4.out',
          },
          0.12,
        )
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section
      id="home"
      ref={root}
      className="site-gutter relative flex h-svh flex-col pt-24 pb-8 md:pt-28"
    >
      {/* Stage: wordmark sits behind, the cup floats over it. */}
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-[-4vw] top-[35%] z-0 -translate-y-1/2 text-center select-none">
          <h1
            data-hero-wordmark
            className="leading-none font-display font-bold tracking-tight text-ink opacity-0"
            style={{ fontSize: 'clamp(5rem, 25vw, 23rem)' }}
          >
            MATCHAI
          </h1>
        </div>

        <div className="pointer-events-none absolute top-[72%] left-1/2 z-[5] w-[min(92vw,64rem)] -translate-x-1/2 -translate-y-1/2 md:top-[78%] md:w-[min(70vw,64rem)]">
          <img
            data-hero-splash
            src="/images/matcha-splash.png"
            alt=""
            aria-hidden
            className="block h-auto w-full object-contain opacity-0 will-change-transform select-none"
          />
        </div>
      </div>

    </section>
  )
}
