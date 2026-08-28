import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react'
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import { gsap } from 'gsap'
import { buildVisitMapStyle } from './visitMapStyle'

// MATCHAI — 72 Rue Oued Moulouya, Agdal, Rabat
const SHOP = { lng: -6.8476784981478245, lat: 33.997098933931994 }
const RABAT = { lng: -6.8498, lat: 34.0209 }
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${SHOP.lat},${SHOP.lng}`

// The local archive covers roughly 21 × 22 km around Rabat. Starting at this
// zoom fills a wide desktop viewport instead of exposing the archive edges.
const START_ZOOM = 11.15
const END_ZOOM = 17.5

const HOURS = [
  ['Mon', '13:00 – 21:00'],
  ['Tue', '13:00 – 21:00'],
  ['Wed', '13:00 – 21:00'],
  ['Thu', '13:00 – 21:00'],
  ['Fri', '13:00 – 22:00'],
  ['Sat', '13:00 – 22:00'],
  ['Sun', '13:00 – 21:00'],
]

// Register the pmtiles protocol once for the whole app.
let pmtilesRegistered = false
function ensurePmtilesProtocol() {
  if (pmtilesRegistered) return
  const protocol = new Protocol()
  maplibregl.addProtocol('pmtiles', protocol.tile)
  pmtilesRegistered = true
}

export const Visit = forwardRef(function Visit(_, progressRef) {
  const layerRef = useRef()
  const mapContainer = useRef()
  const mapRef = useRef()
  const detailsRef = useRef()
  const shadeRef = useRef()
  const markerRef = useRef()
  const markerVisualRef = useRef()
  const storeCardRef = useRef()
  const didResizeRef = useRef(false)

  const setProgress = useCallback((progress, revealProgress) => {
    const p = gsap.utils.clamp(0, 1, progress)
    const revealP =
      revealProgress == null
        ? gsap.utils.clamp(0, 1, p / 0.12)
        : gsap.utils.clamp(0, 1, revealProgress)
    // Hold the real map at the matching Rabat overview while it crossfades
    // with the illustrated map, then begin the street-level approach.
    const zoomP = gsap.utils.clamp(0, 1, (p - 0.12) / 0.78)
    const detailsP = gsap.utils.clamp(0, 1, (p - 0.64) / 0.16)
    const markerP = gsap.utils.clamp(0, 1, (p - 0.73) / 0.12)
    const storeCardP = gsap.utils.clamp(0, 1, (p - 0.86) / 0.14)
    const map = mapRef.current

    gsap.set(layerRef.current, { autoAlpha: revealP })

    if (map) {
      if (p > 0 && !didResizeRef.current) {
        didResizeRef.current = true
        requestAnimationFrame(() => map.resize())
      }

      map.jumpTo({
        center: [
          gsap.utils.interpolate(RABAT.lng, SHOP.lng, zoomP),
          gsap.utils.interpolate(RABAT.lat, SHOP.lat, zoomP),
        ],
        zoom: START_ZOOM + (END_ZOOM - START_ZOOM) * zoomP,
      })
    }

    gsap.set(detailsRef.current, {
      autoAlpha: detailsP,
      y: 28 * (1 - detailsP),
    })
    gsap.set(shadeRef.current, { autoAlpha: detailsP })
    gsap.set(markerRef.current, {
      autoAlpha: markerP,
    })
    gsap.set(markerVisualRef.current, {
      scale: 0.82 + markerP * 0.18,
    })
    gsap.set(storeCardRef.current, {
      autoAlpha: storeCardP,
      y: 48 * (1 - storeCardP),
      rotation: -4 * (1 - storeCardP),
      scale: 0.78 + storeCardP * 0.22,
    })
  }, [])

  useImperativeHandle(progressRef, () => ({ setProgress }), [setProgress])

  useLayoutEffect(() => {
    ensurePmtilesProtocol()

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: buildVisitMapStyle(),
      center: [RABAT.lng, RABAT.lat],
      zoom: START_ZOOM,
      attributionControl: { compact: true },
      interactive: false,
      dragPan: false,
      scrollZoom: false,
      fadeDuration: 0,
    })
    mapRef.current = map
    if (import.meta.env.DEV) window.__visitMap = map

    map.on('error', (e) => {
      // Surface tile/style problems instead of failing silently.
      console.error('[Visit map]', e?.error?.message || e)
    })

    // The section mounts far down the page, so the container can measure 0 at
    // init (MapLibre then falls back to 400x300). Keep the map sized to its box.
    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(mapContainer.current)
    requestAnimationFrame(() => map.resize())

    // Story owns the handoff state. The Visit layer must always mount hidden
    // so it can never cover Story before the scroll controller begins.
    gsap.set(layerRef.current, { autoAlpha: 0 })
    gsap.set(
      [
        detailsRef.current,
        shadeRef.current,
        markerRef.current,
        storeCardRef.current,
      ],
      { autoAlpha: 0 },
    )
    gsap.set(markerVisualRef.current, { scale: 0.82 })

    let marker

    map.on('load', () => {
      map.resize()
      // Custom MATCHAI marker pinned to the exact door.
      marker = new maplibregl.Marker({
        element: markerRef.current,
        anchor: 'bottom',
        })
        .setLngLat([SHOP.lng, SHOP.lat])
        .addTo(map)

    })

    return () => {
      marker?.remove()
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div
      id="visit"
      ref={layerRef}
      className="invisible absolute inset-0 z-[5] opacity-0"
      aria-label="Visit MATCHAI in Agdal"
    >
      <div
        id="visit-stage"
        className="visit-map-shell relative h-full min-h-[42rem] overflow-hidden bg-[#f4eee2] text-ink"
      >
        <div
          ref={mapContainer}
          className="absolute inset-0 h-full w-full"
          aria-hidden
        />

        {/* Soft vignette so overlaid copy stays legible over the map. */}
        <div
          ref={shadeRef}
          className="invisible pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f4eee2]/95 via-[#f4eee2]/20 to-transparent opacity-0 md:via-transparent"
          aria-hidden
        />

        {/* Exact-location marker */}
        <div
          ref={markerRef}
          className="invisible z-10 pointer-events-none opacity-0"
        >
          <div
            ref={markerVisualRef}
            className="flex origin-bottom flex-col items-center"
          >
            <span className="rounded-full bg-ink px-3 py-1.5 font-display text-[11px] font-bold tracking-[0.14em] whitespace-nowrap text-[#f6f1e7] uppercase shadow-[0_0.5rem_1.2rem_rgba(25,31,21,0.35)]">
              MATCHAI
            </span>
            <svg
              aria-hidden
              viewBox="0 0 48 62"
              className="-mt-0.5 h-[3.9rem] w-12 drop-shadow-[0_0.75rem_0.75rem_rgba(25,31,21,0.24)]"
            >
              <path
                d="M24 1.5C11.8 1.5 2 11.3 2 23.5c0 16.1 17.1 33.5 20.6 36.9a2 2 0 0 0 2.8 0C28.9 57 46 39.6 46 23.5 46 11.3 36.2 1.5 24 1.5Z"
                fill="#5f8034"
                stroke="#f6f1e7"
                strokeWidth="3"
              />
              <circle cx="24" cy="23.5" r="8" fill="#f6f1e7" />
              <circle cx="24" cy="23.5" r="3.25" fill="#101010" />
            </svg>
            <span className="-mt-0.5 h-2 w-6 rounded-full bg-ink/20 blur-[3px]" />
          </div>
        </div>

        {/* Store reveal — arrives only once the map reaches MATCHAI. */}
        <div className="pointer-events-none absolute top-24 right-4 z-[8] md:top-1/2 md:right-[max(2rem,10vw)] md:-translate-y-1/2">
          <figure
            ref={storeCardRef}
            className="invisible w-[min(21rem,calc(100vw-2rem))] origin-bottom rotate-[-4deg] opacity-0 md:w-[min(30rem,30vw)]"
          >
            <div className="rounded-[1.35rem] border border-white/80 bg-[#f6f1e7] p-2.5 shadow-[0_1.75rem_5rem_rgba(25,31,21,0.28)] md:rounded-[1.75rem] md:p-3">
              <div className="overflow-hidden rounded-[0.95rem] bg-[#e9e4d9] md:rounded-[1.25rem]">
                <img
                  src="/images/matchai-storefront-clean.webp"
                  alt="MATCHAI storefront in Agdal, Rabat"
                  className="aspect-[4/5] w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </figure>
        </div>

        {/* Address + hours */}
        <div
          ref={detailsRef}
          className="site-gutter invisible pointer-events-none absolute inset-0 flex items-end pb-6 pt-24 opacity-0 md:items-center md:pb-0"
        >
          <div className="pointer-events-auto w-full max-w-[30rem] rounded-[1.75rem] border border-white/50 bg-[#f6f1e7]/88 p-6 shadow-[0_1.5rem_4rem_rgba(45,50,36,0.12)] backdrop-blur-xl md:p-9">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold tracking-[0.2em] text-ink/50 uppercase">
                Visit us
              </p>
              <p className="text-[10px] font-bold tracking-[0.14em] text-matcha uppercase">
                Open daily
              </p>
            </div>

            <h2 className="mt-5 font-display text-[clamp(2.8rem,5vw,5rem)] leading-[0.85] font-bold tracking-[-0.05em] uppercase">
              Find us in
              <br />
              Agdal.
            </h2>

            <p className="mt-6 text-base leading-[1.6] text-ink/70 md:text-lg">
              72 Rue Oued Moulouya
              <br />
              Agdal, Rabat 10000
            </p>

            <dl className="mt-5 border-t border-ink/15 pt-4 md:mt-6 md:pt-5">
              {HOURS.map(([day, hours]) => (
                <div
                  key={day}
                  className="flex items-baseline justify-between py-0.5 text-[13px] md:py-1 md:text-base"
                >
                  <dt className="font-semibold tracking-[0.02em] text-ink/80">
                    {day}
                  </dt>
                  <dd className="tabular-nums text-ink/60">{hours}</dd>
                </div>
              ))}
            </dl>

            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="group mt-5 inline-flex items-center gap-3 rounded-full bg-matcha px-6 py-3.5 text-[11px] font-bold tracking-[0.11em] text-white uppercase transition-colors hover:bg-ink md:mt-7"
            >
              Get directions
              <span
                aria-hidden
                className="text-base leading-none transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                ↗
              </span>
            </a>
          </div>
        </div>

      </div>
    </div>
  )
})
