// shared/mock/routeOptions.ts

export type TravelMode = "transit" | "walk";

/** One hop of an itinerary — either a walk or a ride on a specific route. */
export interface RouteLeg {
  id: string;
  mode: TravelMode;
  /** Short verb phrase, e.g. "Walk to Machhapokhari" or "Bus 12". */
  label: string;
  /** Sub-label: operator, destination, or the road name for a walk. */
  detail: string;
  durationMinutes: number;
  distanceMeters?: number;
  fare?: number;
  /** Up to this many stops; the backend will replace this with the real count. */
  stops?: number;
}

export type RouteOptionBadge = "fastest" | "cheapest" | "balanced";

/**
 * A complete itinerary as the planner would eventually receive it. The shape
 * mirrors what a routing endpoint is expected to return: headline numbers for
 * the card, plus the ordered leg breakdown for the timeline.
 */
export interface RouteOption {
  id: string;
  name: string;
  badge: RouteOptionBadge;
  mode: TravelMode;
  /** Null for a walk-only itinerary, which has no operator. */
  operatorName: string | null;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  fare: number;
  walkMinutes: number;
  walkMeters: number;
  transfers: number;
  /** Accessibility notes surfaced as tags on the result card. */
  attributes: string[];
  legs: RouteLeg[];
}

export const MOCK_ROUTE_OPTIONS: RouteOption[] = [
  {
    id: "r7e8f901-3333-4a03-9a03-000000000001",
    name: "Ratna Park → Airport",
    badge: "fastest",
    mode: "transit",
    operatorName: "Kathmandu Valley Bus",
    routeName: "Line 12",
    departureTime: "08:15",
    arrivalTime: "08:47",
    durationMinutes: 32,
    fare: 45,
    walkMinutes: 9,
    walkMeters: 740,
    transfers: 1,
    attributes: ["Low floor", "Covered"],
    legs: [
      {
        id: "l7e8f901-3333-4a03-9a03-000000000001",
        mode: "walk",
        label: "Walk to Sundhara Chowk",
        detail: "via Thapathali Road",
        durationMinutes: 5,
        distanceMeters: 410,
      },
      {
        id: "l7e8f901-3333-4a03-9a03-000000000002",
        mode: "transit",
        label: "Bus 12",
        detail: "Sundhara Chowk → Tribhuvan Airport",
        durationMinutes: 22,
        stops: 11,
        fare: 40,
      },
      {
        id: "l7e8f901-3333-4a03-9a03-000000000003",
        mode: "walk",
        label: "Walk to Terminal",
        detail: "across the airport loop",
        durationMinutes: 4,
        distanceMeters: 330,
      },
    ],
  },
  {
    id: "r7e8f901-3333-4a03-9a03-000000000002",
    name: "Ratna Park → Airport",
    badge: "cheapest",
    mode: "transit",
    operatorName: "Sajha Yatayat",
    routeName: "Tempo Line B",
    departureTime: "08:22",
    arrivalTime: "09:01",
    durationMinutes: 39,
    fare: 25,
    walkMinutes: 12,
    walkMeters: 980,
    transfers: 0,
    attributes: ["Direct", "Cheapest fare"],
    legs: [
      {
        id: "l7e8f901-3333-4a03-9a03-000000000004",
        mode: "walk",
        label: "Walk to Ratna Park Gate",
        detail: "via the Bagmati Path",
        durationMinutes: 7,
        distanceMeters: 560,
      },
      {
        id: "l7e8f901-3333-4a03-9a03-000000000005",
        mode: "transit",
        label: "Tempo Line B",
        detail: "Ratna Park → Airport Road",
        durationMinutes: 30,
        stops: 14,
        fare: 20,
      },
      {
        id: "l7e8f901-3333-4a03-9a03-000000000006",
        mode: "walk",
        label: "Walk to Terminal",
        detail: "short walk from the highway stop",
        durationMinutes: 2,
        distanceMeters: 180,
      },
    ],
  },
  {
    id: "r7e8f901-3333-4a03-9a03-000000000003",
    name: "Ratna Park → Airport",
    badge: "balanced",
    mode: "walk",
    operatorName: null,
    routeName: "On foot",
    departureTime: "08:15",
    arrivalTime: "09:22",
    durationMinutes: 67,
    fare: 0,
    walkMinutes: 67,
    walkMeters: 5200,
    transfers: 0,
    attributes: ["Step-free", "No fare"],
    legs: [
      {
        id: "l7e8f901-3333-4a03-9a03-000000000007",
        mode: "walk",
        label: "Walk via Ring Road",
        detail: "the direct footpath stays flat",
        durationMinutes: 42,
        distanceMeters: 3100,
      },
      {
        id: "l7e8f901-3333-4a03-9a03-000000000008",
        mode: "walk",
        label: "Walk along the airport road",
        detail: "final stretch past the terminal",
        durationMinutes: 25,
        distanceMeters: 2100,
      },
    ],
  },
];