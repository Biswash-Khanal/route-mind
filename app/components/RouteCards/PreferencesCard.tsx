"use client";

import Card, { CardTitle } from "../ui/Card";
import { cn } from "@/utilities/cn";

export interface PreferenceOption {
  id: string;
  label: string;
  description: string;
}

export const PREFERENCES: PreferenceOption[] = [
  {
    id: "fastest",
    label: "Fastest",
    description: "Shortest total travel time",
  },
  {
    id: "cheapest",
    label: "Cheapest",
    description: "Lowest total fare",
  },
  {
    id: "least-walking",
    label: "Least walking",
    description: "Stay on the vehicle as long as possible",
  },
  {
    id: "accessible",
    label: "Accessible",
    description: "Step-free and low-floor vehicles only",
  },
];

interface PreferencesCardProps {
  selected: string[];
  onToggle: (id: string) => void;
}

/**
 * Preference chips. These are advisory filters rather than strict constraints —
 * a route that violates one is still shown, just ranked lower — so they stay
 * checkboxes instead of radio buttons.
 */
const PreferencesCard = ({ selected, onToggle }: PreferencesCardProps) => (
  <Card className="flex h-full flex-col p-6">
    <CardTitle eyebrow="Step 03">What matters to you?</CardTitle>

    <div className="mt-5 flex flex-col gap-2.5">
      {PREFERENCES.map((preference) => {
        const isChecked = selected.includes(preference.id);

        return (
          <label
            key={preference.id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5",
              "transition-colors",
              isChecked
                ? "border-transit-500 bg-mist"
                : "border-mist hover:border-ink"
            )}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(preference.id)}
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-transit-500"
            />
            <span className="flex flex-col">
              <span className="text-small font-medium text-ink">
                {preference.label}
              </span>
              <span className="text-caption text-slate">
                {preference.description}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  </Card>
);

export default PreferencesCard;