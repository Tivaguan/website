const FOOTER_LINKS = [
  ['Drinks', '#drinks'],
  ['Our Way', '#experience'],
  ['Story', '#story'],
]

const EXTERNAL_LINKS = [
  ['Google Reviews', 'https://g.page/r/CcIeJbuEvlhOEBM/review'],
  ['Instagram', 'https://www.instagram.com/matchai.ma/'],
  [
    'TikTok',
    'https://www.tiktok.com/@matchai.ra?is_from_webapp=1&sender_device=pc',
  ],
]

function scrollToSection(event) {
  const href = event.currentTarget.getAttribute('href')
  const target = document.querySelector(href)

  if (!target) return

  event.preventDefault()
  target.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
    block: 'start',
  })
  window.history.replaceState(null, '', href)
}

export function Footer() {
  return (
    <footer className="relative z-[60] overflow-hidden bg-ink text-[#f6f1e7]">
      <div className="site-gutter relative pt-14 pb-8 md:pt-20 md:pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(10rem,0.45fr)_minmax(14rem,0.65fr)] lg:gap-16">
          <div className="md:col-span-2 lg:col-span-1">
            <p className="font-display text-[clamp(3.5rem,6vw,6.5rem)] leading-[0.84] font-semibold tracking-[-0.045em] uppercase">
              Follow
              <br />
              the ritual.
            </p>

            <a
              href="#home"
              onClick={scrollToSection}
              className="group mt-8 inline-flex items-center gap-3 py-3 text-[10px] font-semibold tracking-[0.16em] text-white/55 uppercase transition-colors hover:text-white"
            >
              Back to top
              <span
                aria-hidden
                className="text-sm transition-transform duration-300 group-hover:-translate-y-1"
              >
                ↑
              </span>
            </a>
          </div>

          <nav aria-label="Footer navigation">
            <p className="mb-5 text-[9px] font-semibold tracking-[0.2em] text-white/35 uppercase">
              Explore
            </p>
            <div className="-my-1 flex flex-col items-start gap-1">
              {FOOTER_LINKS.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={scrollToSection}
                  className="py-2.5 font-display text-xl leading-none font-medium tracking-[-0.015em] text-white/65 uppercase transition-colors hover:text-white md:text-2xl"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>

          <nav aria-label="Social and review links">
            <p className="mb-5 text-[9px] font-semibold tracking-[0.2em] text-white/35 uppercase">
              Elsewhere
            </p>
            <div className="-my-1 flex flex-col items-start gap-1">
              {EXTERNAL_LINKS.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 py-2.5 font-display text-xl leading-none font-medium tracking-[-0.015em] text-white/65 uppercase transition-colors hover:text-white md:text-2xl"
                >
                  {label}
                  <span
                    aria-hidden
                    className="text-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-16 pb-12 md:mt-20 md:pb-16">
          <p
            className="font-display text-[clamp(7rem,22vw,22rem)] leading-[0.72] font-bold tracking-[-0.065em] text-[#f6f1e7] uppercase"
            aria-label="MATCHAI"
          >
            MATCHAI
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 pt-6 text-[9px] font-semibold tracking-[0.16em] text-white/40 uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MATCHAI</p>
          <p>All rights reserved</p>
        </div>
      </div>
    </footer>
  )
}
