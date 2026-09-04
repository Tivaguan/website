const PHONE_DETAILS = {
  apple: {
    platform: 'Apple Wallet',
    image: '/images/apple-wallet-loyalty-card-v2.jpg',
  },
  google: {
    platform: 'Google Wallet',
    image: '/images/google-wallet-loyalty-card-clean.png',
  },
}

function PhoneMockup({ variant }) {
  const details = PHONE_DETAILS[variant]
  const isApple = variant === 'apple'

  return (
    <figure
      className={`relative w-[clamp(10rem,44vw,13.5rem)] sm:w-[clamp(13.5rem,19vw,18rem)] ${
        isApple ? 'rotate-[-7deg]' : 'rotate-[6deg]'
      }`}
    >
      <div
        className={`relative aspect-[0.49] overflow-hidden border border-white/15 bg-[#111] p-[7px] shadow-[0_2.5rem_5rem_rgba(25,31,21,0.3),0_0.4rem_1rem_rgba(25,31,21,0.18)] ${
          isApple ? 'rounded-[3.25rem]' : 'rounded-[2.75rem]'
        }`}
      >
        <div
          className={`relative h-full overflow-hidden bg-[#eef1f7] ${
            isApple ? 'rounded-[2.85rem]' : 'rounded-[2.35rem]'
          }`}
        >
          <div className="absolute inset-x-0 top-0 z-20 flex h-9 items-center justify-between px-5 text-[8px] font-semibold text-black">
            <span>9:41</span>
            <span className="tracking-[0.12em]">● ◒ ▰</span>
          </div>

          {isApple ? (
            <div className="absolute top-2.5 left-1/2 z-30 h-[1.15rem] w-[4.5rem] -translate-x-1/2 rounded-full bg-black" />
          ) : (
            <div className="absolute top-2.5 left-1/2 z-30 size-2 -translate-x-1/2 rounded-full bg-black" />
          )}

          {isApple ? (
            <div className="absolute inset-x-0 top-9 aspect-[0.707] overflow-hidden">
              <img
                src={details.image}
                alt={`${details.platform} MATCHAI loyalty card`}
                className="h-full w-full object-contain object-top [clip-path:inset(2.7%_2.8%_2.2%_2.8%_round_1.45rem)]"
              />
            </div>
          ) : (
            <img
              src={details.image}
              alt={`${details.platform} MATCHAI loyalty card`}
              className="absolute inset-x-0 top-9 h-[calc(100%-3rem)] w-full object-contain object-top"
            />
          )}

          <div className="absolute inset-x-0 bottom-3 flex justify-center">
            <div className="h-1 w-20 rounded-full bg-black/70" />
          </div>
        </div>
      </div>

      <figcaption className="mt-5 flex justify-center">
        <span className="rounded-full border border-ink/10 bg-white/90 px-4 py-2 text-[9px] font-bold tracking-[0.14em] text-ink/60 uppercase backdrop-blur-md">
          {details.platform}
        </span>
      </figcaption>
    </figure>
  )
}

export function Loyalty() {
  return (
    <section
      id="loyalty"
      className="relative z-[50] min-h-svh overflow-hidden bg-white text-ink isolation-isolate"
    >
      <div className="site-gutter absolute inset-x-0 top-28 z-20">
        <p className="text-[10px] font-bold tracking-[0.2em] text-ink/55 uppercase">
          Loyalty
        </p>
      </div>

      <div className="site-gutter relative grid min-h-svh items-center gap-10 py-24 sm:gap-16 sm:py-28 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
        <article className="relative z-10 max-w-[35rem]">
          <h2 className="font-display text-[clamp(2.75rem,11vw,4.2rem)] sm:text-[clamp(4.2rem,7vw,7.5rem)] leading-[0.82] font-bold tracking-[-0.055em] uppercase">
            Sip, Stamp,
            <br />
            Repeat.
          </h2>

          <p className="mt-8 max-w-lg text-lg leading-[1.65] text-ink/68">
            Add your MATCHAI card to Apple Wallet or Google Wallet. Each visit
            adds a stamp, and every cup brings you closer to your next reward.
          </p>

          <a
            href="https://matchai.scanini.ma/loyalty"
            target="_blank"
            rel="noreferrer"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-matcha px-6 py-3.5 text-[11px] font-bold tracking-[0.11em] text-white uppercase transition-colors hover:bg-ink"
          >
            Join MATCHAI Loyalty
            <span
              aria-hidden
              className="text-base leading-none transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </a>
        </article>

        <div className="relative flex min-h-[30rem] items-center justify-center sm:min-h-[42rem] lg:min-h-[48rem]">
          <div className="absolute inset-x-[8%] bottom-[10%] h-[14%] rounded-[50%] bg-ink/12 blur-3xl" />
          <div className="relative flex items-center justify-center gap-0 sm:gap-4">
            <div className="relative z-20 translate-x-5 translate-y-10 sm:translate-x-8">
              <PhoneMockup variant="apple" />
            </div>
            <div className="relative z-10 -translate-x-5 -translate-y-8 sm:-translate-x-2">
              <PhoneMockup variant="google" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
