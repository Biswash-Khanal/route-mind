// 1. Master Route Entity (Complete DB Representation)
export interface MasterRoute {
  id: string;
  name: string;
  operatorId: string;
  fare: number;
  createdAt: string;
  updatedAt: string;
}

// 2. Public DTO
// Routes carry no sensitive fields, so the public endpoint and the admin dashboard
// both read this shape. `operatorId` stays a bare id rather than a nested operator
// object — the client already has `GET /api/operators` to resolve it against.
export type RouteDetails = MasterRoute;
