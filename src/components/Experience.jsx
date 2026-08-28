const VALUES = [
  {
    title: 'Authenticity',
    copy: 'We source our matcha directly from traditional Japanese farms, ensuring every cup honors centuries of tradition.',
  },
  {
    title: 'Passion',
    copy: 'Our love for matcha culture drives us to create exceptional experiences that go beyond just serving drinks.',
  },
  {
    title: 'Innovation',
    copy: 'We honor traditional methods while infusing modern flavors, crafting unique drinks designed for today’s tastes.',
  },
  {
    title: 'Community',
    copy: 'Beyond serving matcha, we create a community where quality and connection go hand in hand.',
  },
]

function ExperiencePanel() {
  return (
    <div
      data-experience-panel="experience"
      className="absolute inset-0 overflow-hidden"
    >
      <div className="site-gutter absolute inset-x-0 top-24 z-20 md:top-28">
        <p className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">
          The MATCHAI experience
        </p>
      </div>

      <div className="site-gutter grid h-full grid-rows-[auto_1fr] pt-24 pb-7 md:grid-cols-12 md:grid-rows-1 md:items-center md:pt-28 md:pb-10">
        <div className="relative z-10 pt-12 md:col-span-5 md:pt-0">
          <h2 className="font-display text-[clamp(3.4rem,7vw,7rem)] leading-[0.84] font-bold tracking-[-0.05em] uppercase">
            Made in
            <br />
            the moment.
          </h2>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/72 md:text-lg">
            Your cup is whisked in front of you, layered around your taste and
            served at its freshest. The ritual stays considered. The result
            feels completely yours.
          </p>
        </div>

        <div className="relative min-h-[36svh] md:col-span-7 md:h-[72svh]">
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 aspect-square w-[min(33rem,74vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#82a84b]/45 blur-2xl"
          />
          <img
            src="/images/matcha-ceremony-cutout.png"
            alt="A ceramic bowl of matcha with a bamboo whisk, scoop, and matcha powder"
            className="absolute inset-0 h-full w-full object-contain [filter:drop-shadow(0_18px_13px_rgba(25,38,14,0.24))]"
          />
        </div>
      </div>
    </div>
  )
}

export function Experience({ washRef }) {
  return (
    <section
      id="experience"
      className="experience-liquid relative text-[#f6f1e7]"
      aria-label="The MATCHAI experience and values"
    >
      <div
        ref={washRef}
        data-experience-wash
        aria-hidden
        className="experience-liquid pointer-events-none fixed inset-0 z-[15] opacity-0 will-change-[opacity]"
      />

      <div
        id="experience-stage"
        className="relative z-20 h-[32svh]"
      >
        <div
          data-experience-stage-content
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-svh"
        >
          <ExperiencePanel />
        </div>
      </div>

      <div
        id="values"
        data-experience-panel="values"
        className="experience-values relative z-[25] min-h-svh overflow-hidden text-[#f6f1e7]"
      >
        <div className="site-gutter flex min-h-svh flex-col pt-24 pb-10 md:pt-28 md:pb-12">
          <p className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">
            Our values
          </p>

          <div className="grid flex-1 gap-12 pt-10 md:grid-cols-12 md:items-center md:gap-8 md:pt-4">
            <div className="md:order-2 md:col-span-5 md:col-start-8">
              <h2 className="font-display text-[clamp(4.2rem,7.6vw,8rem)] leading-[0.82] font-bold tracking-[-0.055em] uppercase">
                The values
                <br />
                behind
                <br />
                every cup.
              </h2>

              <p className="mt-8 max-w-md text-lg leading-relaxed text-white/72 md:text-xl">
                Everything we do is guided by our commitment to quality,
                tradition and community.
              </p>
            </div>

            <div className="border-t border-white/30 md:order-1 md:col-span-6 md:col-start-1 md:row-start-1">
              {VALUES.map((value) => (
                <article
                  key={value.title}
                  className="grid gap-4 border-b border-white/22 py-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] md:items-start md:gap-8 md:py-7"
                >
                  <h3 className="font-display text-2xl leading-[0.95] font-semibold tracking-[-0.025em] uppercase md:text-[1.75rem] lg:text-[2rem]">
                    {value.title}
                  </h3>

                  <p className="max-w-md text-base leading-relaxed text-white/68 md:text-[1.05rem]">
                    {value.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
