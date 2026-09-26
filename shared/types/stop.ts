// 1. Master Stop Entity (Complete DB Representation)
export interface MasterStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

// 2. Public DTO
// A stop is a reusable location, not a row owned by any single route — many routes
// reference the same stop through `route_stops`. Stops hold no sensitive fields, so
// the public endpoint and the admin dashboard both read this shape.
export type StopDetails = MasterStop;
