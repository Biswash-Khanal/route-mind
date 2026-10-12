"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../LogoutButton";
import { cn } from "@/utilities/cn";
import {
  LayoutDashboardIcon,
  MapIcon,
  Settings2Icon,
  UsersIcon,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboardIcon, exact: true },
  { href: "/admin/admins", label: "Admins", Icon: UsersIcon },
  { href: "/admin/operators", label: "Operators", Icon: MapIcon },
  { href: "/admin/account", label: "Account", Icon: Settings2Icon },
];

/**
 * Admin chrome.
 *
 * This is a client component only because highlighting the current route needs
 * `usePathname()`. The sidebar itself is chrome, not a page gate — access is
 * already enforced by `proxy.ts` for pages and `requireAdminAuth` for the API.
 */
const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-mist bg-surface">
      <div>
        <Link
          href="/admin"
          className="flex h-16 items-center gap-2.5 border-b border-mist px-6"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-ink">
            <span className="size-2.5 rounded-full bg-transit-400" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-small font-semibold tracking-[-0.02rem]">
              RouteMind
            </span>
            <span className="font-mono text-caption tracking-[0.12em] uppercase text-slate">
              Admin
            </span>
          </span>
        </Link>

        <nav className="flex flex-col gap-1 p-4">
          {NAV_ITEMS.map(({ href, label, Icon, exact }) => {
            // `/admin` must match exactly or it would stay active on every child
            // route, since every admin URL starts with it.
            const isActive = exact ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-small transition-colors",
                  isActive
                    ? "bg-mist font-medium text-ink"
                    : "text-slate hover:bg-mist hover:text-ink"
                )}
              >
                <Icon size={17} strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-mist p-4">
        <LogoutButton className="w-full justify-start" />
      </div>
    </aside>
  );
};

export default AdminSidebar;