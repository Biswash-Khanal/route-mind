import { MapPinnedIcon, ListFilterIcon, RouteIcon } from "lucide-react";

const STEPS = [
  {
    Icon: MapPinnedIcon,
    title: "Pick your two stops",
    body: "Search the stop index by name. Every stop is stored with coordinates, so what you see is what you get.",
  },
  {
    Icon: ListFilterIcon,
    title: "Say what matters",
    body: "Fastest, cheapest, least walking, accessible — these rank the results rather than hiding them.",
  },
  {
    Icon: RouteIcon,
    title: "Compare and choose",
    body: "Every itinerary arrives with its fare, duration, transfers and a leg-by-leg breakdown.",
  },
];

const HowItWorks = () => (
  <section
    id="how-it-works"
    className="mx-auto w-full max-w-6xl scroll-mt-24 px-10 pt-28"
  >
    <div className="max-w-xl">
      <span className="eyebrow">How it works</span>
      <h2 className="mt-4">
        Three steps, one comparison.
      </h2>
      <p className="mt-4">
        RouteMind keeps the routing logic honest: the same stops, the same
        operators, priced the same way every time.
      </p>
    </div>

    <ol className="mt-12 grid grid-cols-3 gap-6">
      {STEPS.map(({ Icon, title, body }, index) => (
        <li
          key={title}
          className="flex flex-col gap-4 border-t-2 border-ink pt-5"
        >
          <div className="flex items-center justify-between">
            <Icon size={22} strokeWidth={1.5} className="text-ink" />
            <span className="font-mono text-caption tracking-[0.14em] text-stone">
              0{index + 1}
            </span>
          </div>
          <h3 className="text-h3">{title}</h3>
          <p className="text-small">{body}</p>
        </li>
      ))}
    </ol>
  </section>
);

export default HowItWorks;