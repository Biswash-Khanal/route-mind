import type { ColumnType } from "kysely";

export interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
  username: string;
  password_hash: string;
  role: "admin" | "super-admin";
  created_at: ColumnType<string, string | undefined, never>;
  updated_at: ColumnType<string, string | undefined, string>;
}

export interface Routes {
  id: string;
  name: string;
  operator: string;
  fare: number;
  created_at: ColumnType<string, string | undefined, never>;
  updated_at: ColumnType<string, string | undefined, string>;
}

export interface RouteShapePoints {
  id: string;
  route_id: string;
  latitude: number;
  longitude: number;
  sequence: number;
  created_at: ColumnType<string, string | undefined, never>;
  updated_at: ColumnType<string, string | undefined, string>;
}

export interface RouteStops {
  id: string;
  route_id: string;
  stop_id: string;
  sequence: number;
  created_at: ColumnType<string, string | undefined, never>;
  updated_at: ColumnType<string, string | undefined, string>;
}

export interface Stops {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  created_at: ColumnType<string, string | undefined, never>;
  updated_at: ColumnType<string, string | undefined, string>;
}

export interface DB {
  stops: Stops;
  routes: Routes;
  route_stops: RouteStops;
  route_shape_points: RouteShapePoints;
  admin: Admin;
}
