import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import { MOCK_OPERATORS } from "@/shared/mock/operators";
import { MOCK_STOPS } from "@/shared/mock/stops";
import { formatAdminDate } from "@/shared/mock/admins";
import { GlobeIcon } from "lucide-react";

/**
 * Operator directory. Served from sample data — the admin operators endpoint
 * currently exposes create only, so there is nothing to read yet.
 */
const AdminOperatorsPage = () => (
  <div className="flex flex-col gap-10">
    <div>
      <span className="eyebrow">Network</span>
      <h1 className="mt-3">Operators</h1>
      <p className="mt-3 max-w-2xl">
        Companies whose services appear in RouteMind. Each operator can own
        multiple routes, and every route is made up of stops from the shared stop
        index.
      </p>
    </div>

    <Card className="overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="border-b border-mist bg-mist">
          <tr>
            <th className="table-head">Operator</th>
            <th className="table-head">Licence</th>
            <th className="table-head">Contact</th>
            <th className="table-head">Website</th>
            <th className="table-head">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-mist">
          {MOCK_OPERATORS.map((operator) => (
            <tr key={operator.id} className="transition-colors hover:bg-mist">
              <td className="table-cell">
                <span className="font-medium">{operator.name}</span>
                {operator.address && (
                  <span className="mt-0.5 block text-caption text-slate">
                    {operator.address}
                  </span>
                )}
              </td>
              <td className="table-cell font-mono text-caption">
                {operator.licenseNumber ?? "—"}
              </td>
              <td className="table-cell">
                <span className="block truncate text-slate">
                  {operator.contactEmail ?? "—"}
                </span>
                {operator.contactPhone && (
                  <span className="mt-0.5 block text-caption text-slate">
                    {operator.contactPhone}
                  </span>
                )}
              </td>
              <td className="table-cell">
                {operator.websiteUrl ? (
                  <span className="inline-flex items-center gap-1.5 text-slate">
                    <GlobeIcon size={13} strokeWidth={1.75} />
                    <span className="max-w-40 truncate">
                      {operator.websiteUrl.replace(/^https?:\/\//, "")}
                    </span>
                  </span>
                ) : (
                  <Badge tone="neutral">Not listed</Badge>
                )}
              </td>
              <td className="table-cell text-caption text-slate">
                {formatAdminDate(operator.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>

    <p className="text-caption text-slate">
      {MOCK_OPERATORS.length} operators referencing{" "}
      <span className="text-ink">{MOCK_STOPS.length}</span> indexed stops in the
      sample network.
    </p>
  </div>
);

export default AdminOperatorsPage;