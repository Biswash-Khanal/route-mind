"use client";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import RouteTimeline, { RouteSummary } from "../RouteTimeline";
import { RouteOption, RouteOptionBadge } from "@/shared/mock/routeOptions";
import { cn } from "@/utilities/cn";

const BADGE_LABEL: Record<RouteOptionBadge, string> = {
  fastest: "Fastest",
  cheapest: "Cheapest",
  balanced: "Balanced",
};

interface RouteResultCardProps {
  option: RouteOption;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * One itinerary. The whole card is the select target and reports
 * `aria-pressed`, so the results list behaves as a single-choice control
 * without needing a separate radio input per card.
 */
const RouteResultCard = ({
  option,
  isSelected,
  onSelect,
}: RouteResultCardProps) => (
  <Card
    as="button"
    type="button"
    aria-pressed={isSelected}
    onClick={onSelect}
    accent={isSelected ? (option.mode === "transit" ? "transit" : "walk") : undefined}
    className={cn(
      "w-full cursor-pointer p-6 text-left transition-colors",
      isSelected ? "border-ink" : "hover:border-ink"
    )}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-h3 font-semibold">{option.routeName}</h3>
          <Badge tone={option.badge === "cheapest" ? "walk" : "transit"}>
            {BADGE_LABEL[option.badge]}
          </Badge>
        </div>
        <span className="text-caption text-slate">
          {option.operatorName ?? "No operator required"}
        </span>
      </div>

      <div className="shrink-0 text-right">
        <span className="font-mono text-h3 font-medium tracking-[-0.03em] text-ink">
          {option.departureTime}
        </span>
        <span className="mt-0.5 block font-mono text-caption text-slate">
          arrives {option.arrivalTime}
        </span>
      </div>
    </div>

    <div className="mt-5">
      <RouteSummary
        durationMinutes={option.durationMinutes}
        fare={option.fare}
        walkMinutes={option.walkMinutes}
        walkMeters={option.walkMeters}
        transfers={option.transfers}
      />
    </div>

    <div className="mt-6 border-t border-mist pt-5">
      <RouteTimeline legs={option.legs} />
    </div>

    {option.attributes.length > 0 && (
      <div className="mt-5 flex flex-wrap gap-2 border-t border-mist pt-5">
        {option.attributes.map((attribute) => (
          <Badge key={attribute} tone="neutral">
            {attribute}
          </Badge>
        ))}
      </div>
    )}
  </Card>
);

export default RouteResultCard;