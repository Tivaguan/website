export function Welcome() {
  return (
    <section
      id="welcome"
      className="site-gutter relative flex min-h-svh items-end overflow-hidden bg-[#f1f0e9] py-16 md:items-center md:py-24"
    >
      <div
        aria-hidden
        className="absolute -top-24 -right-40 h-[34rem] w-[34rem] rounded-full bg-matcha/8 blur-3xl"
      />

      <div
        data-welcome-copy
        className="relative z-20 mb-2 max-w-xl md:mb-0 md:w-[47%] md:max-w-2xl"
      >
        <p className="mb-7 text-[11px] font-bold tracking-[0.2em] text-matcha uppercase">
          Est. 2025 · Rabat
        </p>

        <h2 className="font-display text-[clamp(3.6rem,8.5vw,8.4rem)] leading-[0.88] font-bold tracking-[-0.045em] text-ink uppercase">
          Love at
          <br />
          first whisk.
        </h2>

        <p className="mt-7 max-w-md text-base leading-relaxed text-ink/65 md:ml-1 md:text-lg">
          Premium matcha, whisked before your eyes and layered exactly how you like
          it. Smooth, vibrant, and unmistakably MATCHAI.
        </p>
      </div>

    </section>
  )
}
