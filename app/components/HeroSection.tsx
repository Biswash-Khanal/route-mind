import { ButtonLink } from "./ui/Button";
import { PLATFORM_STATS } from "@/shared/mock/metrics";

const HeroSection = () => {
  return (
    <section className="mx-auto w-full max-w-6xl px-10 pt-20 pb-16">
      <div className="flex flex-col items-center text-center">
        <span className="eyebrow">smarter routes. less guesswork</span>

        <h1 className="mt-6 max-w-3xl text-[3.25rem] leading-[1.06] font-semibold tracking-[-0.045em]">
          Every way across town,
          <br />
          side by side.
        </h1>

        <p className="mt-6 max-w-xl text-body">
          Plan your journey with the right balance of transit, walking, time and
          fare — then pick the one that actually suits you.
        </p>

        <div className="mt-9 flex items-center gap-3">
          <ButtonLink href="#planner" size="lg">
            Find a route
          </ButtonLink>
          <ButtonLink href="#how-it-works" variant="secondary" size="lg">
            How it works
          </ButtonLink>
        </div>
      </div>

      {/* Stat strip: hairline-separated so it reads as a data row, not as cards. */}
      <dl className="mt-20 grid grid-cols-4 divide-x divide-mist border-y border-mist">
        {PLATFORM_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 py-6">
            <dt className="font-mono text-caption tracking-[0.14em] uppercase text-slate">
              {stat.label}
            </dt>
            <dd className="text-h2 font-semibold tracking-[-0.04rem] text-ink">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default HeroSection;