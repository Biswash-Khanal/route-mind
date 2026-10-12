"use client";

import { cn } from "@/utilities/cn";
import WalkIcon from "../Icons/WalkIcon";
import { BusFrontIcon } from "lucide-react";
import { RouteOption, TravelMode } from "@/shared/mock/routeOptions";

interface ModeToggleProps {
  value: TravelMode;
  onChange: (mode: TravelMode) => void;
}

const MODES = [
  { id: "transit" as const, label: "Transit", Icon: BusFrontIcon },
  { id: "walk" as const, label: "Walk", Icon: WalkIcon },
];

/**
 * Segmented mode picker. Rendered as a real radio group so it is keyboard
 * operable as a single unit rather than as two separate buttons.
 */
const ModeToggle = ({ value, onChange }: ModeToggleProps) => (
  <div
    role="radiogroup"
    aria-label="Travel mode"
    className="inline-flex items-center gap-1 rounded-md border border-mist bg-mist p-1"
  >
    {MODES.map(({ id, label, Icon }) => {
      const isActive = value === id;

      return (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={isActive}
          onClick={() => onChange(id)}
          className={cn(
            "inline-flex items-center gap-2 rounded-md px-5 py-2 text-small font-medium",
            "transition-colors",
            isActive
              ? id === "transit"
                ? "bg-transit-500 text-paper"
                : "bg-walk-500 text-paper"
              : "bg-transparent text-slate hover:text-ink"
          )}
        >
          <Icon size={16} strokeWidth={2} />
          {label}
        </button>
      );
    })}
  </div>
);

export default ModeToggle;

/** Exported for the results header, which reports the mode the results are for. */
export const modeLabel = (mode: TravelMode): string =>
  mode === "transit" ? "Transit options" : "Walking options";

/** Picks the route options that belong to the active mode. */
export const optionsForMode = (
  mode: TravelMode,
  options: RouteOption[]
): RouteOption[] => options.filter((option) => option.mode === mode);