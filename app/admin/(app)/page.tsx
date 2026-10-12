import Link from "next/link";
import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import { ButtonLink } from "@/app/components/ui/Button";
import { ADMIN_METRICS } from "@/shared/mock/metrics";
import { CURRENT_ADMIN, ROLE_LABEL } from "@/shared/mock/admins";
import { MOCK_OPERATORS } from "@/shared/mock/operators";
import {
  ArrowUpRightIcon,
  BusFrontIcon,
  MapPinIcon,
  RouteIcon,
  UsersIcon,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    href: "/admin/admins",
    label: "Manage admins",
    body: "Invite, update roles, or revoke access.",
    Icon: UsersIcon,
  },
  {
    href: "/admin/operators",
    label: "Review operators",
    body: "Licences, contact details, and coverage.",
    Icon: BusFrontIcon,
  },
];

const METRIC_ICONS = [UsersIcon, BusFrontIcon, RouteIcon, MapPinIcon];

const AdminDashboardPage = () => (
  <div className="flex flex-col gap-10">
    <div>
      <span className="eyebrow">Overview</span>
      <h1 className="mt-3">
        Good to see you, {CURRENT_ADMIN.firstName}.
      </h1>
      <p className="mt-3 max-w-2xl">
        This dashboard reflects the transit network under your administration.
        Figures below come from the live database.
      </p>
    </div>

    <div className="flex items-center gap-2 border border-dashed border-stone rounded-md bg-surface px-4 py-3">
      <Badge tone="neutral">Sample data</Badge>
      <p className="text-caption text-slate">
        The underlying API is in place, but these figures are currently served
        from local sample data while the read endpoints are finished.
      </p>
    </div>

    <div className="grid grid-cols-4 gap-5">
      {ADMIN_METRICS.map((metric, index) => {
        const Icon = METRIC_ICONS[index];

        return (
          <Card key={metric.label} className="flex flex-col gap-3 p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-caption tracking-[0.12em] uppercase text-slate">
                {metric.label}
              </span>
              <Icon size={16} strokeWidth={1.5} className="text-stone" />
            </div>
            <span className="text-h1 font-semibold tracking-[-0.04em]">
              {metric.value}
            </span>
            {metric.detail && (
              <span className="text-caption text-slate">{metric.detail}</span>
            )}
          </Card>
        );
      })}
    </div>

    <div>
      <h2 className="text-h2">Quick actions</h2>
      <div className="mt-5 grid grid-cols-2 gap-5">
        {QUICK_ACTIONS.map(({ href, label, body, Icon }) => (
          <Link
            key={href}
            href={href}
            className="card flex flex-col items-start gap-3 p-6 transition-colors hover:border-ink"
          >
            <span className="flex size-10 items-center justify-center rounded-md border border-mist bg-mist text-ink">
              <Icon size={18} strokeWidth={1.5} />
            </span>
            <span className="flex w-full items-center justify-between">
              <span className="text-h3 font-semibold">{label}</span>
              <ArrowUpRightIcon size={16} strokeWidth={1.5} className="text-slate" />
            </span>
            <span className="text-small text-slate">{body}</span>
          </Link>
        ))}
      </div>
    </div>

    <div>
      <div className="flex items-end justify-between">
        <h2 className="text-h2">Operators on record</h2>
        <ButtonLink href="/admin/operators" variant="ghost" size="sm">
          View all
        </ButtonLink>
      </div>

      <Card className="mt-5 overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="border-b border-mist bg-mist">
            <tr>
              <th className="table-head">Operator</th>
              <th className="table-head">Licence</th>
              <th className="table-head">Contact</th>
              <th className="table-head">Last updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {MOCK_OPERATORS.map((operator) => (
              <tr key={operator.id} className="transition-colors hover:bg-mist">
                <td className="table-cell font-medium">{operator.name}</td>
                <td className="table-cell font-mono text-caption">
                  {operator.licenseNumber ?? "—"}
                </td>
                <td className="table-cell text-slate">
                  {operator.contactEmail ?? "—"}
                </td>
                <td className="table-cell text-caption text-slate">
                  {operator.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>

    <p className="text-caption text-slate">
      Signed in as @{CURRENT_ADMIN.username} —{" "}
      {ROLE_LABEL[CURRENT_ADMIN.role]}.
    </p>
  </div>
);

export default AdminDashboardPage;