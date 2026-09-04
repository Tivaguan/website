import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { gsap } from 'gsap'
import { DRINKS } from '../data/drinks'

export function Drinks({ activeId, onSelect }) {
  const copy = useRef()
  const touchStart = useRef(null)
  const activeIndex = useMemo(
    () => Math.max(0, DRINKS.findIndex((drink) => drink.id === activeId)),
    [activeId],
  )
  const active = DRINKS[activeIndex]

  useEffect(() => {
    let cancelled = false
    const timers = []
    const idleHandles = []

    const schedulePreload = (index) => {
      if (cancelled || index >= DRINKS.length) return

      const preload = () => {
        if (cancelled) return
        useGLTF.preload(DRINKS[index].model)
        timers.push(window.setTimeout(() => schedulePreload(index + 1), 500))
      }

      if ('requestIdleCallback' in window) {
        idleHandles.push(window.requestIdleCallback(preload))
      } else {
        timers.push(window.setTimeout(preload, 1000))
      }
    }

    timers.push(window.setTimeout(() => schedulePreload(1), 1400))

    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
      idleHandles.forEach((handle) => window.cancelIdleCallback(handle))
    }
  }, [])

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tween = gsap.fromTo(
      copy.current,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
    )

    return () => tween.kill()
  }, [activeId])

  const selectRelative = (direction) => {
    onSelect((currentId) => {
      const currentIndex = Math.max(
        0,
        DRINKS.findIndex((drink) => drink.id === currentId),
      )
      const nextIndex =
        (currentIndex + direction + DRINKS.length) % DRINKS.length
      return DRINKS[nextIndex].id
    })
  }

  const handlePrevious = (event) => {
    event.preventDefault()
    event.stopPropagation()
    selectRelative(-1)
  }

  const handleNext = (event) => {
    event.preventDefault()
    event.stopPropagation()
    selectRelative(1)
  }

  const handleTouchStart = (event) => {
    touchStart.current = event.touches[0].clientX
  }

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return
    const distance = event.changedTouches[0].clientX - touchStart.current
    touchStart.current = null
    if (Math.abs(distance) < 48) return
    selectRelative(distance < 0 ? 1 : -1)
  }

  return (
    <section
      id="drinks"
      className="site-gutter relative flex min-h-lvh overflow-hidden pt-28 pb-10 transition-colors duration-700"
      style={{ backgroundColor: active.background }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.5),transparent_42%)]"
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 z-[15] w-[12vw] bg-gradient-to-r from-[var(--drink-bg)] to-transparent"
        style={{ '--drink-bg': active.background }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 z-[15] w-[12vw] bg-gradient-to-l from-[var(--drink-bg)] to-transparent"
        style={{ '--drink-bg': active.background }}
      />

      <div data-drinks-ui className="relative z-20 flex w-full items-start">
        <p className="text-[10px] font-bold tracking-[0.2em] text-ink/55 uppercase">
          The drinks
        </p>
      </div>

      <div
        ref={copy}
        key={active.id}
        data-drinks-ui
        className="pointer-events-none absolute inset-x-6 bottom-[12vh] z-[5] text-center md:inset-x-24 md:bottom-[13vh]"
      >
        <h2 className="font-display text-[clamp(3rem,5.5vw,5.8rem)] leading-[0.9] font-bold tracking-[-0.045em] text-ink uppercase">
          {active.name}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink/60 md:text-base">
          {active.description}
        </p>
      </div>

      <button
        type="button"
        data-drinks-ui
        onClick={handlePrevious}
        aria-label="Previous drink"
        className="pointer-events-auto absolute top-[44%] left-[calc(50%_-_10.5rem)] z-30 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-ink/20 bg-white/25 text-lg text-ink backdrop-blur-sm transition-colors hover:bg-ink hover:text-white md:left-[calc(50%_-_19rem)]"
      >
        ←
      </button>
      <button
        type="button"
        data-drinks-ui
        onClick={handleNext}
        aria-label="Next drink"
        className="pointer-events-auto absolute top-[44%] right-[calc(50%_-_10.5rem)] z-30 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-ink/20 bg-white/25 text-lg text-ink backdrop-blur-sm transition-colors hover:bg-ink hover:text-white md:right-[calc(50%_-_19rem)]"
      >
        →
      </button>

    </section>
  )
}
