"use client"

import { MapPinIcon, XIcon } from "lucide-react";
import { useState } from "react";

interface LocationInputProps {

  label: string;
  options: string[];
}

const LocationInput = ({ label, options }: LocationInputProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex items-center border rounded-md px-2 py-1 w-full max-w-sm relative">
      {/* Map pin icon */}
      <MapPinIcon className="text-gray-500 mr-2" size={20} />

      {/* Label + selected value stacked */}
      <div className="flex flex-col flex-grow">
        <span className="text-xs text-gray-600 font-semibold">{label}</span>
        <span className="text-sm">
          {selected ?? "Select a location"}
        </span>
      </div>

      {/* Clear button */}
      {selected && (
        <button
          onClick={() => setSelected(null)}
          className="ml-2 text-gray-400 hover:text-red-500"
        >
          <XIcon size={16} />
        </button>
      )}

      {/* Hidden select element for accessibility */}
      <select
        value={selected ?? ""}
        onChange={(e) => setSelected(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
      >
        <option value="" disabled>
          Select a location
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

const LocationSelector = () => {
  return (
    <div className="flex gap-4 my-10">
      <LocationInput label="From" options={["Location A", "Location B", "Location C"]} />
      <LocationInput label="To" options={["Location X", "Location Y", "Location Z"]} />
    </div>
  );
};

export default LocationSelector;
