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
  return (
    <header className="site-gutter fixed inset-x-0 top-0 z-40 flex h-20 items-center justify-between border-b border-ink/[0.07] bg-white/90 backdrop-blur-xl">
      <a
        href="#home"
        onClick={scrollToSection}
        className="inline-flex items-center text-ink"
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

      <a
        href="https://matchai.scanini.ma"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 rounded-full bg-matcha px-5 py-2.5 text-[11px] font-semibold tracking-[0.1em] text-white uppercase transition-colors hover:bg-ink"
      >
        Order now
        <span
          aria-hidden
          className="text-sm leading-none transition-transform duration-300 group-hover:translate-x-0.5"
        >
          ↗
        </span>
      </a>
    </header>
  )
}
