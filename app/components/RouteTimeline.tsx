import { Clock3Icon, CoinsIcon, FootprintsIcon, RepeatIcon } from "lucide-react";
import { RouteLeg, TravelMode } from "@/shared/mock/routeOptions";
import { cn } from "@/utilities/cn";
import WalkIcon from "./Icons/WalkIcon";
import { BusFrontIcon } from "lucide-react";

/** Minutes rendered as `1 h 05` / `32 min` — compact enough for a timeline row. */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;

  return `${hours} h ${String(rest).padStart(2, "0")}`;
};

export const formatDistance = (meters: number): string =>
  meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;

const MODE_STYLE: Record<TravelMode, { dot: string; text: string }> = {
  transit: { dot: "bg-transit-500", text: "text-transit-500" },
  walk: { dot: "bg-walk-500", text: "text-walk-500" },
};

interface RouteTimelineProps {
  legs: RouteLeg[];
}

/**
 * Vertical leg-by-leg breakdown. Each row is a mode-coloured marker on a
 * continuous rail, so the transit/walk split is readable at a glance without
 * needing to parse the labels.
 */
const RouteTimeline = ({ legs }: RouteTimelineProps) => (
  <ol className="flex flex-col">
    {legs.map((leg, index) => {
      const isLast = index === legs.length - 1;
      const style = MODE_STYLE[leg.mode];

      return (
        <li key={leg.id} className="flex gap-3">
          {/* Rail: the connector only renders between rows. */}
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "mt-1 flex size-7 shrink-0 items-center justify-center rounded-full",
                "bg-surface ring-4 ring-surface",
                leg.mode === "transit" ? "text-transit-500" : "text-walk-500"
              )}
            >
              {leg.mode === "transit" ? (
                <BusFrontIcon size={15} strokeWidth={1.75} />
              ) : (
                <WalkIcon size={15} strokeWidth={0} />
              )}
            </span>
            {!isLast && (
              <span className={cn("w-px flex-1", style.dot)} aria-hidden="true" />
            )}
          </div>

          <div className={cn("min-w-0 flex-1", isLast ? "pb-0" : "pb-5")}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-small font-medium text-ink">
                {leg.label}
              </span>
              <span className="shrink-0 font-mono text-caption text-slate">
                {formatDuration(leg.durationMinutes)}
              </span>
            </div>
            <span className="text-caption text-slate">{leg.detail}</span>

            {leg.mode === "transit" ? (
              <div className="mt-1.5 flex items-center gap-3 text-caption">
                {leg.stops !== undefined && (
                  <span className="text-slate">{leg.stops} stops</span>
                )}
                {leg.fare !== undefined && (
                  <span className="font-medium text-ink">
                    NPR {leg.fare.toFixed(0)}
                  </span>
                )}
              </div>
            ) : (
              leg.distanceMeters !== undefined && (
                <span className="mt-1.5 block text-caption text-slate">
                  {formatDistance(leg.distanceMeters)}
                </span>
              )
            )}
          </div>
        </li>
      );
    })}
  </ol>
);

interface RouteSummaryProps {
  durationMinutes: number;
  fare: number;
  walkMinutes: number;
  walkMeters: number;
  transfers: number;
}

/** The four headline numbers shown at the top of a result card. */
export const RouteSummary = ({
  durationMinutes,
  fare,
  walkMinutes,
  walkMeters,
  transfers,
}: RouteSummaryProps) => {
  const stats = [
    {
      Icon: Clock3Icon,
      label: "Duration",
      value: formatDuration(durationMinutes),
    },
    {
      Icon: CoinsIcon,
      label: "Fare",
      value: fare === 0 ? "Free" : `NPR ${fare.toFixed(0)}`,
    },
    {
      Icon: FootprintsIcon,
      label: "Walking",
      value: `${walkMinutes} min`,
      detail: formatDistance(walkMeters),
    },
    {
      Icon: RepeatIcon,
      label: "Transfers",
      value: transfers === 0 ? "Direct" : `${transfers}`,
    },
  ];

  return (
    <dl className="grid grid-cols-4 gap-3">
      {stats.map(({ Icon, label, value, detail }) => (
        <div
          key={label}
          className="flex flex-col gap-0.5 border-l-2 border-mist pl-3"
        >
          <dt className="flex items-center gap-1.5 font-mono text-caption tracking-[0.1em] uppercase text-slate">
            <Icon size={13} strokeWidth={1.75} />
            {label}
          </dt>
          <dd className="text-small font-semibold text-ink">{value}</dd>
          {detail && <dd className="text-caption text-slate">{detail}</dd>}
        </div>
      ))}
    </dl>
  );
};

export default RouteTimeline;