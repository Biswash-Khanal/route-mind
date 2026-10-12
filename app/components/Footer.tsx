import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Plan a route", href: "#planner" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Operators", href: "#operators" },
    ],
  },
  {
    heading: "Network",
    links: [
      { label: "Stop index", href: "#planner" },
      { label: "Operator directory", href: "#operators" },
      { label: "Coverage", href: "#how-it-works" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-mist bg-surface">
      <div className="mx-auto w-full max-w-6xl px-10 py-14">
        <div className="flex justify-between gap-16">
          <div className="flex max-w-xs flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-md bg-ink">
                <span className="size-2.5 rounded-full bg-transit-400" />
              </span>
              <span className="text-h3 font-semibold tracking-[-0.03rem]">
                RouteMind
              </span>
            </div>
            <p className="text-small text-slate">
              Smarter routes. Less guesswork. Transit, walking, time and fares in
              one comparison.
            </p>
          </div>

          <div className="flex gap-20">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading} className="flex flex-col gap-3">
                <span className="eyebrow">{column.heading}</span>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-small text-slate transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-mist pt-6">
          <span className="font-mono text-caption tracking-[0.12em] uppercase text-slate">
            © {new Date().getFullYear()} RouteMind
          </span>
          <span className="font-mono text-caption tracking-[0.12em] uppercase text-stone">
            Sample data
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;