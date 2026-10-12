import Link from "next/link";
import AdminSidebar from "../components/AdminSidebar";
import Badge from "@/app/components/ui/Badge";
import { CURRENT_ADMIN, ROLE_LABEL } from "@/shared/mock/admins";
import { ExternalLinkIcon } from "lucide-react";

/**
 * Layout for authenticated admin routes.
 *
 * Scoped to a route group so `/admin/login` sits outside it and renders without
 * the shell. `proxy.ts` matches on the request path, and route groups do not
 * contribute to the URL, so the `/admin/:path*` gate is unaffected.
 */
const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-full flex-1">
    <AdminSidebar />

    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-mist bg-surface px-10">
        <span className="eyebrow">Admin area</span>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-caption text-slate transition-colors hover:text-ink"
          >
            View public site
            <ExternalLinkIcon size={12} strokeWidth={1.75} />
          </Link>

          <span className="h-5 w-px bg-mist" aria-hidden="true" />

          {/* Placeholder identity — the real one comes from `GET /api/admin/me`. */}
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-ink font-mono text-caption text-paper">
              {CURRENT_ADMIN.firstName[0]}
              {CURRENT_ADMIN.lastName[0]}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-small font-medium">
                {CURRENT_ADMIN.firstName} {CURRENT_ADMIN.lastName}
              </span>
              <span className="text-caption text-slate">
                @{CURRENT_ADMIN.username}
              </span>
            </span>
            <Badge tone={CURRENT_ADMIN.role === "super-admin" ? "transit" : "neutral"}>
              {ROLE_LABEL[CURRENT_ADMIN.role]}
            </Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 px-10 py-10">{children}</main>
    </div>
  </div>
);

export default AdminLayout;