"use client";

import { useMemo, useState } from "react";
import Card from "./ui/Card";
import Button, { ButtonLink } from "./ui/Button";
import LocationSelector from "./LocationSelector";
import ModeToggle from "./ActionButtons/ModeToggle";
import PreferencesCard from "./RouteCards/PreferencesCard";
import RouteResultCard from "./RouteCards/RouteResultCard";
import MapView from "./MapView";
import {
  DEFAULT_FROM_STOP_ID,
  DEFAULT_TO_STOP_ID,
} from "@/shared/mock/stops";
import {
  MOCK_ROUTE_OPTIONS,
  RouteOptionBadge,
  TravelMode,
} from "@/shared/mock/routeOptions";
import { formatDuration } from "./RouteTimeline";
import { MoveRightIcon, RotateCcwIcon } from "lucide-react";

const DEFAULTS = {
  fromId: DEFAULT_FROM_STOP_ID,
  toId: DEFAULT_TO_STOP_ID,
  mode: "transit" as TravelMode,
  preferences: ["fastest"] as string[],
};

/**
 * Owns every piece of planner state. The individual controls stay stateless and
 * presentational; this is the single place where a selection becomes a query.
 *
 * Results are currently seeded from `shared/mock/routeOptions`. Replacing
 * `MOCK_ROUTE_OPTIONS` with a fetch against a routing endpoint is the only
 * change needed here — the filter/sort below already works on the real shape.
 */
const RoutePlanner = () => {
  const [fromId, setFromId] = useState(DEFAULTS.fromId);
  const [toId, setToId] = useState(DEFAULTS.toId);
  const [mode, setMode] = useState<TravelMode>(DEFAULTS.mode);
  const [preferences, setPreferences] = useState<string[]>(DEFAULTS.preferences);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const options = useMemo(
    () => MOCK_ROUTE_OPTIONS.filter((option) => option.mode === mode),
    [mode]
  );

  // Ranked, not filtered: a preference is a soft signal, so a route that does
  // not satisfy one is demoted rather than removed.
  const rankedOptions = useMemo(
    () =>
      [...options].sort((a, b) => {
        const rankOf = (badge: RouteOptionBadge) => {
          const index = preferences.indexOf(badge);
          return index === -1 ? preferences.length : index;
        };

        return rankOf(a.badge) - rankOf(b.badge);
      }),
    [options, preferences]
  );

  const selectedRoute = rankedOptions.find(
    (option) => option.id === selectedRouteId
  );

  const togglePreference = (id: string) =>
    setPreferences((current) =>
      current.includes(id)
        ? current.filter((preference) => preference !== id)
        : [...current, id]
    );

  const swapEndpoints = () => {
    setFromId(toId);
    setToId(fromId);
  };

  const reset = () => {
    setFromId(DEFAULTS.fromId);
    setToId(DEFAULTS.toId);
    setMode(DEFAULTS.mode);
    setPreferences(DEFAULTS.preferences);
    setSelectedRouteId(null);
    setHasSearched(false);
  };

  const runSearch = () => {
    setHasSearched(true);
    setSelectedRouteId(rankedOptions[0]?.id ?? null);
  };

  return (
    <section id="planner" className="mx-auto w-full max-w-6xl scroll-mt-24 px-10">
      <Card className="p-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-start justify-between gap-8">
            <LocationSelector
              fromId={fromId}
              toId={toId}
              onFromChange={setFromId}
              onToChange={setToId}
              onSwap={swapEndpoints}
            />
            <div className="hidden shrink-0 items-center gap-2 pt-7 text-caption text-stone">
              <MoveRightIcon size={14} strokeWidth={1.5} />
              live search
            </div>
          </div>

          <hr className="border-t border-mist" />

          <div className="grid grid-cols-[auto_1fr] gap-8">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Step 02</span>
              <ModeToggle value={mode} onChange={setMode} />
              <span className="text-caption text-slate">
                Compare transit against walking.
              </span>
            </div>

            <PreferencesCard selected={preferences} onToggle={togglePreference} />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-mist pt-6">
            <Button variant="secondary" onClick={reset}>
              <RotateCcwIcon size={15} strokeWidth={1.75} />
              Reset
            </Button>
            <Button size="lg" onClick={runSearch}>
              Find route
              <MoveRightIcon size={17} strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-h2">
              {hasSearched ? "3 routes found" : "Your routes"}
              <span className="ml-3 text-small font-normal text-slate">
                {mode === "transit" ? "Transit options" : "Walking options"}
              </span>
            </h2>
          </div>

          {!hasSearched && (
            <Card className="flex items-center justify-center border-dashed px-6 py-16">
              <p className="text-center text-small text-slate">
                Pick two stops and choose what matters to you —
                <br />
                then select <span className="text-ink">Find route</span> to
                compare itineraries.
              </p>
            </Card>
          )}

          {hasSearched &&
            rankedOptions.map((option) => (
              <RouteResultCard
                key={option.id}
                option={option}
                isSelected={selectedRouteId === option.id}
                onSelect={() => setSelectedRouteId(option.id)}
              />
            ))}
        </div>

        <div className="sticky top-24 flex flex-col gap-4">
          <MapView />
          <Card className="p-5">
            <span className="eyebrow">Selected</span>
            {selectedRoute ? (
              <div className="mt-3 flex flex-col gap-1">
                <span className="text-h3 font-semibold">
                  {selectedRoute.routeName}
                </span>
                <span className="text-small text-slate">
                  {formatDuration(selectedRoute.durationMinutes)} ·{" "}
                  {selectedRoute.fare === 0
                    ? "no fare"
                    : `NPR ${selectedRoute.fare.toFixed(0)}`}{" "}
                  · departs {selectedRoute.departureTime}
                </span>
              </div>
            ) : (
              <p className="mt-3 text-small text-slate">
                Choose a route to see its summary here.
              </p>
            )}
            <ButtonLink
              href="#planner"
              variant="secondary"
              size="sm"
              className="mt-4 w-full"
            >
              Start over
            </ButtonLink>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RoutePlanner;