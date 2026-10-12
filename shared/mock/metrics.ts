// shared/mock/metrics.ts

export interface Stat {
  label: string;
  value: string;
  /** Optional qualifier shown under the number. */
  detail?: string;
}

/** Headline numbers for the public landing hero. */
export const PLATFORM_STATS: Stat[] = [
  { label: "Routes mapped", value: "128" },
  { label: "Stops indexed", value: "1,240" },
  { label: "Operators", value: "9" },
  { label: "Cities covered", value: "3" },
];

/** Tile data for the admin dashboard. */
export const ADMIN_METRICS: Stat[] = [
  { label: "Admin accounts", value: "6", detail: "1 super-admin" },
  { label: "Operators", value: "4", detail: "3 with a website" },
  { label: "Routes", value: "128", detail: "across all operators" },
  { label: "Stops", value: "1,240", detail: "geo-referenced" },
];