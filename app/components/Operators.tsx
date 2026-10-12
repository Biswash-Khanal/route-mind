import Card from "./ui/Card";
import Badge from "./ui/Badge";
import { MOCK_OPERATORS } from "@/shared/mock/operators";
import {
  Building2Icon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";

/**
 * Operator directory. Backed by sample data today; the shape matches
 * `OperatorDetails`, so the same card renders real rows unchanged.
 */
const Operators = () => (
  <section
    id="operators"
    className="mx-auto w-full max-w-6xl scroll-mt-24 px-10 pt-28"
  >
    <div className="flex items-end justify-between">
      <div className="max-w-xl">
        <span className="eyebrow">Network</span>
        <h2 className="mt-4">Operators on RouteMind</h2>
      </div>
      <span className="font-mono text-caption tracking-[0.12em] uppercase text-slate">
        {MOCK_OPERATORS.length} listed
      </span>
    </div>

    <div className="mt-10 grid grid-cols-2 gap-5">
      {MOCK_OPERATORS.map((operator) => (
        <Card key={operator.id} className="flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-md border border-mist bg-mist text-ink">
                <Building2Icon size={18} strokeWidth={1.5} />
              </span>
              <h3 className="text-h3">{operator.name}</h3>
            </div>
            {operator.websiteUrl && <Badge tone="walk">Verified</Badge>}
          </div>

          <dl className="flex flex-col gap-2 border-t border-mist pt-4 text-small">
            {operator.address && (
              <div className="flex items-center gap-2 text-slate">
                <dt className="sr-only">Address</dt>
                <MapPinIcon size={14} strokeWidth={1.5} className="shrink-0" />
                <dd>{operator.address}</dd>
              </div>
            )}
            {operator.contactEmail && (
              <div className="flex items-center gap-2 text-slate">
                <dt className="sr-only">Email</dt>
                <MailIcon size={14} strokeWidth={1.5} className="shrink-0" />
                <dd className="truncate">{operator.contactEmail}</dd>
              </div>
            )}
            {operator.contactPhone && (
              <div className="flex items-center gap-2 text-slate">
                <dt className="sr-only">Phone</dt>
                <PhoneIcon size={14} strokeWidth={1.5} className="shrink-0" />
                <dd>{operator.contactPhone}</dd>
              </div>
            )}
            {operator.licenseNumber && (
              <div className="flex items-center gap-2 text-slate">
                <dt className="sr-only">Licence</dt>
                <span className="inline-block size-3.5 shrink-0" aria-hidden="true" />
                <dd className="font-mono text-caption">
                  Licence {operator.licenseNumber}
                </dd>
              </div>
            )}
          </dl>
        </Card>
      ))}
    </div>

    <p className="mt-6 flex items-center gap-2 text-caption text-slate">
      <GlobeIcon size={13} strokeWidth={1.5} />
      Operator records are maintained by RouteMind administrators.
    </p>
  </section>
);

export default Operators;