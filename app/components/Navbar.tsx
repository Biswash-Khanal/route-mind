import Link from "next/link";
import { ButtonLink } from "./ui/Button";
import { cn } from "@/utilities/cn";

const NAV_LINKS = [
  { href: "#planner", label: "Plan a route" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#operators", label: "Operators" },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-mist bg-paper/85 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-ink">
            <span className="size-2.5 rounded-full bg-transit-400" />
          </span>
          <span className="text-h3 font-semibold tracking-[-0.03rem]">
            RouteMind
          </span>
        </Link>

        <ul className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-small text-slate transition-colors hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <ButtonLink href="/admin" variant="secondary" size="sm">
              Admin
            </ButtonLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;