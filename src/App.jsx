import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Hero } from './components/Hero'
import { Header } from './components/Header'
import { Welcome } from './components/Welcome'
import { Drinks } from './components/Drinks'
import { Experience } from './components/Experience'
import { Story } from './components/Story'
import { Loyalty } from './components/Loyalty'
import { Footer } from './components/Footer'
import 'maplibre-gl/dist/maplibre-gl.css'
import { DRINKS } from './data/drinks'
import { CupScene } from './scene/CupScene'
import { CUP_STATES, cupTransform, setCupState } from './scene/cupState'

export default function App() {
  const root = useRef()
  const cupShadow = useRef()
  const cupLayer = useRef()
  const experienceWash = useRef()
  const [cupReady, setCupReady] = useState(false)
  const [activeDrinkId, setActiveDrinkId] = useState(DRINKS[0].id)
  const handleCupReady = useCallback(() => setCupReady(true), [])
  const activeDrink =
    DRINKS.find((drink) => drink.id === activeDrinkId) ?? DRINKS[0]

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    setCupState('hero')

    const mm = gsap.matchMedia()

    mm.add(
      {
        desktop: '(min-width: 768px)',
        mobile: '(max-width: 767px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { desktop, reduceMotion } = context.conditions
        const destination = desktop
          ? CUP_STATES.welcome
          : {
              ...CUP_STATES.welcome,
              x: 0.55,
              y: 0.62,
              scale: 0.72,
              rotY: -0.18,
            }
        const drinksDestination = desktop
          ? CUP_STATES.drinks
          : {
              ...CUP_STATES.drinks,
              x: 0,
              y: 0.18,
              scale: 0.56,
              rotY: 0.05,
            }
        const experienceDestination = desktop
          ? CUP_STATES.experience
          : {
              ...CUP_STATES.experience,
              y: -0.78,
              z: 1.35,
              scale: 3,
            }

        if (reduceMotion) {
          gsap.set('[data-experience-stage-content]', { autoAlpha: 1 })

          const welcomeTrigger = ScrollTrigger.create({
            trigger: '#welcome',
            start: 'top 55%',
            onEnter: () => Object.assign(cupTransform, destination),
            onLeaveBack: () => setCupState('hero'),
          })
          const drinksTrigger = ScrollTrigger.create({
            trigger: '#drinks',
            start: 'top 55%',
            onEnter: () => Object.assign(cupTransform, drinksDestination),
            onLeaveBack: () => Object.assign(cupTransform, destination),
          })
          const experienceTrigger = ScrollTrigger.create({
            trigger: '#experience',
            start: 'top 55%',
            onEnter: () => {
              Object.assign(cupTransform, experienceDestination)
              gsap.set(experienceWash.current, { opacity: 1 })
              gsap.set(cupLayer.current, { opacity: 0 })
              gsap.set(cupShadow.current, { opacity: 0 })
              gsap.set('[data-drinks-ui]', { autoAlpha: 0 })
            },
            onLeaveBack: () => {
              Object.assign(cupTransform, drinksDestination)
              gsap.set(experienceWash.current, { opacity: 0 })
              gsap.set(cupLayer.current, { opacity: 1 })
              gsap.set(cupShadow.current, { opacity: 1 })
              gsap.set('[data-drinks-ui]', { autoAlpha: 1 })
            },
          })
          return () => {
            welcomeTrigger.kill()
            drinksTrigger.kill()
            experienceTrigger.kill()
          }
        }

        const cupJourney = gsap.timeline({
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            endTrigger: '#drinks',
            end: 'top 18%',
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        })

        cupJourney
          .to(cupTransform, { ...destination, duration: 1, ease: 'none' }, 0)
          .to(
            cupShadow.current,
            {
              x: desktop ? '22vw' : '10vw',
              y: desktop ? 0 : '4rem',
              scale: desktop ? 0.88 : 0.72,
              duration: 1,
              ease: 'none',
            },
            0,
          )
          .to(
            cupTransform,
            { ...drinksDestination, duration: 0.82, ease: 'none' },
            1,
          )
          .to(
            cupShadow.current,
            {
              x: 0,
              y: '-24vh',
              scale: desktop ? 0.46 : 0.4,
              duration: 0.82,
              ease: 'none',
            },
            1,
          )

        const experienceZoom = gsap.timeline({
          scrollTrigger: {
            trigger: '#drinks',
            start: 'top top',
            end: '+=180%',
            scrub: 0.55,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // This pin changes the document's scroll length. Refresh it before
            // downstream Story triggers so their start positions include the
            // full pinned Drinks journey.
            refreshPriority: 10,
          },
        })

        // Begin responding immediately when the pinned journey starts. The UI
        // fade occupies the opening beat, then flows directly into the cup dive.
        const experienceZoomStart = 0.1

        experienceZoom
          .to(
            '[data-drinks-ui]',
            { autoAlpha: 0, yPercent: -18, duration: 0.1, ease: 'none' },
            experienceZoomStart - 0.1,
          )
          .to(
            cupTransform,
            { ...experienceDestination, duration: 1, ease: 'none' },
            experienceZoomStart,
          )
          .to(
            cupShadow.current,
            {
              y: '-32vh',
              scale: 0.16,
              opacity: 0,
              duration: 0.7,
              ease: 'none',
            },
            experienceZoomStart,
          )
          .fromTo(
            experienceWash.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.58, ease: 'none' },
            experienceZoomStart + 0.36,
          )
          .fromTo(
            cupLayer.current,
            { opacity: 1 },
            { opacity: 0, duration: 0.46, ease: 'none' },
            experienceZoomStart + 0.48,
          )

        const copyTween = gsap.fromTo(
          '[data-welcome-copy]',
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#welcome',
              start: 'top 78%',
              end: 'top 30%',
              scrub: 0.6,
            },
          },
        )

        return () => {
          cupJourney.scrollTrigger?.kill()
          cupJourney.kill()
          experienceZoom.scrollTrigger?.kill()
          experienceZoom.kill()
          copyTween.kill()
        }
      },
    )

    // Browser hash restoration and React's first paint can happen after the
    // triggers are created. Re-sync once layout has settled so a refresh or
    // direct visit to #welcome cannot leave the cup in its Hero position.
    let settleFrame
    const refreshFrame = requestAnimationFrame(() => {
      settleFrame = requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        ScrollTrigger.update()
      })
    })

    const syncScrollState = () => {
      ScrollTrigger.refresh()
      ScrollTrigger.update()
    }
    window.addEventListener('load', syncScrollState)
    window.addEventListener('hashchange', syncScrollState)

    return () => {
      cancelAnimationFrame(refreshFrame)
      cancelAnimationFrame(settleFrame)
      window.removeEventListener('load', syncScrollState)
      window.removeEventListener('hashchange', syncScrollState)
      mm.revert()
      setCupState('hero')
    }
  }, [])

  useLayoutEffect(() => {
    if (!cupReady) return

    const experience = document.querySelector('#experience')
    if (
      experience &&
      window.scrollY >= experience.offsetTop - window.innerHeight * 0.5
    ) {
      gsap.set(cupShadow.current, { opacity: 0 })
      return
    }

    const shadowEntrance = gsap.fromTo(
      cupShadow.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.65, delay: 0.62, ease: 'power2.out' },
    )
    return () => shadowEntrance.kill()
  }, [cupReady])

  return (
    <div ref={root}>
      <Header />

      <div ref={cupShadow} className="cup-drop-shadow" aria-hidden />

      <div
        ref={cupLayer}
        className="pointer-events-none fixed inset-0 z-10 will-change-[opacity]"
        aria-hidden
      >
        <CupScene
          modelUrl={activeDrink.model}
          onCupReady={handleCupReady}
        />
      </div>

      <main className="relative">
        <Hero ready={cupReady} />
        <Welcome />
        <Drinks activeId={activeDrinkId} onSelect={setActiveDrinkId} />
        <Experience washRef={experienceWash} />
        <div className="story-transition" aria-hidden />
        <Loyalty />
        <Story />
        <Footer />
      </main>
    </div>
  )
}
