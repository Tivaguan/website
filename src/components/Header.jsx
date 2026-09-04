import { useEffect, useState } from 'react'

const LINKS = [
  ['Welcome', '#welcome'],
  ['Drinks', '#drinks'],
  ['Our Way', '#experience'],
  ['Loyalty', '#loyalty'],
  ['Story', '#story'],
  ['Visit', '#visit'],
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

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  // The panel covers the page, so keep the document behind it still while it
  // is open and let Escape close it the way a dialog would.
  useEffect(() => {
    if (!menuOpen) return

    // The page scrolls on <html> (body only clips overflow-x), so lock the
    // document element while the panel is open.
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.documentElement.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const handleMenuNavigate = (event) => {
    setMenuOpen(false)
    scrollToSection(event)
  }

  return (
    <>
    <header className="site-gutter fixed inset-x-0 top-0 z-40 flex h-20 items-center justify-between border-b border-ink/[0.07] bg-white/90 backdrop-blur-xl">
      <a
        href="#home"
        onClick={scrollToSection}
        className="-my-2 inline-flex items-center py-2 text-ink"
        aria-label="MATCHAI home"
      >
        <span className="font-display text-[1.75rem] leading-none font-bold tracking-[-0.05em]">
          MATCHAI
        </span>
      </a>

      <nav
        aria-label="Main navigation"
        className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
      >
        {LINKS.map(([label, href]) => (
          <a
            key={label}
            href={href}
            onClick={scrollToSection}
            className="rounded-full px-3.5 py-2 text-[11px] font-bold tracking-[0.13em] text-ink/58 uppercase transition-colors hover:bg-ink/[0.04] hover:text-ink"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <a
          href="https://matchai.scanini.ma"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full bg-matcha px-4 py-3 text-[11px] font-semibold tracking-[0.1em] text-white uppercase transition-colors hover:bg-ink sm:px-5 sm:py-2.5"
        >
          Order now
          <span
            aria-hidden
            className="text-sm leading-none transition-transform duration-300 group-hover:translate-x-0.5"
          >
            ↗
          </span>
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="-mr-2 flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.05] lg:hidden"
        >
          <span aria-hidden className="relative block h-3 w-5">
            <span
              className={`absolute inset-x-0 top-0 h-[1.5px] bg-current transition-transform duration-300 ${
                menuOpen ? 'translate-y-[5.25px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute inset-x-0 bottom-0 h-[1.5px] bg-current transition-transform duration-300 ${
                menuOpen ? '-translate-y-[5.25px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

    </header>

    {/* Sibling of the header: the header's backdrop-filter would otherwise
        become the containing block and pin this panel to the header box. */}
    <div
      id="mobile-menu"
      hidden={!menuOpen}
      className="fixed inset-x-0 top-20 bottom-0 z-30 bg-white/97 backdrop-blur-xl lg:hidden"
    >
      <nav
        aria-label="Mobile navigation"
        className="site-gutter flex h-full flex-col justify-center gap-1 pb-24"
      >
        {LINKS.map(([label, href]) => (
          <a
            key={label}
            href={href}
            onClick={handleMenuNavigate}
            className="border-b border-ink/[0.07] py-4 font-display text-[2rem] leading-none font-bold tracking-[-0.04em] text-ink uppercase"
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
    </>
  )
}
