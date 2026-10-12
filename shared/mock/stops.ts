// shared/mock/stops.ts
import { StopDetails } from "@/shared/types/stop";

/**
 * Sample stops used to populate the planner's From/To selects.
 *
 * Coordinates cluster around the Kathmandu valley so a real map engine will
 * frame them sensibly if one is added later.
 */
export const MOCK_STOPS: StopDetails[] = [
  {
    id: "8f1c2a40-1111-4a01-9c01-000000000001",
    name: "Ratna Park",
    latitude: 27.7048,
    longitude: 85.3087,
    createdAt: "2026-01-04 09:12:00",
    updatedAt: "2026-01-04 09:12:00",
  },
  {
    id: "8f1c2a40-1111-4a01-9c01-000000000002",
    name: "Basantapur Durbar Square",
    latitude: 27.7045,
    longitude: 85.3075,
    createdAt: "2026-01-04 09:14:00",
    updatedAt: "2026-01-04 09:14:00",
  },
  {
    id: "8f1c2a40-1111-4a01-9c01-000000000003",
    name: "Thamel Chowk",
    latitude: 27.7154,
    longitude: 85.312,
    createdAt: "2026-01-04 09:16:00",
    updatedAt: "2026-01-04 09:16:00",
  },
  {
    id: "8f1c2a40-1111-4a01-9c01-000000000004",
    name: "Swayambhunath",
    latitude: 27.7149,
    longitude: 85.2907,
    createdAt: "2026-01-04 09:18:00",
    updatedAt: "2026-01-04 09:18:00",
  },
  {
    id: "8f1c2a40-1111-4a01-9c01-000000000005",
    name: "Boudhanath Stupa",
    latitude: 27.7215,
    longitude: 85.362,
    createdAt: "2026-01-04 09:20:00",
    updatedAt: "2026-01-04 09:20:00",
  },
  {
    id: "8f1c2a40-1111-4a01-9c01-000000000006",
    name: "Patan Durbar Square",
    latitude: 27.6727,
    longitude: 85.325,
    createdAt: "2026-01-04 09:22:00",
    updatedAt: "2026-01-04 09:22:00",
  },
  {
    id: "8f1c2a40-1111-4a01-9c01-000000000007",
    name: "Tribhuvan International Airport",
    latitude: 27.6966,
    longitude: 85.3591,
    createdAt: "2026-01-04 09:24:00",
    updatedAt: "2026-01-04 09:24:00",
  },
  {
    id: "8f1c2a40-1111-4a01-9c01-000000000008",
    name: "Balaju",
    latitude: 27.7269,
    longitude: 85.3021,
    createdAt: "2026-01-04 09:26:00",
    updatedAt: "2026-01-04 09:26:00",
  },
];

/** Stable pick used to seed the planner so it never renders two identical stops. */
export const DEFAULT_FROM_STOP_ID = MOCK_STOPS[2].id;
export const DEFAULT_TO_STOP_ID = MOCK_STOPS[6].id;