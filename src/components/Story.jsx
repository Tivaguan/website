import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import worldData from 'world-atlas/countries-110m.json'
import { Visit } from './Visit'

const AMSTERDAM = [4.9041, 52.3676]
const RABAT = [-6.8498, 34.0209]
// Give the complete Story a brief reading hold, then spend the majority of the
// section on the world-map and street-level zooms.
const STORY_HOLD_END = 0.17
const MAP_CROSSFADE_START = 0.36
const MAP_CROSSFADE_DURATION = 0.16
const VISIT_HANDOFF_START = 0.39

const countries = feature(
  worldData,
  worldData.objects.countries,
).features

const projection = geoMercator()
  .center([2, 38])
  .scale(505)
  .translate([500, 352])

const mapPath = geoPath(projection)
const routePath = mapPath({
  type: 'LineString',
  coordinates: [
    AMSTERDAM,
    [1.2, 47],
    [-3.8, 41],
    RABAT,
  ],
})

function JourneyMap({ containerRef, svgRef, annotationsRef }) {
  const routeReveal = useRef()
  const amsPin = useRef()
  const rabatPin = useRef()
  const amsLabel = useRef()
  const rabatLabel = useRef()

  const amsterdamPoint = projection(AMSTERDAM)
  const rabatPoint = projection(RABAT)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const reveal = routeReveal.current
    const length = reveal.getTotalLength()
    const pins = [amsPin.current, rabatPin.current]
    const labels = [amsLabel.current, rabatLabel.current]

    // Zoom each dot in place, around its own point on the map.
    gsap.set(amsPin.current, {
      svgOrigin: `${amsterdamPoint[0]} ${amsterdamPoint[1]}`,
    })
    gsap.set(rabatPin.current, {
      svgOrigin: `${rabatPoint[0]} ${rabatPoint[1]}`,
    })

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(reveal, { strokeDasharray: length, strokeDashoffset: 0 })
      gsap.set(pins, { autoAlpha: 1, scale: 1 })
      gsap.set(labels, { autoAlpha: 1, y: 0 })
    })

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(reveal, { strokeDasharray: length, strokeDashoffset: length })
      gsap.set(pins, { autoAlpha: 0, scale: 0 })
      gsap.set(labels, { autoAlpha: 0, y: 12 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: '#story',
          start: 'top 62%',
          once: true,
        },
      })

      tl.to(amsPin.current, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }, 0)
        .to(amsLabel.current, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.12)
        .to(
          reveal,
          { strokeDashoffset: 0, duration: 1.15, ease: 'power1.inOut' },
          0.22,
        )
        .to(
          rabatPin.current,
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
          1.05,
        )
        .to(rabatLabel.current, { autoAlpha: 1, y: 0, duration: 0.45 }, 1.18)
    })

    return () => mm.revert()
  }, [amsterdamPoint, rabatPoint])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-[#f4eee2]">
      <svg
        ref={svgRef}
        viewBox="0 0 1000 720"
        role="img"
        aria-label="Map showing the journey from Amsterdam in the Netherlands to Rabat in Morocco"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="route-reveal">
            <path
              ref={routeReveal}
              d={routePath ?? undefined}
              fill="none"
              stroke="#fff"
              strokeWidth="26"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>

        <rect width="1000" height="720" fill="#f4eee2" />

        <g>
          {countries.map((country, index) => {
            const id = String(country.id).padStart(3, '0')
            const highlighted = id === '528' || id === '504'

            return (
              <path
                key={index}
                d={mapPath(country) ?? undefined}
                fill={highlighted ? '#86a956' : '#ced5b9'}
                stroke="#f6f1e7"
                strokeWidth={highlighted ? 2.4 : 1.3}
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
        </g>

        <g ref={annotationsRef}>
          <path
            d={routePath ?? undefined}
            fill="none"
            stroke="#587c30"
            strokeWidth="3"
            strokeDasharray="8 9"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            mask="url(#route-reveal)"
          />

          <circle
            ref={amsPin}
            cx={amsterdamPoint[0]}
            cy={amsterdamPoint[1]}
            r="10"
            fill="#587c30"
            stroke="#f6f1e7"
            strokeWidth="6"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            ref={rabatPin}
            cx={rabatPoint[0]}
            cy={rabatPoint[1]}
            r="10"
            fill="#587c30"
            stroke="#f6f1e7"
            strokeWidth="6"
            vectorEffect="non-scaling-stroke"
          />

          <g
            transform={`translate(${amsterdamPoint[0] + 22} ${amsterdamPoint[1] - 7})`}
          >
            <g ref={amsLabel}>
              <text
                className="font-display fill-ink text-[27px] font-semibold tracking-[-0.03em] uppercase"
                style={{
                  paintOrder: 'stroke',
                  stroke: '#f6f1e7',
                  strokeWidth: 6,
                  strokeLinejoin: 'round',
                }}
              >
                Amsterdam
              </text>
              <text
                y="22"
                className="fill-ink/50 text-[9px] font-bold tracking-[0.16em] uppercase"
                style={{
                  paintOrder: 'stroke',
                  stroke: '#f6f1e7',
                  strokeWidth: 4,
                  strokeLinejoin: 'round',
                }}
              >
                The Netherlands
              </text>
            </g>
          </g>

          <g
            transform={`translate(${rabatPoint[0] + 22} ${rabatPoint[1] - 7})`}
          >
            <g ref={rabatLabel}>
              <text
                className="font-display fill-ink text-[27px] font-semibold tracking-[-0.03em] uppercase"
                style={{
                  paintOrder: 'stroke',
                  stroke: '#f6f1e7',
                  strokeWidth: 6,
                  strokeLinejoin: 'round',
                }}
              >
                Rabat
              </text>
              <text
                y="22"
                className="fill-ink/50 text-[9px] font-bold tracking-[0.16em] uppercase"
                style={{
                  paintOrder: 'stroke',
                  stroke: '#f6f1e7',
                  strokeWidth: 4,
                  strokeLinejoin: 'round',
                }}
              >
                Morocco
              </text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}

export function Story() {
  const contentRef = useRef()
  const mapContainerRef = useRef()
  const mapSvgRef = useRef()
  const annotationsRef = useRef()
  const visitRef = useRef()

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const rabatPoint = projection(RABAT)
    // Match the world-map crop to the real 21 × 22 km local archive instead
    // of handing off from a much wider regional view.
    const endWidth = 5.4
    const endHeight = 3.2
    const endViewBox = `${rabatPoint[0] - endWidth / 2} ${
      rabatPoint[1] - endHeight / 2
    } ${endWidth} ${endHeight}`

    const mm = gsap.matchMedia()

    // Phones open on a wider, lower crop of the world map so the full
    // route and both city labels sit below the story card.
    mm.add(
      {
        motionOk: '(prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 767px)',
      },
      (gctx) => {
      if (!gctx.conditions.motionOk) return
      const startViewBox = gctx.conditions.mobile
        ? '0 -420 1000 1100'
        : '0 0 1000 720'
      const hold = { progress: 0 }
      const visitController = visitRef.current
      const worldMapContainer = mapContainerRef.current

      const resetHandoff = () => {
        visitController?.setProgress(0)
        gsap.set(worldMapContainer, { autoAlpha: 1 })
        gsap.set(contentRef.current, { autoAlpha: 1, y: 0 })
        gsap.set(annotationsRef.current, { autoAlpha: 1 })
        gsap.set(mapSvgRef.current, {
          attr: { viewBox: startViewBox },
        })
      }

      resetHandoff()

      const handoff = gsap.timeline({
        scrollTrigger: {
          trigger: '#story',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.45,
          invalidateOnRefresh: true,
          // The earlier Drinks section is pinned. Refresh Story after that pin
          // has contributed its spacing, otherwise this trigger starts early.
          refreshPriority: -10,
          onUpdate: (self) => {
            const visitProgress = gsap.utils.clamp(
              0,
              1,
              (self.progress - VISIT_HANDOFF_START) /
                (1 - VISIT_HANDOFF_START),
            )
            const crossfade = gsap.utils.clamp(
              0,
              1,
              (self.progress - MAP_CROSSFADE_START) /
                MAP_CROSSFADE_DURATION,
            )
            // Smoothstep avoids the visible opacity kink at either end of the
            // transition while keeping both maps perfectly complementary.
            const smoothCrossfade =
              crossfade * crossfade * (3 - 2 * crossfade)

            gsap.set(worldMapContainer, {
              autoAlpha: 1 - smoothCrossfade,
            })
            visitController?.setProgress(visitProgress, smoothCrossfade)
          },
          onRefresh: (self) => {
            if (self.scroll() < self.start) resetHandoff()
          },
          onLeaveBack: resetHandoff,
        },
      })

      // Both maps occupy the same sticky canvas. The world map zooms into
      // Rabat only after visitors have had a full viewport to read the complete
      // Story, then fades in-place into the local street map.
      handoff
        .to(hold, { progress: 1, duration: 1, ease: 'none' }, 0)
        .to(
          contentRef.current,
          { autoAlpha: 0, y: -24, duration: 0.14, ease: 'none' },
          STORY_HOLD_END,
        )
        .to(
          annotationsRef.current,
          { autoAlpha: 0, duration: 0.14, ease: 'none' },
          STORY_HOLD_END + 0.08,
        )
        .to(
          mapSvgRef.current,
          {
            attr: { viewBox: endViewBox },
            duration: 0.28,
            ease: 'power2.inOut',
          },
          STORY_HOLD_END,
        )

      return () => {
        resetHandoff()
        handoff.kill()
      }
      },
    )

    mm.add(
      {
        motionReduce: '(prefers-reduced-motion: reduce)',
        mobile: '(max-width: 767px)',
      },
      (gctx) => {
      if (!gctx.conditions.motionReduce) return
      gsap.set(mapSvgRef.current, {
        attr: {
          viewBox: gctx.conditions.mobile ? '0 -420 1000 1100' : '0 0 1000 720',
        },
      })
      const visitController = visitRef.current
      const worldMapContainer = mapContainerRef.current
      const storyContent = contentRef.current

      visitController?.setProgress(0)
      gsap.set(worldMapContainer, { autoAlpha: 1 })
      gsap.set(storyContent, { autoAlpha: 1, y: 0 })

      const switchToVisit = ScrollTrigger.create({
        trigger: '#story',
        start: '55% top',
        refreshPriority: -10,
        onEnter: () => {
          gsap.set([worldMapContainer, storyContent], { autoAlpha: 0 })
          visitController?.setProgress(1)
        },
        onLeaveBack: () => {
          visitController?.setProgress(0)
          gsap.set(worldMapContainer, { autoAlpha: 1 })
          gsap.set(storyContent, { autoAlpha: 1, y: 0 })
        },
      })

      return () => switchToVisit.kill()
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section
      id="story"
      className="relative z-[40] h-[485svh] bg-[#f4eee2] md:h-[500svh]"
      aria-label="MATCHAI story"
    >
      <div
        id="story-stage"
        className="sticky top-0 h-svh min-h-[42rem] overflow-hidden bg-[#f4eee2] text-ink"
      >
        <JourneyMap
          containerRef={mapContainerRef}
          svgRef={mapSvgRef}
          annotationsRef={annotationsRef}
        />
        <Visit ref={visitRef} />

        <div
          ref={contentRef}
          className="site-gutter relative z-10 min-h-svh pt-24 pb-12 md:pt-28 md:pb-14"
        >
          <article className="max-w-[31rem] rounded-[1.5rem] bg-[#f6f1e7]/88 p-5 backdrop-blur-md md:absolute md:top-[15%] md:left-[max(2rem,8vw,calc((100vw-90rem)/2))] md:p-0 md:bg-transparent md:backdrop-blur-none">
            <p className="text-[10px] font-bold tracking-[0.2em] text-ink/45 uppercase">
              Our story
            </p>

            <h2 className="mt-4 font-display text-[2.1rem] leading-[0.82] md:mt-7 md:text-[clamp(3.8rem,6.2vw,6.8rem)] font-bold tracking-[-0.055em] uppercase">
              From Amsterdam
              <br />
              to Rabat.
            </h2>

            <p className="mt-4 max-w-md text-[15px] leading-[1.65] text-ink/70 md:mt-7 md:text-lg">
              We loved matcha long before MATCHAI existed. But in Morocco,
              finding a cup made with the quality and care we knew was harder
              than it should have been. So we left Amsterdam for Rabat and
              created the place we had been looking for.
            </p>
          </article>

          <article className="mt-[34rem] hidden max-w-xl md:block rounded-[1.5rem] bg-[#f6f1e7]/90 p-6 backdrop-blur-md md:absolute md:right-[max(2rem,8vw,calc((100vw-90rem)/2))] md:bottom-[8%] md:mt-0 md:w-[min(34rem,36vw)] md:p-7">
            <p className="text-base leading-[1.7] text-ink/68 md:text-lg">
              To us, matcha is more than a drink. It is a small ritual that
              brings balance, clarity and energy to the day. We pair Japanese
              matcha with a modern approach, made to fit the way Rabat moves.
            </p>

            <p className="mt-6 border-t border-ink/20 pt-6 text-base leading-[1.65] font-semibold md:text-lg">
              Come for the first cup of the morning, a quiet pause or time with
              friends. Stay for the pure green energy.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
