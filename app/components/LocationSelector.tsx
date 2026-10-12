import Card, { CardTitle } from "./ui/Card";
import { MOCK_STOPS } from "@/shared/mock/stops";
import {
  ArrowLeftRightIcon,
  ChevronDownIcon,
  MapPinIcon,
} from "lucide-react";

interface LocationSelectorProps {
  id: string;
  label: string;
  value: string;
  options: { id: string; name: string }[];
  onChange: (id: string) => void;
}

/**
 * A labelled native select. Native rather than custom because it gets keyboard
 * behaviour, mobile pickers and screen-reader semantics for free — the chevron
 * is added back because `.select` strips the default one.
 */
const LocationSelect = ({
  id,
  label,
  value,
  options,
  onChange,
}: LocationSelectorProps) => (
  <div className="flex min-w-0 flex-1 flex-col gap-2">
    <label
      htmlFor={id}
      className="font-mono text-caption font-medium tracking-[0.14em] uppercase text-slate"
    >
      {label}
    </label>
    <div className="relative">
      <MapPinIcon
        size={18}
        strokeWidth={1.5}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-transit-500"
      />
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="select pl-9"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        size={16}
        strokeWidth={1.5}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate"
      />
    </div>
  </div>
);

interface LocationSelectorRootProps {
  fromId: string;
  toId: string;
  onFromChange: (id: string) => void;
  onToChange: (id: string) => void;
  onSwap: () => void;
}

/**
 * The From/To pair, including the swap control. Presented as a card with the
 * endpoints split by a divider so they read as the two ends of one journey.
 */
const LocationSelector = ({
  fromId,
  toId,
  onFromChange,
  onToChange,
  onSwap,
}: LocationSelectorRootProps) => {
  const options = MOCK_STOPS.map(({ id, name }) => ({ id, name }));

  return (
    <Card className="p-6">
      <CardTitle eyebrow="Step 01">Where are you going?</CardTitle>

      <div className="mt-5 flex items-end gap-4 max-lg:flex-col max-lg:items-stretch">
        <LocationSelect
          id="route-from"
          label="From"
          value={fromId}
          options={options}
          onChange={onFromChange}
        />

        <button
          type="button"
          onClick={onSwap}
          aria-label="Swap origin and destination"
          className="mb-0.5 flex size-10 shrink-0 items-center justify-center rounded-md border border-mist text-slate transition-colors hover:border-ink hover:text-ink"
        >
          <ArrowLeftRightIcon size={16} strokeWidth={1.5} />
        </button>

        <LocationSelect
          id="route-to"
          label="To"
          value={toId}
          options={options}
          onChange={onToChange}
        />
      </div>
    </Card>
  );
};

export default LocationSelector;